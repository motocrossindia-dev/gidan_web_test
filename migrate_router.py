#!/usr/bin/env python3
"""
Migrate all react-router-dom usages to Next.js equivalents:
  useNavigate  → useRouter  (next/navigation)
  useLocation  → usePathname + useSearchParams (next/navigation)
  useParams    → useParams  (next/navigation)
  Link         → Link       (next/link)
  NavLink      → Link       (next/link)
  Outlet       → removed (Next.js uses layout children)
"""
import os, re, sys

SRC = os.path.join(os.path.dirname(__file__), "src")
EXTENSIONS = (".jsx", ".tsx", ".js", ".ts")
SKIP_SUFFIXES = (".backup.jsx", ".backup.tsx", ".backup.js", "CheckoutPage.jsx.backup")

changed_files = []
skipped_files = []

def needs_use_client(content):
    return "'use client'" in content or '"use client"' in content

def ensure_use_client(content):
    if needs_use_client(content):
        return content
    return "'use client';\n" + content

def remove_rrd_import_line(content, symbols):
    """Remove specific symbols from react-router-dom import lines."""
    # Match any import { ... } from 'react-router-dom' or "react-router-dom"
    pattern = re.compile(
        r'import\s*\{([^}]+)\}\s*from\s*["\']react-router-dom["\'];?\s*\n?'
    )
    def replacer(m):
        imported = [s.strip() for s in m.group(1).split(',')]
        remaining = [s for s in imported if s and s not in symbols]
        if not remaining:
            return ''
        return f'import {{ {", ".join(remaining)} }} from "react-router-dom";\n'
    return pattern.sub(replacer, content)

def extract_rrd_symbols(content):
    """Return set of symbols imported from react-router-dom."""
    pattern = re.compile(r'import\s*\{([^}]+)\}\s*from\s*["\']react-router-dom["\']')
    symbols = set()
    for m in pattern.finditer(content):
        for s in m.group(1).split(','):
            symbols.add(s.strip())
    return symbols

def add_next_imports(content, need_router, need_pathname, need_search_params, need_params, need_link, need_nav_link):
    """Insert next/navigation and next/link imports after 'use client' or at top."""
    nav_hooks = []
    if need_router: nav_hooks.append('useRouter')
    if need_pathname: nav_hooks.append('usePathname')
    if need_search_params: nav_hooks.append('useSearchParams')
    if need_params: nav_hooks.append('useParams')

    inserts = []
    if nav_hooks:
        inserts.append(f'import {{ {", ".join(nav_hooks)} }} from "next/navigation";')
    if need_link or need_nav_link:
        # Only add if next/link not already imported
        if 'from "next/link"' not in content and "from 'next/link'" not in content:
            inserts.append('import Link from "next/link";')

    if not inserts:
        return content

    insert_str = '\n'.join(inserts) + '\n'

    # Insert after 'use client' directive if present
    uc_match = re.search(r"('use client'|\"use client\");?\s*\n", content)
    if uc_match:
        pos = uc_match.end()
        return content[:pos] + insert_str + content[pos:]

    # Otherwise insert at very top
    return insert_str + content

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        original = f.read()

    content = original
    symbols = extract_rrd_symbols(content)

    if not symbols:
        return False  # nothing to do

    has_navigate = 'useNavigate' in symbols
    has_location = 'useLocation' in symbols
    has_params = 'useParams' in symbols
    has_link = 'Link' in symbols
    has_navlink = 'NavLink' in symbols
    has_outlet = 'Outlet' in symbols

    # Determine what we actually need from useLocation usage
    needs_pathname = has_location and ('location.pathname' in content or 'location?.pathname' in content)
    needs_search = has_location and ('location.search' in content or 'location?.search' in content or 'location.state' in content)
    # If useLocation used but only for pathname
    if has_location and not needs_pathname and not needs_search:
        needs_pathname = True  # default to pathname

    # Remove all react-router-dom imports
    content = remove_rrd_import_line(content, symbols)

    # Add next/navigation imports
    content = add_next_imports(
        content,
        need_router=has_navigate,
        need_pathname=needs_pathname,
        need_search_params=needs_search,
        need_params=has_params,
        need_link=has_link,
        need_nav_link=has_navlink
    )

    # Replace useNavigate hook declaration
    if has_navigate:
        content = re.sub(
            r'const\s+navigate\s*=\s*useNavigate\(\)\s*;?',
            'const router = useRouter();',
            content
        )
        # Replace navigate() calls
        # navigate('/path') → router.push('/path')
        content = re.sub(r'\bnavigate\(', 'router.push(', content)

    # Replace useLocation
    if has_location:
        if needs_pathname and not needs_search:
            content = re.sub(
                r'const\s+location\s*=\s*useLocation\(\)\s*;?',
                'const pathname = usePathname();',
                content
            )
            content = re.sub(r'\blocation\.pathname\b', 'pathname', content)
            content = re.sub(r'\blocation\b', 'pathname', content)
        elif needs_search and not needs_pathname:
            content = re.sub(
                r'const\s+location\s*=\s*useLocation\(\)\s*;?',
                'const searchParams = useSearchParams();\n  const pathname = usePathname();',
                content
            )
            content = re.sub(r'\blocation\.pathname\b', 'pathname', content)
            content = re.sub(r'\blocation\.search\b', '`?${searchParams.toString()}`', content)
            content = re.sub(r'\blocation\.state\b', 'null', content)
            content = re.sub(r'\blocation\b', 'pathname', content)
        else:
            content = re.sub(
                r'const\s+location\s*=\s*useLocation\(\)\s*;?',
                'const pathname = usePathname();\n  const searchParams = useSearchParams();',
                content
            )
            content = re.sub(r'\blocation\.pathname\b', 'pathname', content)
            content = re.sub(r'\blocation\.search\b', '`?${searchParams.toString()}`', content)
            content = re.sub(r'\blocation\.state\b', 'null', content)
            content = re.sub(r'\blocation\b', 'pathname', content)

    # Replace useParams — next/navigation useParams works similarly
    # (no change needed for usage, just import source)

    # Replace NavLink → Link (next/link Link doesn't have activeClassName etc, just use Link)
    if has_navlink:
        content = re.sub(r'\bNavLink\b', 'Link', content)

    # Remove Outlet usage (replace with nothing or a comment)
    if has_outlet:
        content = re.sub(r'<Outlet\s*/>', '{/* Outlet removed - use Next.js layout children */}', content)
        content = re.sub(r'<Outlet>', '{/* Outlet removed */}', content)

    # Ensure 'use client' if file uses hooks
    if any([has_navigate, has_location, has_params, has_navlink]):
        content = ensure_use_client(content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    total = 0
    for root, dirs, files in os.walk(SRC):
        # skip node_modules and .next
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.next', '__pycache__')]
        for fname in files:
            if not any(fname.endswith(ext) for ext in EXTENSIONS):
                continue
            if any(fname.endswith(s) for s in SKIP_SUFFIXES):
                skipped_files.append(fname)
                continue
            fpath = os.path.join(root, fname)
            try:
                result = migrate_file(fpath)
                if result:
                    rel = os.path.relpath(fpath, SRC)
                    changed_files.append(rel)
                    total += 1
            except Exception as e:
                print(f"ERROR {fpath}: {e}")

    print(f"\nMigrated {total} files:")
    for f in sorted(changed_files):
        print(f"  ✓ {f}")
    if skipped_files:
        print(f"\nSkipped {len(skipped_files)} backup files")

if __name__ == '__main__':
    main()

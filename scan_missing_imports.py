#!/usr/bin/env python3
import os, re

SRC = "/Users/hawk/Biotechmaali_ecommerce_mohan/biotechmaali-next/src"

missing_pathname = []
missing_searchparams = []
missing_router = []

for root, dirs, files in os.walk(SRC):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".next")]
    for fname in files:
        if not fname.endswith((".jsx", ".tsx", ".js", ".ts")) or fname.endswith(".backup"):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, encoding="utf-8", errors="replace") as f:
            content = f.read()

        nav_import_match = re.search(r"import\s*\{([^}]+)\}\s*from\s*['\"]next/navigation['\"]", content)
        imported_hooks = set()
        if nav_import_match:
            for h in nav_import_match.group(1).split(","):
                imported_hooks.add(h.strip())

        # Find active (non-commented) hook calls
        active_lines = [l for l in content.split("\n") if not l.strip().startswith("//")]
        active = "\n".join(active_lines)

        rel = os.path.relpath(fpath, SRC)

        if "usePathname()" in active and "usePathname" not in imported_hooks:
            missing_pathname.append(rel)
        if "useSearchParams()" in active and "useSearchParams" not in imported_hooks:
            missing_searchparams.append(rel)
        if "useRouter()" in active and "useRouter" not in imported_hooks:
            missing_router.append(rel)

print("Missing usePathname import:")
for f in sorted(missing_pathname):
    print("  " + f)

print("\nMissing useSearchParams import:")
for f in sorted(missing_searchparams):
    print("  " + f)

print("\nMissing useRouter import:")
for f in sorted(missing_router):
    print("  " + f)

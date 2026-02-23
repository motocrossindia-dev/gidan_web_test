#!/usr/bin/env python3
import os, re

SRC = "/Users/hawk/Biotechmaali_ecommerce_mohan/biotechmaali-next/src"
HOOKS = ["useSearchParams()", "usePathname()", "useRouter()", "useParams()"]

problems = []
for root, dirs, files in os.walk(SRC):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".next")]
    for fname in files:
        if not fname.endswith((".jsx", ".tsx", ".js", ".ts")) or fname.endswith(".backup.jsx"):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
        for i, line in enumerate(lines):
            stripped = line.rstrip()
            if stripped.startswith("  const ") and not stripped.startswith("  //"):
                if any(h in stripped for h in HOOKS):
                    found_commented_fn = False
                    for j in range(max(0, i-5), i):
                        prev = lines[j].rstrip()
                        if re.match(r"^//.*function\s+\w+", prev) or re.match(r"^//\s*//.*function", prev):
                            found_commented_fn = True
                            break
                    if found_commented_fn:
                        rel = os.path.relpath(fpath, SRC)
                        problems.append((rel, i+1, stripped.strip()))

if not problems:
    print("No orphaned hook declarations found.")
else:
    for rel, lineno, code in sorted(problems):
        print(rel + ":" + str(lineno) + ": " + code)

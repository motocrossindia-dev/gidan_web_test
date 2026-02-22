#!/usr/bin/env python3
import os, re

SEO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src/views/utilities/seo")

for fname in os.listdir(SEO_DIR):
    if not fname.endswith(".jsx"):
        continue
    fpath = os.path.join(SEO_DIR, fname)
    with open(fpath) as f:
        content = f.read()
    if "react-helmet" not in content:
        continue

    orig = content
    # Remove 'use client'
    content = re.sub(r"""^['"]use client['"];\s*\n""", "", content)
    # Remove helmet imports
    content = re.sub(r"""import \{ Helmet \} from ['"]react-helmet-async['"];\s*\n""", "", content)
    content = re.sub(r"""import \{ HelmetProvider, Helmet \} from ['"]react-helmet-async['"];\s*\n""", "", content)
    content = re.sub(r"""import \{ HelmetProvider \} from ['"]react-helmet-async['"];\s*\n""", "", content)
    # Replace <Helmet>...<script>...</script>...</Helmet>
    content = re.sub(
        r'<Helmet>\s*<script type="application/ld\+json">\s*\{JSON\.stringify\((\w+)\)\}\s*</script>\s*</Helmet>',
        lambda m: '<script\n      type="application/ld+json"\n      dangerouslySetInnerHTML={{ __html: JSON.stringify(' + m.group(1) + ') }}\n    />',
        content
    )
    if content != orig:
        with open(fpath, "w") as f:
            f.write(content)
        print("Fixed:", fname)
    else:
        print("No change needed:", fname)

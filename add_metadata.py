#!/usr/bin/env python3
"""Add per-page metadata exports to Next.js page files for SEO."""
import os, re

APP = os.path.join(os.path.dirname(__file__), "src/app")
BASE_URL = "https://gidanbackendtest.mymotokart.in"

# Map route segment → (title, description)
PAGE_META = {
    "": ("Gidan - Plants, Seeds & Gardening Store Online India", "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening & vertical garden services across India."),
    "about-us": ("About Us | Gidan Plants & Gardening", "Learn about Gidan's mission to bring greenery into every home. Trusted plant and gardening brand in India."),
    "contact-us": ("Contact Us | Gidan Plants", "Get in touch with Gidan for plant queries, order support or service enquiries. We're here to help."),
    "careers": ("Careers at Gidan | Join Our Green Team", "Explore exciting job opportunities at Gidan - India's growing plants and gardening brand."),
    "faq": ("FAQ | Frequently Asked Questions | Gidan Plants", "Find answers to common questions about ordering plants, delivery, care tips and returns at Gidan."),
    "blogcomponent": ("Blog | Plant Care Tips & Gardening Guides | Gidan", "Explore expert plant care articles, gardening how-tos and seasonal tips on the Gidan blog."),
    "cart": ("Your Cart | Gidan Plants", "Review the plants and products in your shopping cart. Checkout securely at Gidan."),
    "checkout": ("Checkout | Gidan Plants", "Complete your purchase of plants and gardening products at Gidan. Secure checkout with Razorpay."),
    "bestseller": ("Best Selling Plants & Pots | Gidan", "Shop Gidan's best-selling indoor plants, outdoor plants, pots and planters loved by thousands of customers."),
    "latest": ("New Arrivals - Latest Plants & Products | Gidan", "Discover the latest plants, pots, seeds and gardening accessories just added to the Gidan store."),
    "featured": ("Featured Products | Gidan Plants", "Hand-picked featured plants and gardening products curated by the Gidan team."),
    "dealofweek": ("Deal of the Week | Gidan Plants", "Grab this week's special deals on plants, pots and gardening tools - limited time offers at Gidan."),
    "birthday": ("Birthday Gifts - Plants & Pots | Gidan", "Surprise your loved ones with beautiful plants and personalised pots as birthday gifts from Gidan."),
    "anniversary": ("Anniversary Gifts - Plants | Gidan", "Celebrate love with elegant indoor plants and gift sets. Perfect anniversary gifts from Gidan."),
    "housewarming": ("Housewarming Gifts - Plants & Decor | Gidan", "Bring good luck and fresh greenery to a new home. Shop housewarming plant gifts at Gidan."),
    "gifts": ("Gift Plants & Hampers | Gidan", "Shop curated plant gift hampers and personalised green gifts for every occasion at Gidan."),
    "giftcard": ("E-Gift Cards | Gidan Plants", "Give the gift of green! Send an e-gift card from Gidan and let your loved ones choose their favourite plants."),
    "combooffer": ("Combo Offers - Plants & Accessories | Gidan", "Save more with Gidan's exclusive plant and pot combo deals. Best value bundles online."),
    "flower": ("Flowering Plants | Gidan Plant Store", "Buy beautiful flowering plants for balcony, garden and indoors. Wide variety available at Gidan."),
    "franchise-enquiry": ("Franchise Enquiry | Gidan Plants", "Interested in owning a Gidan franchise? Fill out our franchise enquiry form and grow with us."),
    "corporate": ("Corporate Gifting - Plants | Gidan", "Elevate corporate gifting with premium indoor plants and green décor. Bulk orders welcome at Gidan."),
    "WishList": ("Wishlist | Gidan Plants", "View and manage your saved plants and products on your Gidan wishlist."),
    "search": ("Search Results | Gidan Plants", "Browse search results for plants, pots, seeds and gardening products at Gidan."),
    "profile/Wallet": ("My Wallet | Gidan Plants", "Manage your Gidan wallet, view balance and transaction history."),
    "profile/referal": ("Referral Program | Gidan Plants", "Refer friends to Gidan and earn rewards. Share your referral code and get exciting benefits."),
    "profile/trackorder": ("Track My Order | Gidan Plants", "Check the live status and tracking details of your Gidan plant order."),
    "mobilesidebar": ("My Account | Gidan Plants", "Access your Gidan profile, orders, wishlist and wallet from one place."),
    "btcoins": ("BT Coins | Gidan Rewards", "Earn and redeem BT Coins on your Gidan purchases. Check your coins balance and history."),
}

METADATA_TEMPLATE = '''\
import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: "{title}",
  description: "{desc}",
  openGraph: {{
    title: "{title}",
    description: "{desc}",
    url: "{url}",
    siteName: "Gidan Plants",
    images: [{{ url: "https://gidanbackendtest.mymotokart.in/logo192.ico", width: 512, height: 512 }}],
    locale: "en_IN",
    type: "website",
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{title}",
    description: "{desc}",
  }},
  alternates: {{
    canonical: "{url}",
  }},
  robots: {{
    index: true,
    follow: true,
  }},
}};
'''

def route_from_path(filepath):
    rel = os.path.relpath(filepath, APP)
    parts = rel.split(os.sep)
    # Remove 'page.tsx' at end
    parts = [p for p in parts if p not in ('page.tsx', 'page.jsx')]
    return '/'.join(parts)

def inject_metadata(filepath, title, desc, url):
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # Skip if already has metadata
    if 'export const metadata' in content or 'generateMetadata' in content:
        return False

    meta_block = METADATA_TEMPLATE.format(title=title, desc=desc, url=url)

    # If 'use client' at top, metadata can't be in that file — add to a separate metadata file
    # Actually client components can't export metadata in Next.js.
    # Only add if no 'use client'
    if "'use client'" in content[:60] or '"use client"' in content[:60]:
        # Create a sibling metadata file instead — but it's complex
        # Better: strip use client from the page wrapper and make the default export a wrapper
        # For simplicity, skip 'use client' page files — their layout provides metadata
        return False

    # Add import if not present
    if 'import type { Metadata }' not in content and "import type {Metadata}" not in content:
        meta_block = 'import type { Metadata } from "next";\n\n' + METADATA_TEMPLATE.format(title=title, desc=desc, url=url).replace('import type { Metadata } from "next";\n\n', '')
    else:
        meta_block = METADATA_TEMPLATE.format(title=title, desc=desc, url=url).replace('import type { Metadata } from "next";\n\n', '')

    # Insert before the default export
    insert_pos = content.find('export default')
    if insert_pos == -1:
        return False

    new_content = content[:insert_pos] + meta_block + '\n' + content[insert_pos:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True


def main():
    changed = 0
    for root, dirs, files in os.walk(APP):
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.next')]
        for fname in files:
            if fname not in ('page.tsx', 'page.jsx'):
                continue
            fpath = os.path.join(root, fname)
            route = route_from_path(fpath)

            # Match route to metadata
            title, desc = None, None
            for key, meta in PAGE_META.items():
                if key == route or (key == '' and route == ''):
                    title, desc = meta
                    break

            # For dynamic routes and unmatched, generate generic
            if title is None:
                # Check if dynamic (contains [)
                if '[' in route:
                    continue  # skip dynamic routes — use generateMetadata instead
                # Generic fallback
                page_name = route.replace('-', ' ').replace('/', ' | ').title()
                title = f"{page_name} | Gidan Plants"
                desc = f"Shop {page_name.lower()} at Gidan - India's trusted plant and gardening online store."

            url = f"{BASE_URL}/{route}"
            result = inject_metadata(fpath, title, desc, url)
            if result:
                changed += 1
                print(f"  ✓ {route or '/'}")

    print(f"\nAdded metadata to {changed} pages.")

if __name__ == '__main__':
    main()

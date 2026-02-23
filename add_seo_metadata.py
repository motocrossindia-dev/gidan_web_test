#!/usr/bin/env python3
import os, re

APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src/app")
BASE_URL = "https://www.gidan.store"

PAGE_META = {
    "": ("Gidan - Plants, Seeds & Gardening Store Online India", "Buy plants, seeds, pots, soil and gardening tools online at Gidan. Expert landscaping, terrace gardening and vertical garden services across India."),
    "about-us": ("About Us | Gidan Plants and Gardening", "Learn about Gidan mission to bring greenery into every home. Trusted plant and gardening brand in India."),
    "contact-us": ("Contact Us | Gidan Plants", "Get in touch with Gidan for plant queries, order support or service enquiries."),
    "careers": ("Careers at Gidan | Join Our Green Team", "Explore exciting job opportunities at Gidan - India growing plants and gardening brand."),
    "faq": ("FAQ | Gidan Plants", "Find answers to common questions about ordering plants, delivery, care tips and returns at Gidan."),
    "blogcomponent": ("Blog | Plant Care and Gardening Guides | Gidan", "Expert plant care articles, gardening how-tos and seasonal tips on the Gidan blog."),
    "cart": ("Your Cart | Gidan Plants", "Review the plants and products in your shopping cart at Gidan."),
    "checkout": ("Checkout | Gidan Plants", "Complete your purchase at Gidan. Secure checkout powered by Razorpay."),
    "bestseller": ("Best Selling Plants and Pots | Gidan", "Shop best-selling indoor plants, outdoor plants, pots and planters loved by thousands."),
    "latest": ("New Arrivals - Latest Plants and Products | Gidan", "Discover the latest plants, pots, seeds and gardening accessories just added to Gidan."),
    "featured": ("Featured Products | Gidan Plants", "Hand-picked featured plants and gardening products curated by the Gidan team."),
    "feature": ("Featured Plants | Gidan", "Browse featured plants and gardening products collection at Gidan."),
    "dealofweek": ("Deal of the Week | Gidan Plants", "This week special deals on plants, pots and gardening tools at Gidan."),
    "birthday": ("Birthday Gift Plants and Pots | Gidan", "Surprise your loved ones with beautiful plants and personalised pots as birthday gifts."),
    "anniversary": ("Anniversary Gift Plants | Gidan", "Celebrate love with elegant indoor plants and gift sets. Perfect anniversary gifts from Gidan."),
    "housewarming": ("Housewarming Gift Plants and Decor | Gidan", "Bring greenery and good luck to a new home. Shop housewarming plant gifts at Gidan."),
    "gifts": ("Gift Plants and Hampers | Gidan", "Shop curated plant gift hampers and personalised green gifts for every occasion at Gidan."),
    "giftcard": ("E-Gift Cards | Gidan Plants", "Send an e-gift card and let them choose their favourite plants at Gidan."),
    "combooffer": ("Combo Offers - Plants and Accessories | Gidan", "Save more with exclusive plant and pot combo deals at Gidan."),
    "flower": ("Flowering Plants | Gidan Plant Store", "Buy beautiful flowering plants for balcony, garden and indoors at Gidan."),
    "franchise-enquiry": ("Franchise Enquiry | Gidan Plants", "Interested in owning a Gidan franchise? Fill the enquiry form and grow with us."),
    "corporate": ("Corporate Gifting Plants | Gidan", "Premium indoor plants and green decor for corporate gifting. Bulk orders welcome at Gidan."),
    "WishList": ("Wishlist | Gidan Plants", "View and manage your saved plants and products on your Gidan wishlist."),
    "search": ("Search Plants and Products | Gidan", "Browse search results for plants, pots, seeds and gardening products at Gidan."),
    "btcoins": ("BT Coins | Gidan Rewards", "Earn and redeem BT Coins on your Gidan purchases. Check your coins balance and history."),
    "PaymentGateway": ("Payment | Gidan Plants", "Complete your payment securely at Gidan."),
    "hamburger": ("Menu | Gidan Plants", "Explore all categories at Gidan Plants."),
    "seeds": ("Seeds | Gidan Plant Store", "Buy a wide variety of herb, vegetable and flower seeds online at Gidan."),
    "pots": ("Pots and Planters | Gidan", "Shop beautiful pots, planters and containers for indoor and outdoor plants at Gidan."),
    "ourwork": ("Our Work | Gidan Landscaping Portfolio", "See portfolio of landscaping, terrace gardens and vertical garden installations by Gidan."),
    "about": ("About Gidan Plants", "Discover Gidan story, values and commitment to making India greener."),
    "privacy-policy": ("Privacy Policy | Gidan Plants", "Read Gidan privacy policy to understand how we collect and use your data."),
    "terms-and-conditions": ("Terms and Conditions | Gidan Plants", "Read Gidan terms and conditions for using the website and placing orders."),
    "return-policy": ("Return and Refund Policy | Gidan Plants", "Understand return, replacement and refund policy for plants and products at Gidan."),
    "mobilesidebar": ("My Account | Gidan Plants", "Access your Gidan profile, orders, wishlist and wallet."),
    "mobilesidebar/address": ("My Addresses | Gidan Plants", "Manage your saved delivery addresses on Gidan."),
    "mobilesidebar/editprofile": ("Edit Profile | Gidan Plants", "Update your name, email and profile details on Gidan."),
    "mobilesidebar/giftcardmobile": ("Gift Card | Gidan Plants", "Manage your Gidan gift cards and view balance."),
    "mobilesidebar/referalmobile": ("Referral Program | Gidan Plants", "Refer friends and earn rewards with the Gidan referral program."),
    "mobilesidebar/walletmobile": ("Wallet | Gidan Plants", "View and manage your Gidan wallet balance and history."),
    "history": ("Order History | Gidan Plants", "View your complete order history and past purchases at Gidan."),
    "add-address": ("Add Address | Gidan Plants", "Add a new delivery address to your Gidan account."),
    "address": ("Manage Addresses | Gidan Plants", "View and manage your saved delivery addresses at Gidan."),
    "mobile-login": ("Login | Gidan Plants", "Login to your Gidan account with your mobile number."),
    "mobile-signin": ("Sign In | Gidan Plants", "Sign in to your Gidan Plants account."),
    "mobile-verification": ("Verify OTP | Gidan Plants", "Verify your mobile number with OTP to access Gidan Plants."),
}


def route_from_path(fpath, app_dir):
    rel = os.path.relpath(fpath, app_dir)
    parts = rel.split(os.sep)
    parts = [p for p in parts if p not in ("page.tsx", "page.jsx")]
    return "/".join(parts)


def build_metadata(title, desc, url):
    lines = [
        'export const metadata: Metadata = {',
        '  title: "' + title + '",',
        '  description: "' + desc + '",',
        '  openGraph: {',
        '    title: "' + title + '",',
        '    description: "' + desc + '",',
        '    url: "' + url + '",',
        '    siteName: "Gidan Plants",',
        '    images: [{ url: "https://www.gidan.store/gidan-og.jpg", width: 1200, height: 630 }],',
        '    locale: "en_IN",',
        '    type: "website",',
        '  },',
        '  twitter: {',
        '    card: "summary_large_image",',
        '    title: "' + title + '",',
        '    description: "' + desc + '",',
        '  },',
        '  alternates: { canonical: "' + url + '" },',
        '  robots: { index: true, follow: true },',
        '};',
        '',
    ]
    return "\n".join(lines)


changed = 0
skipped_dynamic = 0

for root, dirs, files in os.walk(APP):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".next")]
    for fname in files:
        if fname not in ("page.tsx", "page.jsx"):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        if "export const metadata" in content or "generateMetadata" in content:
            continue

        route = route_from_path(fpath, APP)

        if "[" in route:
            skipped_dynamic += 1
            continue

        title, desc = PAGE_META.get(route, (None, None))
        if title is None:
            page_name = route.replace("-", " ").replace("/", " - ").title()
            if page_name:
                title = page_name + " | Gidan Plants"
                desc = "Shop and explore " + page_name.lower() + " at Gidan, India trusted online plant and gardening store."
            else:
                title = "Gidan - Plants and Gardening Store"
                desc = "Buy plants, seeds, pots and gardening tools online at Gidan."

        url = BASE_URL + "/" + route if route else BASE_URL

        # Strip 'use client' from page wrapper
        new_content = re.sub(r"""^['"]use client['"];\s*\n""", "", content)

        # Add Metadata import
        if 'import type { Metadata }' not in new_content and 'import type {Metadata}' not in new_content:
            new_content = 'import type { Metadata } from "next";\n' + new_content

        meta_block = "\n" + build_metadata(title, desc, url) + "\n"

        pos = new_content.find("export default")
        if pos == -1:
            continue

        new_content = new_content[:pos] + meta_block + new_content[pos:]

        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        changed += 1
        print("  + /" + route)

print("")
print("Added metadata to " + str(changed) + " pages")
print("Skipped " + str(skipped_dynamic) + " dynamic route pages")

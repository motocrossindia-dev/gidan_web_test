/**
 * @param {{
 *   category: { name: string, slug: string },
 *   subcategory?: { name: string, slug: string } | null,
 *   products?: any[],
 *   siteUrl?: string
 * }} props
 */
export default function CollectionSchema({ category, subcategory, products = [], siteUrl = "https://gidanbackendtest.mymotokart.in" }) {
    const formatName = (str) => str ? str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '';
    const catName = category?.name || formatName(category?.slug) || "Category";
    const subName = subcategory?.name || formatName(subcategory?.slug) || "Subcategory";

    // BreadcrumbList logic
    const breadcrumbList = {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            }
        ]
    };

    if (category?.slug) {
        breadcrumbList.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": catName,
            "item": `${siteUrl}/${category.slug}/`
        });
    }

    if (subcategory?.slug && category?.slug) {
        breadcrumbList.itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": subName,
            "item": `${siteUrl}/${category.slug}/${subcategory.slug}/`
        });
    }

    // CollectionPage logic
    const collectionUrl = subcategory?.slug && category?.slug
        ? `${siteUrl}/${category.slug}/${subcategory.slug}/`
        : category?.slug
            ? `${siteUrl}/${category.slug}/`
            : `${siteUrl}/`;

    const collectionName = subName ? `Buy ${subName} ${catName} Online India | Gidan` : `Buy ${catName} Online India | Best Collection | Gidan`;

    const collectionPage = {
        "@type": "CollectionPage",
        "@id": `${collectionUrl}#webpage`,
        "url": collectionUrl,
        "name": collectionName,
        "breadcrumb": { "@id": `${siteUrl}/#breadcrumb` }
    };

    // ItemList logic for Products
    const validProducts = Array.isArray(products) ? products : [];

    const itemList = {
        "@type": "ItemList",
        "@id": `${collectionUrl}#itemlist`,
        "url": collectionUrl,
        "name": subName || catName || "Products",
        "numberOfItems": validProducts.length,
        "itemListElement": validProducts.map((prod, index) => {
            const prodCategorySlug = prod?.category_slug || category?.slug || "category";
            const prodSubCategorySlug = prod?.sub_category_slug || subcategory?.slug || "subcategory";

            return {
                "@type": "ListItem",
                "position": index + 1,
                "url": `${siteUrl}/${prodCategorySlug}/${prodSubCategorySlug}/${prod.slug}/`,
                "name": prod.main_product_name || prod.name || prod.title || "Product"
            };
        })
    };

    // Organization logic
    const organization = {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Gidan Plants",
        "url": siteUrl,
        "logo": {
            "@type": "ImageObject",
            "@id": `${siteUrl}/#logo`,
            "url": `${siteUrl}/logo.webp`,
            "width": "192",
            "height": "192",
            "caption": "Gidan Plants"
        },
        "description": "Gidan is India's trusted destination for plants, planters, seeds and urban gardening essentials with expert landscaping services.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bangalore",
            "addressRegion": "Karnataka",
            "postalCode": "560001",
            "addressCountry": "IN"
        },
        "sameAs": [
            "https://www.facebook.com/thegidanstore/",
            "https://www.instagram.com/thegidanstore/",
            "https://www.linkedin.com/company/thegidanstore/",
            "https://www.youtube.com/@thegidanstore/",
            "https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/"
        ]
    };

    // Output all connected schemas individually
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        ...organization
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        ...collectionPage
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        ...breadcrumbList
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        ...itemList
                    })
                }}
            />
        </>
    );
}

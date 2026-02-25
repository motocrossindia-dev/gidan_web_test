export default function ProductSchema({
    product,
    siteUrl,
    currency = "INR",
    brandName = "Gidan Store"
}) {
    if (!product) return null;

    /* -----------------------------
       Safe URL Generation
    ------------------------------ */
    const safeProductUrl = `${siteUrl}/category/${product?.category_slug}/${product?.slug}/`;
    const breadcrumbItems = [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl
        }
    ];

    // Add category safely
    if (product?.category_slug) {
        breadcrumbItems.push({
            "@type": "ListItem",
            position: breadcrumbItems.length + 1,
            name: product?.category_name || "Category",
            item: `${siteUrl}/category/${product.category_slug}/`
        });
    }

    // Add sub-category safely
    if (product?.sub_category_slug) {
        breadcrumbItems.push({
            "@type": "ListItem",
            position: breadcrumbItems.length + 1,
            name: product?.sub_category_name || "Sub Category",
            item: `${siteUrl}/category/${product.category_slug}/${product.sub_category_slug}/`
        });
    }

    // Add product page
    breadcrumbItems.push({
        "@type": "ListItem",
        position: breadcrumbItems.length + 1,
        name: product?.main_product_name || "Product",
        item: safeProductUrl
    });

    /* -----------------------------
       Availability Mapping
    ------------------------------ */
    const availabilityMap = {
        in_stock: "InStock",
        out_of_stock: "OutOfStock",
        preorder: "PreOrder"
    };

    const availability =
        availabilityMap[product?.stock_word?.toLowerCase()] || "InStock";

    /* -----------------------------
       Clean Image Array (CRITICAL FIX)
    ------------------------------ */
    const images =
        product?.images?.length
            ? product.images
                .map((img) =>
                    typeof img === "string"
                        ? img
                        : img?.url || img?.image || ""
                )
                .filter(Boolean)
            : product?.main_image
                ? [product.main_image]
                : [];

    /* -----------------------------
       Schema Object
    ------------------------------ */
    const schema = {
        "@context": "https://schema.org/",
        "@graph": [
            {
                "@type": "Product",
                "@id": `${safeProductUrl}#product`,
                url: safeProductUrl,
                name: product?.main_product_name || "",
                description:
                    product?.meta_description || product?.description || "",
                image: images,
                sku: product?.sku || String(product?.id || ""),
                mpn: product?.mpn || undefined,
                gtin13: product?.gtin || undefined,

                brand: {
                    "@type": "Brand",
                    name: brandName
                },

                category:
                    product?.sub_category_name
                        ? `${product.category_name} > ${product.sub_category_name}`
                        : product?.category_name || "",

                offers: {
                    "@type": "Offer",
                    url: safeProductUrl,
                    priceCurrency: currency,
                    price: String(product?.selling_price || 0),
                    priceValidUntil: "2026-12-31",
                    availability: `https://schema.org/${availability}`,
                    itemCondition: "https://schema.org/NewCondition",

                    seller: {
                        "@type": "Organization",
                        name: brandName
                    },

                    priceSpecification: {
                        "@type": "UnitPriceSpecification",
                        price: String(product?.selling_price || 0),
                        priceCurrency: currency
                    },

                    shippingDetails: {
                        "@type": "OfferShippingDetails",
                        shippingDestination: {
                            "@type": "DefinedRegion",
                            addressCountry: "IN"
                        },
                        deliveryTime: {
                            "@type": "ShippingDeliveryTime",
                            handlingTime: {
                                "@type": "QuantitativeValue",
                                minValue: 1,
                                maxValue: 2,
                                unitCode: "DAY"
                            },
                            transitTime: {
                                "@type": "QuantitativeValue",
                                minValue: 2,
                                maxValue: 5,
                                unitCode: "DAY"
                            }
                        },
                        shippingRate: {
                            "@type": "MonetaryAmount",
                            value: String(product?.shipping_price || 0),
                            currency: currency
                        }
                    },

                    hasMerchantReturnPolicy: {
                        "@type": "MerchantReturnPolicy",
                        returnPolicyCategory:
                            "https://schema.org/MerchantReturnFiniteReturnWindow",
                        merchantReturnDays: 7,
                        returnMethod: "https://schema.org/ReturnByMail",
                        applicableCountry: "IN",
                        returnFees: "https://schema.org/FreeReturn"
                    }
                },

                ...(product?.average_rating > 0 && {
                    aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: String(product.average_rating),
                        reviewCount: String(product.total_reviews || 1),
                        bestRating: "5",
                        worstRating: "1"
                    }
                })
            },

            {
                "@type": "BreadcrumbList",
                "@id": `${safeProductUrl}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: siteUrl
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: product?.category_name || "",
                        item: `${siteUrl}/category/${product?.category_slug}/`
                    },
                    ...(product?.sub_category_slug
                        ? [
                            {
                                "@type": "ListItem",
                                position: 3,
                                name: product?.sub_category_name || "",
                                item: `${siteUrl}/category/${product?.category_slug}/${product?.sub_category_slug}/`
                            }
                        ]
                        : []),
                    {
                        "@type": "ListItem",
                        position: product?.sub_category_slug ? 4 : 3,
                        name: product?.main_product_name || "",
                        item: safeProductUrl
                    }
                ]
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
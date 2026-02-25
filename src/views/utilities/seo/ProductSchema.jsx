// src/views/utilities/seo/ProductSchema.jsx

export default function ProductSchema({
    product,
    siteUrl,
    productUrl,
    currency = "INR",
    brand = "Gidan Store",
    rating = 0,
    ratingCount = 0
}) {
    if (!product) return null;

    // 🔹 Safe availability mapping
    const availabilityMap = {
        in_stock: "InStock",
        out_of_stock: "OutOfStock",
        preorder: "PreOrder"
    };

    const availability =
        availabilityMap[product?.stock_word?.toLowerCase()] || "InStock";

    // 🔹 Safe images
    const images =
        product?.images?.length
            ? product.images
            : product?.main_image
                ? [product.main_image]
                : [];

    // 🔹 Schema Object
    const schema = {
        "@context": "https://schema.org/",
        "@graph": [
            {
                "@type": "Product",
                "@id": `${productUrl}#product`,
                name: product?.main_product_name || "",
                image: images,
                description:
                    product?.meta_description || product?.description || "",
                sku: product?.sku || String(product?.id || ""),
                brand: {
                    "@type": "Brand",
                    name: brand
                },
                category:
                    product?.sub_category_name
                        ? `${product.category_name} > ${product.sub_category_name}`
                        : product?.category_name || "",
                offers: {
                    "@type": "Offer",
                    url: productUrl,
                    priceCurrency: currency,
                    price: String(product?.selling_price || 0),
                    priceValidUntil: "2026-12-31",
                    availability: `https://schema.org/${availability}`,
                    itemCondition: "https://schema.org/NewCondition",
                    seller: {
                        "@type": "Organization",
                        name: brand
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
                ...(rating > 0 && {
                    aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: String(rating),
                        reviewCount: String(ratingCount || 1),
                        bestRating: "5",
                        worstRating: "1"
                    }
                })
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${productUrl}#breadcrumb`,
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
                        item: `${siteUrl}/${product?.category_slug || ""}/`
                    },
                    ...(product?.sub_category_slug
                        ? [
                            {
                                "@type": "ListItem",
                                position: 3,
                                name: product?.sub_category_name || "",
                                item: `${siteUrl}/${product?.category_slug}/${product?.sub_category_slug}/`
                            }
                        ]
                        : []),
                    {
                        "@type": "ListItem",
                        position: product?.sub_category_slug ? 4 : 3,
                        name: product?.main_product_name || "",
                        item: productUrl
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
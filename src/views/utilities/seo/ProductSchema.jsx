import convertToSlug from "../../../utils/slugConverter";
import { toSlugString, getProductUrl } from "../../../utils/urlHelper";

export default function ProductSchema({
    product,
    images = [],
    brand = "Gidan Store",
    currency = "INR",
    siteUrl = "https://www.gidan.store",
    rating = 0,
    ratingCount = 0
}) {
    if (!product) return null;

    // Use getProductUrl which now handles stable slug conversion and includes variant ID
    const relativeProductUrl = getProductUrl(product);
    const productUrl = `${siteUrl}${relativeProductUrl}`;
    const schema = {
        "@context": "https://schema.org/",
        "@graph": [
            {
                "@type": "Product",
                "@id": `${productUrl}#product`,
                "name": product.main_product_name,
                "image": images?.length ? images : [product.main_image],
                "description": product.meta_description || product.description,
                "sku": product.sku || product.id,
                "brand": {
                    "@type": "Brand",
                    "name": brand
                },
                "category": product.category_name,
                "offers": {
                    "@type": "Offer",
                    "url": productUrl,
                    "priceCurrency": currency,
                    "price": String(product.selling_price),
                    "priceValidUntil": "2026-12-31",
                    "availability": `https://schema.org/${availability}`,
                    "itemCondition": "https://schema.org/NewCondition"
                }
            }
        ]
    };

    // const schema = {
    //     "@context": "https://schema.org/",
    //     "@graph": [
    //         {
    //             "@type": "Product",
    //             "@id": `${productUrl}#product`,
    //             "name": product.main_product_name,
    //             "image": images.length ? images : [product.main_image],
    //             "description": product.meta_description || product.description,
    //             "sku": product.sku || product.id,
    //             "brand": {
    //                 "@type": "Brand",
    //                 "name": brand
    //             },
    //             "category": product.category_name,
    //             "offers": {
    //                 "@type": "Offer",
    //                 "url": productUrl,
    //                 "priceCurrency": currency,
    //                 "price": String(product.selling_price),
    //                 "priceValidUntil": "2026-12-31",
    //                 "availability": `https://schema.org/${product.stock_word || "InStock"}`,
    //                 "itemCondition": "https://schema.org/NewCondition",
    //                 "seller": {
    //                     "@type": "Organization",
    //                     "name": brand
    //                 },
    //                 "shippingDetails": {
    //                     "@type": "OfferShippingDetails",
    //                     "shippingDestination": {
    //                         "@type": "DefinedRegion",
    //                         "addressCountry": "IN"
    //                     },
    //                     "deliveryTime": {
    //                         "@type": "ShippingDeliveryTime",
    //                         "handlingTime": {
    //                             "@type": "QuantitativeValue",
    //                             "minValue": 1,
    //                             "maxValue": 2,
    //                             "unitCode": "DAY"
    //                         },
    //                         "transitTime": {
    //                             "@type": "QuantitativeValue",
    //                             "minValue": 2,
    //                             "maxValue": 5,
    //                             "unitCode": "DAY"
    //                         }
    //                     },
    //                     "shippingRate": {
    //                         "@type": "MonetaryAmount",
    //                         "value": product.shipping_price || "0",
    //                         "currency": currency
    //                     }
    //                 },
    //                 "hasMerchantReturnPolicy": {
    //                     "@type": "MerchantReturnPolicy",
    //                     "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    //                     "merchantReturnDays": 7,
    //                     "returnMethod": "https://schema.org/ReturnByMail",
    //                     "applicableCountry": "IN",
    //                     "returnFees": "https://schema.org/FreeReturn"
    //                 }
    //             },
    //             ...(rating > 0 && {
    //                 "aggregateRating": {
    //                     "@type": "AggregateRating",
    //                     "ratingValue": String(rating),
    //                     "reviewCount": String(ratingCount || 1),
    //                     "bestRating": "5",
    //                     "worstRating": "1"
    //                 }
    //             })
    //         },
    //         {
    //             "@type": "BreadcrumbList",
    //             "@id": `${productUrl}#breadcrumb`,
    //             "itemListElement": [
    //                 {
    //                     "@type": "ListItem",
    //                     "position": 1,
    //                     "name": "Home",
    //                     "item": siteUrl
    //                 },
    //                 {
    //                     "@type": "ListItem",
    //                     "position": 2,
    //                     "name": product.category_name || product.category_slug,
    //                     "item": `${siteUrl}/${product.category_slug}/`
    //                 },
    //                 ...(product.sub_category_slug ? [{
    //                     "@type": "ListItem",
    //                     "position": 3,
    //                     "name": product.sub_category_name || product.sub_category_slug,
    //                     "item": `${siteUrl}/${product.category_slug}/${product.sub_category_slug}/`
    //                 }] : []),
    //                 {
    //                     "@type": "ListItem",
    //                     "position": product.sub_category_slug ? 4 : 3,
    //                     "name": product.main_product_name,
    //                     "item": productUrl
    //                 }
    //             ]
    //         }
    //     ]
    // };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

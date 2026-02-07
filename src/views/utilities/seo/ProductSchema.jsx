// src/seo/ProductSchema.jsx
import { Helmet } from "react-helmet-async";

export default function ProductSchema({ product,images }) {
    if (!product) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.main_product_name,
        "description": product.description,
        "image": images,
        "sku": product.sku,
        "brand": {
            "@type": "Brand",
            "name": "Gidan"
        },
        "offers": {
            "@type": "Offer",
            "price": product.selling_price,
            "priceCurrency": "NGN",
            "availability": product.in_stock,
            "url": `https://gidan.store/product/${product.slug}`
        }
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}

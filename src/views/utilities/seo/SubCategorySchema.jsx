import { Helmet } from "react-helmet-async";

export default function SubCategorySchema({
                                              category,
                                              subCategory,
                                              siteUrl = "https://gidan.store",
                                              items=[]
                                          }) {
    if (!subCategory) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": subCategory.name,
        "description":
            subCategory.description ||
            `${subCategory.name} under ${category.name}`,
        "url": `${siteUrl}/category/subcategory/${subCategory.slug}/`
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}

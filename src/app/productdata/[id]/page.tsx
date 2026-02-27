import { redirect } from "next/navigation";
import { fetchProductDetail } from "@/utils/serverApi";
import { toSlugString } from "@/utils/urlHelper";

type Props = {
    params: Promise<{ id: string }>;
};

/**
 * Fallback handler for numeric product IDs.
 * Fetches the product details to determine the canonical SEO-friendly URL and redirects.
 */
export default async function ProductDataFallbackPage({ params }: Props) {
    const { id } = await params;

    let redirectUrl = "/";
    try {
        const productData = await fetchProductDetail(id);

        if (productData?.data?.product) {
            const product = productData.data.product;
            const categorySlug = toSlugString(product.category_slug || product.category);
            const subCategorySlug = toSlugString(product.sub_category_slug || product.subcategory) || "all";
            const productSlug = toSlugString(product.slug);

            if (categorySlug && productSlug) {
                // Construct the 3-segment SEO URL
                redirectUrl = `/${categorySlug}/${subCategorySlug}/${productSlug}/`;
            }
        }
    } catch (error) {
        // Next.js redirect() throws an error that should NOT be caught here,
        // but since we are catching everything and then redirecting below, 
        // we only catch real-world API errors.
        console.error("Error in productdata fallback:", error);
    }

    // Perform the redirect outside the catch block
    redirect(redirectUrl);
}

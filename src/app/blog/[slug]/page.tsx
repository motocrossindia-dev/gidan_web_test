import BlogDetail from "../../../views/Blog/BlogDetail";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <BlogDetail slug={slug} />;
}
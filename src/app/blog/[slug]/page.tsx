import BlogDetail from "../../../views/Blog/BlogDetail";

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  return <BlogDetail slug={params.slug} />;
}
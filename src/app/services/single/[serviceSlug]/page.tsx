import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getServiceBySlug, fetchServicesList } from "@/utils/serverApi";
import ServiceDetailClient from "@/app/sections/ServiceDetailClient";

interface Props {
  params: Promise<{ serviceSlug: string }>;
}

export const revalidate = 3600; // Revalidate every hour

/**
 * Generates SEO metadata dynamically for each service.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceSlug } = await params;
  const service = await getServiceBySlug(serviceSlug);

  if (!service) return { title: "Service Not Found | Gidan" };

  return {
    title: `${service.Heading} | Gidan Professional Services`,
    description: service.title || `Professional ${service.Heading} services by Gidan. Expert consultation, installation, and maintenance across India.`,
    openGraph: {
      title: `${service.Heading} | Gidan`,
      description: service.title,
      images: [{ url: `${process.env.NEXT_PUBLIC_API_URL}${service.Image}` }],
    },
  };
}

/**
 * Pre-renders the service pages for instant loading.
 */
export async function generateStaticParams() {
  const services = await fetchServicesList();
  return services.map((service: any) => ({
    serviceSlug: service.Heading.replace(/\s+/g, "").toLowerCase(),
  }));
}

export default async function DynamicServicePage({ params }: Props) {
  const { serviceSlug } = await params;
  const serviceData = await getServiceBySlug(serviceSlug);

  if (!serviceData) {
    notFound();
  }

  return <ServiceDetailClient serviceData={serviceData} />;
}

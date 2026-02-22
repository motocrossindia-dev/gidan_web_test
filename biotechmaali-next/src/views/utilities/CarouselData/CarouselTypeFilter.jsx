'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import ProductGrid from "../../../components/Shared/ProductGrid";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import CheckoutStores from "../PlantFilter/CheckoutStores";
import axiosInstance from "../../../Axios/axiosInstance";
import { Helmet } from "react-helmet-async";

function CarouselTypeFilter() {
    const { slug } = useParams();
    const pathname = usePathname();

    const [results, setResults] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

    const typeParam = (slug || "").toLowerCase().replace(/-/g, "");

    const displayName = typeParam
        ? typeParam.charAt(0).toUpperCase() + typeParam.slice(1)
        : "Products";

    const fetchProducts = useCallback(async () => {
        if (!typeParam) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(
                `/filters/main_productsFilter/?type=${typeParam}`
            );
            if (res.status === 200) {
                setResults(res.data.results || []);
                setProducts({
                    count: res.data.count,
                    next: res.data.next,
                    previous: res.data.previous,
                });
            }
        } catch (err) {
            console.error("CarouselTypeFilter fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [typeParam]);

    useEffect(() => {
        setResults([]);
        setProducts({});
    }, [pathname]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Helmet>
                <title>{displayName} | Gidan Plants</title>
                <meta
                    name="description"
                    content={`Shop ${displayName.toLowerCase()} online at best prices. Wide range of premium varieties. Fast delivery & easy returns – Gidan.`}
                />
                <link
                    rel="canonical"
                    href={`https://www.gidan.store//carousel/${slug}`}
                />
            </Helmet>

            <div className="w-full overflow-x-hidden">
                <div className="container mx-auto px-4 md:px-8 max-w-full">
                    <div className="mt-4">
                        {loading && results.length === 0 ? (
                            <div className="flex justify-center items-center min-h-[300px]">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
                            </div>
                        ) : (
                            <ProductGrid
                                productDetails={results}
                                pagination={products}
                                setResults={setResults}
                                filtersApplied={false}
                                categorySlug={slug}
                            />
                        )}
                    </div>

                    <div className="mt-12 mb-8 space-y-8">
                        <RecentlyViewedProducts />
                        <CheckoutStores />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CarouselTypeFilter;

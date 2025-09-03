// PlantFilter.js - Modified to use state data

import React, { useEffect, useState } from "react";
import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "./ProductGrid";
import FAQSection from "./FAQSection";
import RecentlyViewedProduct from "./RecentlyViewedProduct";
import CheckoutStores from "./CheckoutStores";
import { FiFilter } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import {Helmet} from "react-helmet";
import axiosInstance from "../../../Axios/axiosInstance";

function PlantFilter() {
    const { id } = useParams();
    const location = useLocation();
    const path = location.pathname;

    // Get state data passed from navigation
    const stateData = location.state || {};
    const {  categoryId,categoryName, typeKey, subCategory,subcategoryID } = stateData;
    const {name: subCategoryName,} = subCategory || {};
    // console.log(subCategoryName); // "Hand Tools"
    // console.log('ID from URL params:', id);
    console.log('ID from state categoryId:', categoryId);
    // console.log('Category name from state:', categoryName);
    // console.log('Type key from state:', typeKey);
    // console.log('Subcategory from state:', subCategory);
    //
    // console.log('Subcategory from state subcategoryID:', subcategoryID);

    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [products, setProducts] = useState([]);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (showMobileFilter) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showMobileFilter]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const toggleMobileFilter = () => {
        setShowMobileFilter(!showMobileFilter);
    };

    useEffect(() => {
        const getCategoryProducts = async () => {
            try {
                if (id === "14") {
                    // Special case for offers
                    const response = await axiosInstance.get(
                        `${process.env.REACT_APP_API_URL}/product/offerProducts/`
                    );
                    if (response.status === 200) {
                        setResults(response.data.products || []);
                        setProducts(response.data || {});
                    }
                    return;
                }
                const response = await axiosInstance.get(
                    `${process.env.REACT_APP_API_URL}/product/category-products/${id}/`
                );
                if (response.data.message === "success") {
                    setResults(response.data.products || []);
                    setProducts(response.data || {});
                }
            } catch (error) {
                console.error("Error fetching category products:", error);
            }
        };

        const getSubCategorywiseProduct = async () => {
            try {
                const response = await axiosInstance.get(
                    `${process.env.REACT_APP_API_URL}/product/subcategory-products/${subcategoryID}/`
                );
                if (response.status === 200) {
                    setResults(response.data.products || []);
                    setProducts(response.data || {});
                }
            } catch (error) {
                console.error("Error fetching subcategory products:", error);
            }
        };

        if (path.startsWith("/filter/subcategory/")) {
            getSubCategorywiseProduct();
        } else if (path.startsWith("/filter/")) {
            getCategoryProducts();
        }
    }, [id, path]);

    return (
        <>
            <Helmet>
                <title>Biotech Maali - Plant Filter</title>
            </Helmet>
            <div className="container mx-auto bg-gray-100 pt-1">
                <br />
                {/* Mobile View Button */}
                <div className="flex md:hidden justify-between items-center">
                    <button
                        className="bg-white text-black w-full rounded-md flex items-center justify-center gap-2 my-2 p-2"
                        onClick={toggleMobileFilter}
                    >
                        <FiFilter size={20} />
                        Filter
                    </button>
                </div>
                <div className="flex flex-row md:flex-row px-4">
                    {/* Filter Sidebar */}
                    <div className="hidden md:block">
                        <FilterSidebar
                            setResults={setResults}
                            categoryId={id}
                            category={categoryName } // Use categoryName from state if available
                            subcategory={subCategoryName}
                            typeKey={typeKey} // Pass typeKey to FilterSidebar
                        />
                    </div>
                    <div className="flex-1">
                        {/* Product Grid */}
                        <ProductGrid
                            productDetails={results}
                            pagination={products}
                            setResults={setResults}
                            categoryName={categoryName} // Pass categoryName to ProductGrid
                            typeKey={typeKey} // Pass typeKey to ProductGrid
                        />
                    </div>
                </div>
                <RecentlyViewedProduct />
                {/* FAQ Section */}
                <div className="md:ml-16 overflow-x-hidden md:mr-12">
                    <FAQSection />
                    <CheckoutStores />
                </div>
                {/* Mobile Filter Sidebar */}
                {showMobileFilter && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                        <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
                            <button
                                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
                                onClick={toggleMobileFilter}
                            >
                                ✕
                            </button>
                            <FilterSidebar
                                setResults={setResults}
                                setShowMobileFilter={setShowMobileFilter}
                                categoryId={id}
                                category={categoryName} // Use categoryName from state if available
                                subcategory={subCategoryName}
                                typeKey={typeKey} // Pass typeKey to FilterSidebar
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default PlantFilter;

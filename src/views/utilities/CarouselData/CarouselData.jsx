'use client';

import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import ProductGrid from "../PlantFilter/ProductGrid";
// import FAQSection from "../PlantFilter/FAQSection";
// import RecentlyViewedProduct from "../PlantFilter/RecentlyViewedProduct";
// import CheckoutStores from "./PlantFilter/CheckoutStores";
// // // function CarouselData() {
//     const { id } = useParams();



//     const [results, setResults] = useState([]);


//     return (
//         <>
//             
//             <div className="container mx-auto  min-h-screen">

//                 {/* Product Grid */}
//                 <div className="px-4 mt-4">
//                     <ProductGrid
//                         productDetails={results}
//                         setResults={setResults}

//                     />
//                 </div>

//                 {/* Additional Sections */}
//                 <div className="px-4 md:px-8 mt-8">
//                     <RecentlyViewedProduct />
//                     <FAQSection />
//                     <CheckoutStores />
//                 </div>


//             </div>
//         </>
//     );
// }

// export default CarouselData;



import React, { useEffect, useState } from "react";
import ProductGrid from "../../../components/Shared/ProductGrid";
import FAQSection from "../PlantFilter/FAQSection";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import axios from "axios";
function CarouselData() {
    const [results, setResults] = useState([]);



    const id = null.heroId;
    console.log(id, '-------------------------------s');
    // const { id } = useParams();

    useEffect(() => {
        fetchCarouselProducts();
    }, []);

    const fetchCarouselProducts = async () => {
        try {

            const res = await axios.get(
                `https://backend.gidan.store/promotion/banner/${id}/`
            );

            // 👇 IMPORTANT: take product_list only
            setResults(res?.data?.data?.products_list || []);
        } catch (error) {
            console.error("Carousel API Error:", error);
        }
    };

    return (
        <>
            


            <div className="container mx-auto min-h-screen">
                {/* Product Grid */}
                <div className="px-4 mt-4">
                    <ProductGrid
                        productDetails={results}
                        setResults={setResults}

                    />
                </div>

                {/* Additional Sections */}
                <div className="px-4 md:px-8 mt-8">
                    <RecentlyViewedProducts />
                    <FAQSection />
                </div>
            </div>
        </>
    );
}

export default CarouselData;

// import React, { useEffect, useState } from "react";
// import ProductGrid from "../PlantFilter/ProductGrid";
// import FAQSection from "../PlantFilter/FAQSection";
// import RecentlyViewedProduct from "../PlantFilter/RecentlyViewedProduct";
// import CheckoutStores from "./PlantFilter/CheckoutStores";
// import { useParams } from "react-router-dom";
// import { Helmet } from "react-helmet";


// function CarouselData() {
//     const { id } = useParams();
    

    
//     const [results, setResults] = useState([]);


//     return (
//         <>
//             <Helmet>
//                 <title>Gidan - Carousel</title>
//             </Helmet>
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
import ProductGrid from "../../../Components/Shared/ProductGrid";
import FAQSection from "../PlantFilter/FAQSection";
import RecentlyViewedProducts from "../../../Components/Shared/RecentlyViewedProducts";
import CheckoutStores from "../PlantFilter/CheckoutStores";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import {useLocation, useParams} from "react-router-dom";


function CarouselData() {
    const [results, setResults] = useState([]);

    const location = useLocation();

    const id = location.state.heroId;
    console.log(id,'-------------------------------s');
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
            <Helmet>
  <title>Gidan - Carousel</title>

  <meta
    name="description"
    content="Explore featured plants, pots, seeds, and plant care products at Gidan. Discover curated collections and highlights for smarter gardening."
  />

  <link
    rel="canonical"
    href={`https://gidan.store/carousel/${id}`}
  />
</Helmet>


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
                    <CheckoutStores />
                </div>
            </div>
        </>
    );
}

export default CarouselData;

'use client';


import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import axiosInstance from "../../../Axios/axiosInstance";
import StoreCard from "../../../components/Shared/StoreCard";
const StoreLocations = () => {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [stores, setStores] = useState([]); 
  const router = useRouter(); 

  // Fetch stores from API when component mounts
  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/store/store_list/`
      );
      setStores(response?.data?.data?.stores || []); 
    } catch (error) {
      console.error(error);
      setError("Error fetching store data");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchStores();
  }, []); 

  if (loading) {
    return <div>Loading stores...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Show only the first 3 stores
  const storesToDisplay = stores.slice(0, 3);

  return (
    <>
      <h2 className="md:text-4xl text-xl font-semibold text-center mb-4">
        Checkout Our Stores
      </h2> 

      <div className="md:px-20">
        <Card>
          <div className="w-full bg-white-400 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {storesToDisplay && storesToDisplay.length > 0 ? (
                storesToDisplay.map((store, index) => (
                  <StoreCard key={index} store={store} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-400">No stores available</div>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="bg-bio-green text-white py-2 px-4 rounded-md hover:bg-[#375421] hover:text-white"
                onClick={() => router.push("/stores")} 
              >
                View All
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default StoreLocations;
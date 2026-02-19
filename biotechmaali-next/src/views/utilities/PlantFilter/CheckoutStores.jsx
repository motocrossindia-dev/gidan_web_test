'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import axiosInstance from "../../../Axios/axiosInstance";

const CheckOutStore = () => {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [stores, setStores] = useState([]); 
  const router = useRouter(); 

  // Fetch stores from API when component mounts
  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/store/store_list/`
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
      <h2 className="md:text-2xl text-xl font-semibold text-center mb-4">
        Checkout Our Stores
      </h2> 

      <div className="md:px-20">
        <Card>
          <div className="w-full bg-white-400 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12 gap-6">
              {storesToDisplay && storesToDisplay.length > 0 ? (
                storesToDisplay.map((store, index) => {
                  const mapLink = store.address_link
                    ? store.address_link
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        store.address
                      )}`;

                  return (
                    <div
                      key={index}
                      onClick={() => window.open(mapLink, "_blank")}
                      className="p-4 border-2 border-bio-green mb-2 rounded-md md:shadow-md bg-white w-full md:w-auto cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-transform"
                    >
                      {/* Store Image */}
                      {store.image && (
                        <img
                          src={`${process.env.REACT_APP_API_URL}${store.image}`}
                          alt={store.location}
                          className="w-full h-40 object-cover rounded-md mb-3"
                        />
                      )}

                      {/* Store Details */}
                      <h3 className="text-lg md:text-xl font-semibold mb-2">
                        {store.location}
                      </h3>

                      <p className="text-sm md:text-md mb-2 mt-1">
                        <strong>Address:</strong> {store.address}
                      </p>
                      <p className="text-sm md:text-md mb-2">
                        <strong>Contact number:</strong> {store.contact}
                      </p>
                      <p className="text-sm md:text-md">
                        <strong>Time:</strong> {store.time_period}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div>No stores available</div>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="bg-bio-green text-white py-2 px-4 rounded-md hover:bg-green-700"
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

export default CheckOutStore;
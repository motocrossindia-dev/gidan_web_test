'use client';

import { useEffect, useState } from "react";
import axiosInstance from "../../Axios/axiosInstance";
import { Helmet } from "react-helmet-async";

const StoreDetail = ({ slug }) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axiosInstance.get(`/store/store_list/${slug}/`);
        setStore(response?.data?.data?.store);
      } catch (error) {
        console.error(error);
        setError("Error fetching store details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStore();
    }
  }, [slug]);

  if (loading) {
    return <div className="p-6">Loading store details...</div>;
  }

  if (error || !store) {
    return <div className="p-6 text-red-500">{error || "Store not found"}</div>;
  }

  const mapLink = store.address_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;

  return (
    <>
      <Helmet>
        <title>{store.location} | Gidan Plants Store</title>
        <meta name="description" content={`Visit Gidan Plants store at ${store.location}. ${store.address}`} />
        <link rel="canonical" href={`https://www.gidan.store/stores/${slug}`} />
      </Helmet>

      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">{store.location}</h1>

        {store.images && store.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {store.images.map((img) => (
              <img
                key={img.id}
                src={`https://backend.gidan.store${img.image}`}
                alt={store.location}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Address</h3>
              <p className="text-gray-700">{store.address}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Contact</h3>
              <p className="text-gray-700">{store.contact}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Timings</h3>
              <p className="text-gray-700">{store.time_period}</p>
            </div>

            {store.description && (
              <div>
                <h3 className="font-semibold text-lg mb-2">About</h3>
                <p className="text-gray-700">{store.description}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => window.open(mapLink, "_blank")}
            className="mt-6 bg-bio-green text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
          >
            Get Directions
          </button>
        </div>
      </div>
    </>
  );
};

export default StoreDetail;

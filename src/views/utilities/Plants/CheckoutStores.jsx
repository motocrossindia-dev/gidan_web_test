import React, { useState, useEffect } from "react";
import { CiLocationOn } from "react-icons/ci"; // Import the location icon
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "@mui/material/Card";

const CheckOutStore = () => {
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to handle errors
  const [stores, setStores] = useState([]); // State for stores list
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch stores from API when component mounts
  const fetchStores = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/store/store_list/`
      );
      setStores(response?.data?.data?.stores || []); // Set the stores if the response is an array
    } catch (error) {
      console.error(error);
      setError("Error fetching store data");
    } finally {
      setLoading(false); // Set loading to false once data is fetched or error occurs
    }
  };

  useEffect(() => {
    fetchStores();
  }, []); // Empty dependency array ensures this runs only once when component mounts

  // Handle loading and error states
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
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-center mb-4 ">
        Checkout Our Stores
      </h2> 
      <div className="px-4">
      <Card classname="">
        <div className="w-full bg-white-400 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storesToDisplay && storesToDisplay.length > 0 ? (
              storesToDisplay.map((store, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-bio-green mb-2 rounded-md shadow-md bg-white w-full md:w-auto"
                >
                  <h3 className="text-lg font-semibold flex items-center justify-between">
                    {store.location}
                    <a
                      href={store.address_link} // Set the address link for Google Maps
                      target="_blank" // Open in a new tab
                      rel="noopener noreferrer" // For security reasons
                      className="ml-2 text-blue-900"
                    >
                      <CiLocationOn />
                    </a>
                  </h3>
                  <p className="text-sm mb-2 mt-1">
                    <strong>Address:</strong> {store.address}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Contact number:</strong> {store.contact}
                  </p>
                  <p className="text-sm">
                    <strong>Time:</strong> {store.time_period}
                  </p>
                </div>
              ))
            ) : (
              <div>No stores available</div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="bg-bio-green text-white py-2 px-4 rounded-md hover:bg-green-700"
              onClick={() => navigate("/stores")} // Navigate to the /stores page
            >
              View All
            </button>
          </div>
        </div>
      </Card>
      </div>
      </div>
    </>
  );
};

export default CheckOutStore;

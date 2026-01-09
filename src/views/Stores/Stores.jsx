// import React, { useState, useEffect } from "react";
// import { CiLocationOn } from "react-icons/ci"; // Import the location icon
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../Axios/axiosInstance";
// import {Helmet} from "react-helmet";

// const Stores = () => {
//   const navigate = useNavigate();
//   // State to store selected store data for the form
//   const [loading, setLoading] = useState(true); // State to track loading status
//   const [error, setError] = useState(null); // State to handle errors

//   // State for stores list
//   const [stores, setStores] = useState([]);

//   // Fetch stores from API when component mounts
//   const fetchStores = async () => {
//     try {
//       const response = await axiosInstance.get(`/store/store_list/`);
      
//       setStores(response?.data?.data?.stores); // Set the stores if the response is an array
//     } catch (error) {
//       console.error(error);
//       setError("Error fetching store data");
//     } finally {
//       setLoading(false); // Set loading to false once data is fetched or error occurs
//     }
//   };

//   useEffect(() => {
//     fetchStores();
//   }, []); // Empty dependency array ensures this runs only once when component mounts

//   // Handle loading and error states
//   if (loading) {
//     return <div>Loading stores...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }
//   const handleClick = () => {
//     navigate('/franchiseenquery');
//   };
//   return (
//       <>
//         <Helmet>
//           <title>Gidan - Stores</title>
//         </Helmet>
//     <div className="w-full bg-white-100 p-6 rounded-lg">
//       <h2 className="text-2xl font-semibold text-start mb-6">
//         Checkout Our Stores
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {stores && Array.isArray(stores) && stores.length > 0 ? (
//           stores.map((store, index) => (
//             <div
//               key={index}
//               className="p-4 border-2 border-bio-green rounded-md shadow-md bg-white w-full md:w-auto"
//             >
//               <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
//                 {store.location}
// <a
//   href={
//     store.address_link 
//       ? store.address_link 
//       : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`
//   }
//   target="_blank"
//   rel="noopener noreferrer"
//   className="ml-2 text-bio-green"
// >
//   <CiLocationOn />
// </a>

//               </h3>
//               <p className="text-sm mb-2">
//                 <strong>Address:</strong> {store.address}
//               </p>
//               <p className="text-sm mb-2">
//                 <strong>Contact number:</strong> {store.contact}
//               </p>
//               <p className="text-sm">
//                 <strong>Time:</strong> {store.time_period}
//               </p>
//             </div>
//           ))
//         ) : (
//           <div>No stores available</div>
//         )}
//       </div>

     
//       {/* Request a Free Franchise Consultation Section */}
//       <section className="text-center my-8 w-full p-6 bg-gray-100">
//         <h2 className="text-xl font-semibold mb-4">
//           Request A Free Franchise Consultation
//         </h2>
//         <button 
//       className="bg-bio-green text-white px-4 py-2 rounded hover:bg-green-700"
//       onClick={handleClick}
//     >
//       Apply Now
//     </button>
//       </section>

//     </div>
//         </>
//   );
// };

// export default Stores;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Axios/axiosInstance";
import { Helmet } from "react-helmet";

const Stores = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [stores, setStores] = useState([]);

  // Fetch stores from API
  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get(`/store/store_list/`);
      setStores(response?.data?.data?.stores); 
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

  const handleClick = () => {
    navigate("/franchiseenquery");
  };

  return (
    <>
      <Helmet>
        <title>Gidan - Stores</title>
      </Helmet>

      <div className="w-full bg-white-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-start mb-6">
          Checkout Our Stores
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stores && Array.isArray(stores) && stores.length > 0 ? (
            stores.map((store, index) => {
              const mapLink = store.address_link
                ? store.address_link
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    store.address
                  )}`;
              return (
                <div
                  key={index}
                  onClick={() => window.open(mapLink, "_blank")}
                  className="p-4 border-2 border-bio-green rounded-md shadow-md bg-white w-full md:w-auto cursor-pointer hover:shadow-lg transition"
                >
                  {/* Store Image */}
                  {store.image && (
                    <img
                      src={`https://backend.gidan.store${store.image}`}
                      alt={store.location}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                  )}

                  {/* Store Details */}
                  <h3 className="text-lg font-semibold mb-2">
                    {store.location}
                  </h3>

                  <p className="text-sm mb-2">
                    <strong>Address:</strong> {store.address}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Contact number:</strong> {store.contact}
                  </p>
                  <p className="text-sm">
                    <strong>Time:</strong> {store.time_period}
                  </p>
                </div>
              );
            })
          ) : (
            <div>No stores available</div>
          )}
        </div>

        {/* Request a Free Franchise Consultation Section */}
        <section className="text-center my-8 w-full p-6 bg-gray-100">
          <h2 className="text-xl font-semibold mb-4">
            Request A Free Franchise Consultation
          </h2>
          <button
            className="bg-bio-green text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleClick}
          >
            Apply Now
          </button>
        </section>
      </div>
    </>
  );
};

export default Stores;


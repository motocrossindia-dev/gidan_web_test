import React, { useEffect, useState } from "react";
import contactus from "../../../Assets/contactus.webp";
import { useSnackbar } from "notistack"; // Import useSnackbar hook
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axiosInstance from "../../../Axios/axiosInstance";
import { Helmet } from "react-helmet-async";
import CheckOutStore from "../PlantFilter/CheckoutStores";
import ContactUsSchema from "../seo/ContactUsSchema";


const ContactUs = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  const { enqueueSnackbar } = useSnackbar(); // Access enqueueSnackbar function

  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to handle errors
  const [stores, setStores] = useState([]); // State for stores list
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch stores from API when component mounts
  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get(`/store/store_list/`);
      if (response.status === 200) {
      setStores(response?.data?.data?.stores || []); // Set the stores if the response is an array
        
      }
    } catch (error) {
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form fields before submitting
  const validateForm = () => {
    const { name, mobile, email, message } = formData;

    // Name field should contain only alphabets
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      enqueueSnackbar("Name should contain only alphabets.", { variant: "error" });
      return false;
    }

    // Mobile number should be exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) {
      enqueueSnackbar("Phone number should be 10 digits.", { variant: "error" });
      return false;
    }

    // Ensure all fields are filled
    if (!name || !mobile || !email || !message) {
      enqueueSnackbar("All fields are required.", { variant: "error" });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    if (!validateForm()) {
      return; // Don't submit if validation fails
    }

    setLoading(true);

    try {

      const response = await axiosInstance.post('/promotion/contactUs/', formData);

      if (response?.status === 201) {
        const result = await response?.data
        
        enqueueSnackbar(result.message || "Form submitted successfully!", {
          variant: "success", // Success Snackbar
        });
        setFormData({
          name: "",
          mobile: "",
          email: "",
          message: "",
        });
      } else {
        enqueueSnackbar("Something went wrong. Please try again.", {
          variant: "error", // Error Snackbar
        });
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("Failed to connect to the server. Please try again.", {
        variant: "error", // Error Snackbar
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const handleClick = () => {
    navigate('/franchise-enquiry');
  };
  return (

    <>
      <Helmet>
  <title>Contact Gidan | Customer Support & Help</title>

  <meta
    name="description"
    content="Need help? Contact Gidan for orders, support & queries. We're here to assist you."
  />

  <link
    rel="canonical"
    href="https://gidan.store/contact-us"
  />
</Helmet>


      <div className="font-sans text-gray-800">
        {/* Header Section */}
        <header className="bg-red-200 text-center py-10 w-full">
          <h1 className="text-4xl font-bold text-white">Let's Talk</h1>
          <p className="text-xl text-blue-700 font-semibold">We're Here</p>
        </header>

        {/* Contact Form Section */}
        <section className="p-6 bg-white shadow-md rounded-lg w-full my-8">
          <div className="flex flex-col md:flex-row items-stretch w-full">
            {/* Image */}
            <div className="w-full md:w-1/2">
              <img name=" "   
                  src={contactus}
                  loading="lazy"
                  alt="Contact Illustration"
                  className="h-full object-cover rounded"
              />
            </div>
            {/* Form */}
            <div className="w-full md:w-2/3 px-4 flex items-center">
              <div className="w-full">
                <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="p-2 border border-gray-300 rounded w-full"
                  />

                  {/* Contact Number and Email Side by Side */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <input
                          type="tel"
                          name="mobile"
                          placeholder="Contact Number"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                          className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                  </div>
                  {/* Message */}
                  <textarea
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      required
                      className="p-2 border border-gray-300 rounded w-full"
                  />

                  {/* Submit Button */}
                  <button
                      type="submit"
                      className="bg-bio-green text-white px-16 py-2 rounded hover:bg-green-700 w-full md:w-auto"
                      disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        {/* Inquiry Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-6 bg-gray-50">
          {/* First Box: Bulk/Corporate Inquiry */}
          <div className="p-4 border border-fuchsia-200 bg-white rounded w-full">
            <h3 className="">Head Office, Jaynagar</h3>
            <p>Contact Person - Sujith</p>
            <p>Contact No - +91 7483316150</p>
            <p>Email - info@gidan.store</p>
          </div>

          {/* Second Box: Gardening Services Enquiry */}
          <div className="p-4 border border-fuchsia-200 bg-white rounded w-full">
            <h3 className="">Nursery Store</h3>
            <p>Contact Person - Kiran</p>
            <p>Contact No - +91 8971710854</p>
            <p>Email - info@gidan.store</p>
          </div>
        </section>

        {/* Franchise Consultation Section */}
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

        {/* Store Locations */}

        <CheckOutStore />

      </div>
      <ContactUsSchema/>
    </>

  );
};

export default ContactUs;

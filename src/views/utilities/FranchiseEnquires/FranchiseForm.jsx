import React, { useState } from "react";
import { useSnackbar } from "notistack";
import franchiseenquires2 from "../../../Assets/FranchiseEnquires/franchiseenquires_gidan.png";
import axios from "axios";
import Cookies from "js-cookie";

const FranchiseForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const csrfToken = Cookies.get("csrftoken");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    area: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); // New state for response message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(""); // Clear previous message

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/franchise/add_franchise/`,
        formData,
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        enqueueSnackbar("Franchise request submitted successfully!", {
          variant: "success",
        });
        setResponseMessage("Franchise request submitted successfully! ✅"); // Set success message
        setFormData({
          name: "",
          mobile: "",
          email: "",
          area: "",
          address: "",
          message: "",
        });
      } else {
        enqueueSnackbar("" + response.data.message, { variant: "success" });
        setResponseMessage("" + response.data.message); // Set error message
      }
    } catch (error) {
      enqueueSnackbar("Error: " + error.message, { variant: "error" });
      setResponseMessage("Error: " + error.message); // Set error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto px-2">
      <div className="flex flex-col md:flex-row items-stretch justify-between p-4 md:p-8 space-y-6 md:space-y-0 md:space-x-10">
        <div className="flex-1">
          <img name=" "   
            src={franchiseenquires2}
            loading="lazy"
            alt="Franchise"
            className="w-full h-[200px] md:h-full object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="flex-1 bg-white p-4 md:p-8 rounded-lg shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-center md:mb-6">
            Get a Franchise
          </h1>
          <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
            <input
              type="number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Area In Which You Want To Open"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              className="w-full border border-gray-300 p-2 rounded-lg"
              rows="7"
              style={{ resize: "vertical", minHeight: "150px" }}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "SEND"}
            </button>

            {/* Display response message below the button */}
            {responseMessage && (
              <p className="text-center mt-2 text-sm font-semibold text-gray-600">
                {responseMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FranchiseForm;

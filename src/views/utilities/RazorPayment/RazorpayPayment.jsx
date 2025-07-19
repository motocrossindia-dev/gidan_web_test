import React from "react";

const RazorpayPayment = () => {
  const handlePayment = async () => {
    const options = {
      key: "rzp_test_zu1D9WznwNYRVG", // Replace with your Razorpay key
      amount: 50000, 
      currency: "INR",
      name: "Bio-tech Maali",
      description: "Test Transaction",
      image: "https://your-logo-url.com",
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_key}_id}`);
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div>
         <button onClick={handlePayment} className="bg-bio-green text-white px-4 py-2 rounded">
         Proceed To Payment
      </button>
    </div>
  );
};

export default RazorpayPayment;


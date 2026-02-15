import React, { useEffect, useState } from "react";
import { FiShare2 } from "react-icons/fi";
import Refer from "../../../Assets/ReferAFriend.webp"; // Ensure the image path is correct
import axiosInstance from "../../../Axios/axiosInstance";
import { Helmet } from "react-helmet-async";
import HomepageSchema from "../../utilities/seo/HomepageSchema";
import StoreSchema from "../../utilities/seo/StoreSchema";


function ReferAFriend() {

  const [data,setData] = useState(null)

    const getBTcoinsWallet = async()=>{
      try {
        
        const response = await axiosInstance.get("/btcoins/btcoinswallet/")
        if (response.status===200) {
          setData(response?.data)
        }
      } catch (error) {
        console.log(error);
        
      }
    }

  
  useEffect(() => {
    getBTcoinsWallet()
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  const handleShare = () => {
    const referralCode = data?.referral_code || "No Referral Code"; // Default if empty
    const text = `Hey! I invite you to join Gidan. Use my referral code:
: ${referralCode}`;
    const url =`https://biotechmaali.com/`;
  
    if (navigator.share) {
      navigator.share({
        title: "Gidan Referral",
        text: `${text}\n${url}`,
      })
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };
  
  
  return (
      <>
        <Helmet>
  <title>Gidan - Refer A Friend </title>

  <meta
    name="description"
    content="Refer a friend to Gidan and earn rewards. Invite friends to shop plants, pots, seeds, and plant care products while enjoying exclusive benefits."
  />

  <link
    rel="canonical"
    href="https://gidan.store/profile/referal"
  />
</Helmet>

  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 mt-2 lg:px-8">
  {/* Main Card */}
  <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 w-full max-w-5xl">
    
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
      <h2 className="text-2xl font-semibold text-gray-700 text-center sm:text-left">
        Refer a Friend
      </h2>
      <div className="text-sm text-center sm:text-right border border-green-500 px-3 py-2 rounded-md">
        <span className="text-green-600">Total Referrals: </span>
        <span className="text-green-600 font-semibold">{data?.total_referrals}</span>
      </div>
    </div>

    {/* Illustration */}
    <div className="flex justify-center mb-6">
      <img name=" "   
        src={Refer}
        alt="Refer a Friend"
        loading="lazy"
        className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
      />
    </div>

    {/* Referral Link */}
    <div className="flex flex-col sm:flex-row items-center bg-gray-100 rounded-lg border mb-6 w-full mx-auto">
      <input
        type="text"
        className="text-sm p-4 focus:outline-none text-gray-600 truncate w-full sm:flex-grow rounded-t-lg sm:rounded-tr-none sm:rounded-l-lg"
        placeholder="Referral Code"
        value={data?.referral_code}
        readOnly
      />
      <button
        className="w-full sm:w-[174px] h-[60px] bg-green-500 text-white font-semibold flex justify-center items-center rounded-b-lg sm:rounded-bl-none sm:rounded-r-lg"
        onClick={handleShare}
      >
        <FiShare2 className="mr-2" /> SHARE
      </button>
    </div>

    {/* Steps Section */}
    <div className="mt-8">
      {/* How to Refer Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">How do I Refer a Friend?</h3>
        <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-sm sm:text-base">
          <li>
            Go to BiotechMaali.com and select the items you want to purchase. When you're ready to checkout, click 'Proceed To Pay'.
          </li>
          <li>Select the 'Pay By Gift Card' option.</li>
          <li>Enter your 16-digit gift card number.</li>
          <li>
            If the Gift Card value doesn’t cover your order total, you will be prompted to select an additional payment method.
          </li>
          <li>
            NOTE: Funds will be deducted from your Gift Card when you place your order. In case of any refund, we will credit the refund back to your Gift Card.
          </li>
        </ol>
      </div>

      {/* Card Expiry */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Does my Gidan Card expire?</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          All Gidan Cards expire 1 year from the date of their creation.
        </p>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Terms & Conditions</h3>
        <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-sm sm:text-base">
          <li>
            Gidan Cards ("GSCs" or "Gift Cards") are issued by Qwikcilver Solutions Pvt. Ltd. authorized by the RBI.
          </li>
          <li>
            Redeemable only on www.BiotechMaali.com or its mobile platforms.
          </li>
          <li>
            Purchase via Credit/Debit Cards or Net Banking only.
          </li>
          <li>
            Gift Cards can be redeemed during checkout by selecting the Gift Card option.
          </li>
          <li>
            Cannot be used to buy other gift cards or subscriptions.
          </li>
          <li>
            Not applicable for bulk purchases.
          </li>
          <li>
            If the value exceeds the gift card amount, pay the balance using cards/net banking. COD is not available for balance payment.
          </li>
        </ol>
      </div>
    </div>
  </div>
</div>
        <HomepageSchema/>
        <StoreSchema/>
    </>
  );
}

export default ReferAFriend;

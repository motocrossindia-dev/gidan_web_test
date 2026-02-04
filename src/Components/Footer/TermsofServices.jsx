import React ,{useEffect} from 'react';
import { Helmet } from "react-helmet-async";

const TermsOfService = () => {
    useEffect(() => {
      window.scrollTo(0, 0); // Scroll to top on component mount
    }, []);
  return (

      <>
        <Helmet>
  <title>Gidan - Terms Of Service</title>

  <meta
    name="description"
    content="Read the Terms of Service for using Gidan. Understand the rules, policies, and guidelines for shopping, orders, and using our website safely."
  />

  <link
    rel="canonical"
    href="https://gidan.store/terms"
  />
</Helmet>

    <div className="max-w-4xl mx-auto p-6 bg-white text-gray-800 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600 leading-relaxed">
          Please read the below points to understand the expressions under each circumstance before you have a wonderful shopping experience.
        </p>
      </div>

      <div className="space-y-8">
        {/* Definitions Section */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Definitions</h2>
          <p className="text-gray-700 mb-3">While reading further, you may find several words which convey specific meaning:</p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><strong>"Buyer"</strong> means the person who buys goods from the Seller</p>
            <p><strong>"Seller"</strong> means FARM AMMINO AGRITECH PRIVATE LIMITED who sell gardening products</p>
            <p><strong>"Goods"</strong> means the products offered by the seller for sale on the web site</p>
            <p><strong>"List Price"</strong> means the prices listed on the website for goods by the Seller for sale or as revised from time to time</p>
            <p><strong>"Terms and Conditions"</strong> means the terms and conditions of sale set out in this document and as amended from time to time</p>
          </div>
        </section>

        {/* General Terms */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">General Terms</h2>
          <div className="space-y-4 text-gray-700">
            <p>The use of this website, its services and tools are all governed by the below mentioned terms and conditions. If you make any transaction through this website, you shall undergo policies that are applicable to the website. If you transact with this website means you are contracting with Gidan and you shall follow the duties with this company.</p>
            
            <p>Please note that wherever is mentioned as "you" or "user" shall be considered as the member of the website who registers with Gidan and provides his/her data using the computation systems. Gidan allows its users to surf or make purchase from this website without registration process. The term "we", "us", "our" means the company or Gidan (FARM AMMINO AGRITECH PRIVATE LIMITED).</p>
            
            <p>When you use this website including customer reviews, you are subject to guidelines, rules, policies, terms and conditions applicable to this website and its services. We reserve the sole right to modify, add, change or remove the portion or content of these Terms and Conditions without any notification.</p>
          </div>
        </section>

        {/* Limitations */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Limitations</h2>
          <p className="text-gray-700 mb-3">Our shipments are carefully inspected before the items leave our warehouse, but if you are not satisfied with your purchase, please follow the instructions below:</p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>The seller (Gidan) will not be responsible for any damage, direct loss suffered by the buyer due to any negligence, breach of contract or excessive pricing of the goods.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>The seller is not responsible for any economic loss, loss of profit or any indirect third party loss suffered by the buyer caused due to any reason such as negligence, failure to meet any estimated delivery date, misrepresentation or breach of contract.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>All offers for goods purchased by buyers shall be treated as offers listed under the clauses given in Terms & Conditions (T&C). The seller may choose not to accept or cancel a particular order without giving any particular reason.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>Placing an order on Gidan will be treated as an evidence for acceptance of T&C on Gidan</span>
            </li>
          </ul>
        </section>

        {/* Price, Payment and Delivery */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Price, Payment and Delivery</h2>
          <div className="space-y-3 text-gray-700">
            <p>Pricing of the goods shall be specified similar as given in seller's current list price on the website inclusive of all application taxes and will be delivered to the address registered by the user on the website within 24 hours from the time of the orders that are successfully placed (subject to availability).</p>
            <p>Full payment of cash on delivery option shall be applicable for home delivery orders only</p>
            <p>The Risk and Rewards are transferred to the Buyer of the goods when the Invoice is prepared by the Seller in the POS System</p>
            <p>The seller may decline sending any orders if the customer is found suspended for any reason</p>
          </div>
        </section>

        {/* Membership Eligibility */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Membership Eligibility</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="space-y-3 text-gray-700">
              <p>Gidan website is available only to those users who can form legally binding contracts under the Indian Contract Act, 1872. Those who cannot follow the norms or are incompetent to the contract (including minors, undischarged bankrupts, etc.) are not eligible to use this website</p>
              <p>If you are a minor or under the age of 18 years, you shall not be a member of Gidan and shall not transact on this website</p>
              <p>Gidan reserves the right to terminate your membership and refuse your access if it is brought to Gidan's notice or if discovered that you are underage to proceed</p>
            </div>
          </div>
        </section>

        {/* Account and Registration Obligations */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Your Account and Registration Obligations</h2>
          <div className="space-y-3 text-gray-700">
            <p>If you are using this website, you are responsible for the maintenance of confidentiality of your User ID and Password and only you shall be responsible for all the activities on the website.</p>
            <p>With the use of this website, you agree to this that providing any information that is inaccurate, untrue, incomplete, not as per the terms of use then in that case we reserve the right to suspend or terminate or block access of your membership on the website.</p>
            <p>Personal details provided by you to Gidan through account creation or order placement will only be used in accordance with our privacy policy and shall not be used for any purpose other than sending you emails and SMS with offers of your interest or as directed by law.</p>
          </div>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Governing Law and Jurisdiction</h2>
          <p className="text-gray-700">These terms and conditions shall only be governed by the law of India and any legal disputes/discrepancies will be heard or preceded in the jurisdiction of the Indian courts at Pune/Mumbai only</p>
        </section>

        {/* Hazardous Chemical Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Hazardous Garden Chemical Disclaimer</h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="space-y-3 text-gray-700">
              <p>Gidan uses a wide range of chemicals for its gardening products such as fertilizers, pesticides, weed killer and insecticide that contain harmful chemicals and shall be disposed of in a correct manner.</p>
              <p className="font-semibold text-red-700">We strictly put this to your notice that these chemicals should not be used for food, feed, oil or any other personal, experimental purposes which otherwise may introduce hazardous elements in environment or water supply.</p>
              <p>Please do not pour these hazardous chemicals in sewage drains or sinks and do not dispose them normally. Instead please take them to your local recycling center so they can dispose them in an appropriate manner.</p>
              <p className="font-semibold">Gidan does not take any responsibility if the containers or the chemical contents are put in other uses that could harm individual or people.</p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Contact Information</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Company:</strong> FARM AMMINO AGRITECH PRIVATE LIMITED</p>
            <p><strong>Email:</strong> info@gidan.store</p>
            <p><strong>Phone:</strong> +91 7483316150</p>
            <p><strong>Business Hours:</strong> Monday to Saturday, 09:00 AM to 06:00 PM</p>
            <p className="text-sm text-gray-600 mt-4">
              (During national holidays our offices may remain shut)
            </p>
          </div>
        </section>

        {/* Footer */}
        {/* <footer className="text-center text-gray-500 text-sm pt-6 border-t">
          <p>FARM AMMINO AGRITECH PRIVATE LIMITED reserves all rights</p>
          <p className="mt-2">© 2024 Gidan. All rights reserved.</p>
        </footer> */}
      </div>
    </div>

        </>
  );
};

export default TermsOfService;
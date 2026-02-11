import React,{useEffect} from 'react';
import { Shield, Lock, Eye, Database, Smartphone, Users, AlertTriangle, Mail } from 'lucide-react';
import { Helmet } from "react-helmet-async";
import ReturnPolicySchema from "../../views/utilities/seo/ReturnPolicySchema";
import HomepageSchema from "../../views/utilities/seo/HomepageSchema";
import StoreSchema from "../../views/utilities/seo/StoreSchema";

const PrivacyPolicy = () => {
      useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on component mount
      }, []);
  return (


      <>
        <Helmet>
  <title>Gidan - Privacy Policy</title>

  <meta
    name="description"
    content="Read Gidan's Privacy Policy to learn how we collect, use, and protect your information while shopping for plants, pots, seeds, and gardening products online."
  />

  <link
    rel="canonical"
    href="https://gidan.store/privacy-policy"
  />
</Helmet>

    <div className="max-w-4xl mx-auto p-6 bg-white text-gray-800 font-sans">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4 flex items-center justify-center gap-3">
          <Shield className="w-8 h-8" />
          Privacy Policy
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
          At Gidan we recognize that privacy is very important. We promise to respect your contact preferences and to protect your private information. This Privacy Policy describes the information that is collected, how it is used and with whom it might be shared. This Privacy Policy applies to all of the services and products offered by Gidan.
        </p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
          <p className="text-gray-700 leading-relaxed">
            Please read carefully the Privacy Policy and the Terms of Use before you use our website, our tools or our services and before conducting any type of transaction with us. By using any of our services, you accept the practices described in this Privacy Policy and you agree to be bound by the Terms of Use.
          </p>
        </section>

        {/* Data Collection */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
            <Database className="w-6 h-6" />
            Data Collection
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-semibold text-green-800 mb-2">Secure Payment Processing</p>
              <p>We do not store your credit card information or other sensitive data on our servers. Gidan uses the services of the most secure payment gateway to provide safe and secure payment procedures. Your credit card information is never transmitted via our website since the payment gateway is responsible for collecting, storing and encrypting your data.</p>
            </div>
            <p>All the information that is collected is used for products and services provision, billing, identification and authentication, services improvement, contact and research.</p>
            <p>Gidan does not share your email address or other personally identifying information with any third parties, except our service providers, such as credit-card payment processors, performing services on our behalf. These service providers may have access to personal information needed to perform their functions but are not permitted to share or use such information for any other purposes.</p>
          </div>
        </section>

        {/* Cookies & Tracking */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6" />
            Cookies & Tracking Information
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>When your browser visits our website, a cookie is created on your computer. A cookie is a small amount of data, which often includes an anonymous unique identifier that is sent to your browser from a web site's computers and stored on your computer's hard drive. The cookies are required in order to become a member of our service since they facilitate the access to our website and improve the user experience.</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">We use cookies to:</p>
              <ul className="space-y-1 ml-4">
                <li>• Record current session information</li>
                <li>• Store encrypted users' login information</li>
                <li>• Provide services and compile analytics about our users</li>
                <li>• Track browser type, language, and visit patterns</li>
              </ul>
            </div>
            <p>At Gidan we do our best to protect the personal information from unauthorized access, alteration or disclosure.</p>
          </div>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6" />
            Data Protection and Security
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="font-semibold text-yellow-800 mb-2">We do not sell your Personal Information</p>
              <p className="text-yellow-700">We do not sell your Personal Information to anyone for any purpose. We maintain information about you in our business records while you are a customer, or until it is no longer needed for business, tax or legal purposes.</p>
            </div>
            <p>We have implemented encryption or other appropriate security controls to protect Personal Information when stored by Gidan. All the passwords in our web service are hashed by using the SHA-1 cryptographic hash function. Both Gidan and our third party hosting vendors do the best to protect the personal information from unauthorized access, alteration or disclosure.</p>
          </div>
        </section>

        {/* Information Sharing */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Information Sharing and Disclosure
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="font-semibold text-red-800 mb-2">Public Information Warning</p>
              <p className="text-red-700">Any personal information or content that you voluntarily disclose online (in reviews and discussion areas, within your public profile page etc.) becomes publicly available and can be collected and used by others.</p>
            </div>
            <p>Your account name (not your email address) is displayed to other users when you send comments or messages through our Blog/Forums and other users can contact you through messages and comments.</p>
            <p>Creation of account and order placements deems use of your email address without further consent for non-marketing or administrative purposes (such as notifying you of major website changes, updates on Terms and Conditions or Privacy Policy, alerting you to messages from other members or for customer service purposes).</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">Marketing Communications</p>
              <p className="text-blue-700">We use your contact information to send you offers based on your previous orders and your interests.</p>
            </div>
          </div>
        </section>

        {/* Legal Disclosure */}
        <section>
          <h2 className="text-2xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Legal Disclosure Circumstances
          </h2>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-orange-800 mb-3 font-medium">Gidan may be required to disclose personally identifiable information under special circumstances:</p>
            <ul className="space-y-2 text-orange-700 ml-4">
              <li>• To comply with subpoenas, warrants, court orders or legal process</li>
              <li>• To establish or exercise our legal rights or defend against legal claims</li>
              <li>• To investigate, prevent, or take action regarding suspected illegal activities</li>
              <li>• In situations involving potential threats to physical safety</li>
              <li>• For violations of Terms of Use or as required by law</li>
            </ul>
          </div>
        </section>

        {/* Android Application Policy */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            Android Application Privacy Policy
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>Gidan built the Gidan app as a Commercial app. This SERVICE is provided by Gidan and is intended for use as is.</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Information We May Collect:</p>
              <ul className="space-y-1 ml-4">
                <li>• User Identification</li>
                <li>• SMS for OTP verification</li>
                <li>• Phone call permissions</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">Third Party Services Used:</p>
              <ul className="space-y-1 ml-4 text-blue-700">
                <li>• Google Play Services</li>
                <li>• Firebase Analytics</li>
                <li>• Facebook</li>
                <li>• Crashlytics</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Children's Privacy</h2>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-purple-800 font-medium mb-2">Age Restriction: 13 Years and Above</p>
            <p className="text-purple-700">These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers.</p>
          </div>
        </section>

        {/* Policy Updates */}
        <section>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Changes and Updates to This Privacy Notice</h2>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">This Privacy Notice may be revised periodically. Please revisit this page to stay aware of any changes. Your continued use of the Gidan websites constitutes your agreement to this Privacy Notice and any future revisions.</p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400">
          <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Contact Us
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-md border">
              <p className="font-bold text-lg text-gray-800 mb-2">Founder</p>
              <div className="space-y-1 text-gray-700">
                <p><strong>Name:</strong> Sujith Nadig</p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  <strong>Email:</strong> info@gidan.store
                </p>
              </div>
            </div>
            <p className="text-gray-700">If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
          </div>
        </section>

        {/* Security Summary */}
        <section className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Security Commitment</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm text-center">
              <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-700 mb-1">Secure Payments</h3>
              <p className="text-sm text-gray-600">No credit card data stored on our servers</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-700 mb-1">Data Protection</h3>
              <p className="text-sm text-gray-600">Encrypted storage and secure transmission</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-700 mb-1">No Data Selling</h3>
              <p className="text-sm text-gray-600">We never sell your personal information</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      {/* <footer className="text-center text-gray-500 text-sm pt-6 border-t mt-8">
        <p>© 2024 Gidan - FARM AMMINO AGRITECH PRIVATE LIMITED. All rights reserved.</p>
        <p className="mt-1">This privacy policy is subject to change without notice. Last updated: 2024</p>
      </footer> */}
    </div>
<ReturnPolicySchema/>
        <HomepageSchema/>
        <StoreSchema/>
        </>
  );
};

export default PrivacyPolicy;
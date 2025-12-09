import React, {useEffect} from 'react'
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import { isMobile } from 'react-device-detect'
import useDeviceDetect from './CustomHooks/useDeviceDetect';
import applyChromeCompatibilityFixes from './Services/ChromeCompatibility';
import LandingPageLayout from './LandingPageLayout'
import Home from '../src/Components/Home/Home'
import AnniversaryGifts from '../src/views/utilities/AnniversaryGifts/AnniversaryGifts'
import BlogComponent from '../src/views/utilities/Blog/BlogComponent'
import Carriers from '../src/views/utilities/Carriers/Carriers'
import CheckoutPage from '../src/views/utilities/CheckoutPage/CheckoutPage'
import ComboOffer from '../src/views/utilities/ComboOffer/ComboOffer'
import ContactUs from '../src/views/utilities/ContactUs/ContactUs'
import CorporateGiftingPage from '../src/views/utilities/CorperateGifting/CorporateGiftingPage'
import FranchiseEnquires from '../src/views/utilities/FranchiseEnquires/FranchiseEnquires'
import MyOrders from '../src/views/utilities/My Orders/MyOrders'
import OurWork from '../src/views/utilities/OurWork/OurWork'
import PlantFilter from '../src/views/utilities/PlantFilter/PlantFilter'
import ProductData from './views/utilities/ProductData/ProductData'
import ServicesPage from '../src/Services/Service new/ServicePage'
import Wallet from '../src/views/utilities/Wallet/Wallet'
import WishList from '../src/views/utilities/WishList/WishList'
import Stores from './views/Stores/Stores'
import SideBarLayout from './SideBarLayout'
import SideParrot from './views/Users/SideBar/SideParrot'
import ReferAFriend from './views/Users/ReferAFriend/ReferAFriend'
import MobileSidebar from './views/utilities/MobileSidebar/MobileSidebar'
import TrackOrder from './views/Users/TrackOrder/TrackOrder'
import Hamburger from './views/utilities/Hamburger/Hamburger'
import ProfilePage from './views/Users/ProfilePage/ProfilePage'
import Cart from '../src/views/CartProducts/Cart/Cart'
import MobileVerification from './MobileLogin/MobileVerification/Verification'
import MobileSignIn from './MobileLogin/MobileSignIn/MobileSignIn'
import MobileLoginPage from './MobileLogin/MobileLoginPage/MobileLoginPage'
import Birthday from './views/utilities/BirthdayGifts/BirthdayGifts'
import HouseWarming from './views/utilities/HouseWarming/HouseWarming'
import Thankyou from './views/utilities/Thankyou/Thankyou'
import SeasonalCollection1 from './views/utilities/SeasonalCollection1/SeasonalCollection1'
import Pots from './views/utilities/Pots/Pots'
import Seeds from './views/utilities/Seeds/Seeds'
import Plants from './views/utilities/Plants/Plants'
import OutdoorPlants from './views/utilities/OutdoorPlants/OutdoorPlants'
import FloweringPlants from './views/utilities/FloweringPlants/FloweringPlants'
import Featured from './views/utilities/Featured/Featured'
import Latest from './views/utilities/Latest/Latest'
import BestSeller from './views/utilities/BestSeller/BestSeller'
import EcommerceGiftCard from './views/utilities/E-GiftCard/EcommerceGiftCard'
import PlantCare from './views/utilities/PlantCare/PlantCare'
import RakshaBhandan from './views/utilities/RakshaBhandan/RakshaBhandan'
import ServicePage from './Services/ServicePage/ServicePage'
import EditProfile from './views/MobileUser/Edit Profile/EditProfile'
import Verify from './Services/Services/Verify'
import PaymentGateway from './views/utilities/PaymentGateway/PaymentGateway';
import OrderSummary from './views/utilities/MobileCheckout/OrderSummary';
import AddressPage from './views/utilities/MobileCheckout/AddressPage';
import PaymentPage from './views/utilities/MobileCheckout/PaymentPage';
import OrderSuccess from './views/utilities/MobileCheckout/OrderSuccess';
import AddAddressPageCheckout from './views/utilities/MobileCheckout/AddAddressPageCheckout';
import AddNewAddressMobile from './views/MobileUser/AddNewAddressMobile/AddNewAddressMobile';
import TrackOrderMobile from './views/MobileUser/TrackOrderMobile/TrackOrderMobile';
import Landscape from './Services/ServicePage/Landscape';
import Terracegagardening from './Services/ServicePage/Terracegardening'
import VerticalGardening from './Services/ServicePage/VerticalGardening';
import GardenMaintenance from './Services/ServicePage/GardenMaintenance';
import DripIrrigation from './Services/ServicePage/DripIrrigation';
import ReturnPolicy from './Components/Footer/ReturnPolicy';
import ShippingPolicy from './Components/Footer/ShippingPolicy';
import PrivacyPolicy from './Components/Footer/PrivacyPolicy';
import TermsofServices from './Components/Footer/TermsofServices';
import SingleBlog from './views/utilities/Blog/SingleBlog';
import Comingsoon from './views/utilities/Gifts/Comingsoon';
import BTCoins from './views/utilities/Wallet/BTcoins';
import BTCoinsHistory from './views/utilities/Wallet/BTCoinsHistory';
import WalletHistory from './views/utilities/Wallet/WalletHistory';
import Successpage from './views/utilities/PaymentGateway/Successpage';
import TawkToWidget from './tawkto/tawkto';
import GoogleAnalytics from './GoogleAnalytics/GoogleAnalytics';
import FAQs from './Components/Footer/Faqs';
import MobileBarLayout from './views/utilities/MobileSidebar/MbileBarLayout';
import DealOfWeek from './views/utilities/DealOfWeek/DealOfWeek';
import Offer from './views/utilities/Offer/Offer';

const DesktopRoutes = () => (
  <Routes>
{/* <TawkToWidget/> */}
    <Route path="/" element={<LandingPageLayout />}>
      <Route index element={<Home />} />
      <Route path="anniversary" element={<AnniversaryGifts />} />
      <Route path="birthday" element={<Birthday />} />
      <Route path="housewarming" element={<HouseWarming />} />
      <Route path="thankyou" element={<Thankyou />} />
      <Route path="blogcomponent" element={<BlogComponent />} />
      <Route path="blogcomponent/single/:id/" element={<SingleBlog />} />
      <Route path="carriers" element={<Carriers />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="combooffer" element={<ComboOffer />} />
      <Route path="contactus" element={<ContactUs />} />
      <Route path="corporate" element={<CorporateGiftingPage />} />
      <Route path="franchiseenquery" element={<FranchiseEnquires />} />
      <Route path="gifts" element={<Comingsoon />} />
      <Route path="dealofweek" element={<DealOfWeek />} />
      <Route path="offer" element={<Offer />} />
      <Route path="successpage" element={<Successpage />} />
      <Route path="orders" element={<MyOrders />} />
      <Route path="ourwork" element={<OurWork />} />
      <Route path="filter/:id/:category?" element={<PlantFilter />} />
      <Route path="filter/subcategory/:id/:category?/:subcategory" element={<PlantFilter />} />
      <Route path="seasonal" element={<SeasonalCollection1 />} />
      <Route path="pots" element={<Pots />} />
      <Route path="faq" element={<FAQs />} />
      <Route path="seeds" element={<Seeds />} />
      <Route path="plants" element={<Plants />} />
      <Route path="outdoor" element={<OutdoorPlants />} />
      <Route path="search" element={<PlantCare />} />
      <Route path="flower" element={<FloweringPlants />} />
      <Route path="feature" element={<Featured />} />
      <Route path="latest" element={<Latest />} />
      <Route path="bestseller" element={<BestSeller />} />
      <Route path="productdata/:id/" element={<ProductData />} />
      <Route path="services" element={<ServicesPage />} />
      <Route path="services/single/" element={<ServicePage />} />
      <Route path="wishlist" element={<WishList />} />
      <Route path="wallet" element={<Wallet />} />
      <Route path="btcoins" element={<BTCoins />} />
      <Route path="history" element={<BTCoinsHistory />} />
      <Route path="stores" element={<Stores />} />
      <Route path="hamburger" element={<Hamburger />} />
      <Route path="side" element={<SideParrot />} />
      <Route path="cart" element={<Cart />} />
      <Route path="PaymentGateway" element={<PaymentGateway />} />
      <Route path="giftcard" element={<EcommerceGiftCard />} />
      <Route path="rakshabhandan" element={<RakshaBhandan />} />
      <Route path="services/single/landscapingpage" element={<Landscape />} />
      <Route path="services/single/Terracegardening" element={<Terracegagardening />} />
      <Route path="services/single/Verticalgarden" element={<VerticalGardening />} />
      <Route path="services/single/dripirrigation" element={<DripIrrigation />} />
      <Route path="services/single/garden" element={<GardenMaintenance />} />
      <Route path="return" element={<ReturnPolicy/>} />
      <Route path="shipping" element={<ShippingPolicy/>} />
      <Route path="privacy-policy" element={<PrivacyPolicy/>} />
      <Route path="terms" element={<TermsofServices/>} />
    </Route>

    <Route path="profile" element={<SideBarLayout />}>
      <Route index element={<ProfilePage />} />
      <Route path="trackorder" element={<TrackOrder />} />
      {/* <Route path="notification" element={<Notification />} /> */}
      <Route path="giftcard" element={<Comingsoon />} />
      <Route path="wallet" element={<Wallet />} />
      <Route path="referal" element={<ReferAFriend />} />
      <Route path="btcoins" element={<BTCoins />} />
      <Route path="history" element={<BTCoinsHistory />} />
      <Route path="wallethistory" element={<WalletHistory/>} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

const MobileRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPageLayout />}>
      <Route index element={<Home />} />
      <Route path="mobile-signin" element={<MobileSignIn />} />
      <Route path="mobile-verification" element={<MobileVerification />} />
      <Route path="mobile-login" element={<MobileLoginPage />} />
      {/* <Route path="services" element={<ServicesPage />} />
      <Route path="services/single/:id" element={<ServicePage />} /> */}
      <Route path="services" element={<ServicesPage />} />
      <Route path="services/single/" element={<ServicePage />} />
      <Route path="services/single/landscapingpage" element={<Landscape />} />
      <Route path="services/single/Terracegardening" element={<Terracegagardening />} />
      <Route path="services/single/Verticalgarden" element={<VerticalGardening />} />
      <Route path="services/single/dripirrigation" element={<DripIrrigation />} />
      <Route path="services/single/garden" element={<GardenMaintenance />} />
      <Route path="successpage" element={<Successpage />} />
      <Route path="ourwork" element={<OurWork />} />
      <Route path="PaymentGateway" element={<PaymentGateway />} />
      <Route path="franchiseenquery" element={<FranchiseEnquires />} />
      <Route path="contactus" element={<ContactUs />} />
      <Route path="carriers" element={<Carriers />} />
      <Route path="side" element={<SideParrot />} />
      <Route path="cart" element={<Cart />} />
      <Route path="wishlist" element={<WishList />} />
      <Route path="combooffer" element={<ComboOffer />} />
      <Route path="offer" element={<Offer />} />
      <Route path="gifts" element={<Comingsoon />} />
      <Route path="anniversary" element={<AnniversaryGifts />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="terms" element={<TermsofServices/>} />
      <Route path="productdata/:id" element={<ProductData />} />
      <Route path="stores" element={<Stores />} />
      <Route path="orders" element={<MyOrders />} />
      <Route path="filter/:id" element={<PlantFilter />} />
      <Route path="filter/subcategory/:id" element={<PlantFilter />} />
      <Route path="seasonal" element={<SeasonalCollection1 />} />
      <Route path="pots" element={<Featured />} />
      <Route path="plants" element={<Featured />} />
      <Route path="seeds" element={<Featured />} />
      <Route path="faq" element={<FAQs />} />
      <Route path="return" element={<ReturnPolicy/>} />
      <Route path="shipping" element={<ShippingPolicy/>} />
      <Route path="privacy-policy" element={<PrivacyPolicy/>} />
      <Route path="search" element={<PlantCare />} />
      <Route path="outdoor" element={<OutdoorPlants />} />
      <Route path="flower" element={<FloweringPlants />} />
      <Route path="feature" element={<Featured />} />
      <Route path="latest" element={<Latest />} />
      <Route path="bestseller" element={<BestSeller />} />
      <Route path="blogcomponent" element={<BlogComponent />} />
      <Route path="thankyou" element={<Thankyou />} />
      <Route path="giftcard" element={<EcommerceGiftCard />} />
      <Route path="rakshabhandan" element={<RakshaBhandan />} />
      <Route path="hamburger" element={<Hamburger />} />
      <Route path="/order-summary" element={<OrderSummary />} />
      <Route path="/address" element={<AddressPage />} />
      <Route path="/add-address" element={<AddAddressPageCheckout />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/order-success" element={<OrderSuccess />} />
    </Route>

    <Route path="mobilesidebar" element={<MobileBarLayout/>}>
      <Route index element={<MobileSidebar />} />
      <Route path="editprofile" element={<EditProfile />} />
      <Route path="trackmobile" element={<TrackOrderMobile />} />
      <Route path="walletmobile" element={< Wallet />} />
      <Route path="referalmobile" element={<ReferAFriend />} />
      <Route path="giftcardmobile" element={<Comingsoon />} />
      <Route path="address" element={<AddNewAddressMobile />} />
      <Route path="wallethistory" element={<WalletHistory/>} />

    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

const App = () => {
  const { isOnePlus } = useDeviceDetect();
  // const location = useLocation(); // gets current route info
  // Chrome compatibility fixes for OnePlus and Android devices
  React.useEffect(() => {
    const cleanup = applyChromeCompatibilityFixes();
    
    // Return cleanup function
    return cleanup;
  }, [isOnePlus]);



  return (
    <div>
      <GoogleAnalytics />
      {/* <TawkToWidget /> */}
      <Verify />
      {isMobile ? <MobileRoutes /> : <DesktopRoutes />}
    </div>
  );
}

export default App

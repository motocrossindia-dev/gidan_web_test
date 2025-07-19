import React from 'react'
import { Outlet } from "react-router-dom";

import Header from '../../../Components/Header/Header';
import Footer from '../../../Components/Footer/Footer';
import Navigation from '../../../Components/NavigationBar/NavigationBar';



const MobileBarLayout = () => {
  return (
    <div >
      <Header />
        <Navigation/>
         <div className='  bg-gray-100'> 
      <div className='display flex  px-2'>



        <div className='w-screen' >
        <Outlet/>
        </div>
        </div>
    </div>
      <Footer />
    </div>
  )
}

export default MobileBarLayout
 

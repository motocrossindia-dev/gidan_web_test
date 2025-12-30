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
            {/* Footer */}
            <Footer />
        </div>
        </div>
    </div>
    </div>
  )
}

export default MobileBarLayout
 

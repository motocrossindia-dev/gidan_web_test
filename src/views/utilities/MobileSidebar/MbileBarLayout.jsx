'use client';

import React from 'react'
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import Navigation from '../../../components/NavigationBar/NavigationBar';



const MobileBarLayout = () => {
  return (
    <div >
      <Header />
        <Navigation/>
         <div className='  bg-gray-100'> 
      <div className='display flex  px-2'>



        <div className='w-screen' >
        {/* Outlet removed - use Next.js layout children */}
            {/* Footer */}
            <Footer />
        </div>
        </div>
    </div>
    </div>
  )
}

export default MobileBarLayout
 

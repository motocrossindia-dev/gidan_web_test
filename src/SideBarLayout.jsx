'use client';

import React from 'react'
// import { Outlet } from 'react-router'
import Header from '../src/components/Header/Header'
import Footer from '../src/components/Footer/Footer'
import Navigation from '../src/components/NavigationBar/NavigationBar'
import SideBar from '../src/views/Users/SideBar/SideBar'


const SideBarLayout = () => {
  return (
    <div >
      <Header />
        <Navigation/>
         <div className='px-8  bg-site-bg'> 
      <div className='display flex  md:py-6 px-2'>

        <div className='   md:w-[290px] '>
        {/* <SideParrot/> */}
        <SideBar/>
        </div>

        <div className='w-screen' >
        {/* Outlet removed - use Next.js layout children */}
        </div>
        </div>
    </div>
      <Footer />
    </div>
  )
}

export default SideBarLayout
 

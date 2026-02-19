'use client';

import React from 'react'
// import { Outlet } from 'react-router'
import { Outlet } from "react-router-dom";

import Header from '../src/components/Header/Header'
import Footer from '../src/components/Footer/Footer'
import Navigation from '../src/components/NavigationBar/NavigationBar'
import SideBar from '../src/views/Users/SideBar/SideBar'


const SideBarLayout = () => {
  return (
    <div >
      <Header />
        <Navigation/>
         <div className='px-8  bg-gray-100'> 
      <div className='display flex  md:py-6 px-2'>

        <div className='   md:w-[290px] '>
        {/* <SideParrot/> */}
        <SideBar/>
        </div>

        <div className='w-screen' >
        <Outlet/>
        </div>
        </div>
    </div>
      <Footer />
    </div>
  )
}

export default SideBarLayout
 

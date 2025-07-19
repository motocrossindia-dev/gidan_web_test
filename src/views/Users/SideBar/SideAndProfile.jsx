import React from 'react'
import SideBar from './SideBar'
import ProfilePage from '../ProfilePage/ProfilePage'

const SideAndProfile = () => {
  return (
    <div className='display flex '>
        <SideBar/>
        <ProfilePage/>
    </div>
  )
}

export default SideAndProfile
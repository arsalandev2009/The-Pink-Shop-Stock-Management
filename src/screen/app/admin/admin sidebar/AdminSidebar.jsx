import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import style from './AdminSidebar.module.css'
import { FiMenu, FiUsers } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'
import { LuBox, LuLayoutDashboard } from 'react-icons/lu'
import { IoSettingsOutline } from 'react-icons/io5'
import Logo from '../../../../asset/logo.png'

function AdminSidebar() {
  const [mobileSideBar,setMobileSideBar]=useState(false)
  const handleClose = ()=>{setMobileSideBar(false)}

  return (
    <div>
      {/* <div className={style.header}><Header HeaderButtonText={'Logout'} HeaderButtonOnClick={handleLogout}/></div> */}
      <div className={style.maincontainer}>
        <div className={style.sidebarmobile}>
          {!mobileSideBar? (<FiMenu className={style.sidebarmenubutton} color='#AD1457' size={30} onClick={()=>{setMobileSideBar(true)}}/>):(<></>)}
          {mobileSideBar && (
            <div className={style.sidebar}>
              <button ><IoMdClose onClick={handleClose} color='#ff1493' size={30}/></button>
              <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`}  onClick={()=>{setMobileSideBar(false)}} to={'admindashboard'}> Dashboard</NavLink>
              <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`}  onClick={()=>{setMobileSideBar(false)}} to={'adminproducts'}>Products</NavLink>
              <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`}  onClick={()=>{setMobileSideBar(false)}} to={'admincustomers'}>Customers</NavLink>
              <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`}  onClick={()=>{setMobileSideBar(false)}} to={'adminsettings'}>Settings</NavLink>
            </div>
          )}
        </div>
        <div className={style.sidebardesktop}>
          <div className={style.sidebardesktopupper}>
            <img src={Logo} alt="" width={90}/>
            <h3>The Pink Shop</h3>
            <p style={{color:'#635054'}}>Admin Panel</p>
          </div>
          <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''} `} to={'admindashboard'}> <LuLayoutDashboard className={style.icon} size={20}  /> Dashboard</NavLink>
          <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`} to={'adminproducts'}> < LuBox className={style.icon} size={20} /> Products</NavLink>
          <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`} to={'admincustomers'}> <FiUsers className={style.icon} size={20} /> Customers</NavLink>
          <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`} to={'adminsettings'}> <IoSettingsOutline className={style.icon} size={20} /> Settings</NavLink>
        </div>

        <div className={style.content}> <Outlet/> </div>
      </div>
    </div>
  )
}

export default AdminSidebar
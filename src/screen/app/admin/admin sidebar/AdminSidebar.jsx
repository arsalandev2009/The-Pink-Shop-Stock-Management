import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import style from './AdminSidebar.module.css'
import {  FiUsers } from 'react-icons/fi'
import { FiShoppingBag } from "react-icons/fi";
import { LuBox, LuLayoutDashboard } from 'react-icons/lu'
import Logo from '../../../../asset/logo.png'

function AdminSidebar() {
  const [mobileSideBar,setMobileSideBar]=useState(false)

  return (
    <>
      <div className={style.maincontainer}>
        <div className={style.sidebarmobile}>
              <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`}  onClick={()=>{setMobileSideBar(false)}} to={'admindashboard'}> <LuLayoutDashboard size={20}/> Dashboard</NavLink>
              <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`}  onClick={()=>{setMobileSideBar(false)}} to={'adminproducts'}> <LuBox size={20}/> Products</NavLink>
              <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`}  onClick={()=>{setMobileSideBar(false)}} to={'admincustomers'}> <FiUsers size={20}/> Customers</NavLink>
              <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`}  onClick={()=>{setMobileSideBar(false)}} to={'adminorders'}> <FiShoppingBag size={20}/> Orders</NavLink>
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
          <NavLink className={({isActive})=> `${style.navlink} ${isActive ? style.active : ''}`} to={'adminorders'}> <FiShoppingBag className={style.icon} size={20} /> Orders</NavLink>
        </div>

        <div className={style.content}> <Outlet/> </div>
      </div>
    </>
  )
}

export default AdminSidebar
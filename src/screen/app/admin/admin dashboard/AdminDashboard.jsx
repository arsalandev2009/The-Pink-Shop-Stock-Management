import React, { useEffect, useState } from 'react'
import style from './AdminDashboard.module.css'
import { supabase } from '../../../../utils/supabase'
import { FiLogOut, FiUser } from 'react-icons/fi'
import { CgProfile } from 'react-icons/cg'

function AdminDashboard() {
  const [getProductDataFromSupabase,setGetProductDataFromSupabase]=useState([])
  const [getCustomersDataFromSupabase,setGetCustomersDataFromSupabase]=useState([])

  useEffect(()=>{
   async function getData(){
    const {data,error}=await supabase.from('products').select('*')
    if(!error){
      setGetProductDataFromSupabase(data)
    }else{
      alert('Error! Contact the developer')
      console.log(error)
    }

    const {data:customerdata,error:customererror}=await supabase.from('customers').select('*')
    if(!customererror){
      setGetCustomersDataFromSupabase(customerdata)
      console.log(customerdata)
      return
    }else{
      alert('Error! Contact the developer')
      console.log(customererror)
    }

   }
    getData()
  },[])
  return (
  <>
  <div className={style.header}>
    <p> <span style={{color:'#71717B'}}>Admin / </span>Dashboard</p>
    <button><FiLogOut/> Logout</button>
  </div>
    <div className={style.container}>
      <div className={style.boxes}>
        <h2>Total Products</h2>
        {getProductDataFromSupabase.length}
      </div>
      <div className={style.boxes}>
        <h2>Total Customers</h2>
        {getCustomersDataFromSupabase.length}
      </div>
    </div>
  </>
  )
}

export default AdminDashboard
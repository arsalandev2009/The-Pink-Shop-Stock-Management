import React, { useEffect, useState } from 'react'
import style from './AdminDashboard.module.css'
import { supabase } from '../../../../utils/supabase'
import { FiLogOut, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'


function AdminDashboard() {
  const navigate = useNavigate()
  const [getProductDataFromSupabase,setGetProductDataFromSupabase]=useState([])
  const [getCustomersDataFromSupabase,setGetCustomersDataFromSupabase]=useState([])

  useEffect(()=>{
   async function getData(){
    const {data,error}=await supabase.from('productCosmetics').select('*')
    if(!error){
      setGetProductDataFromSupabase(data)
    }else{
      alert('Error!h Contact the developer')
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

    const handleLogout =async()=>{
        const {data,error}=await supabase.auth.signOut()
          if(error){
            alert(error.message)
            return
          }else{
            navigate('/')
          }
      }

  return (
  <>
  <div className={style.header}>
    <p> <span style={{color:'#71717B'}}>Admin / </span>Dashboard</p>
    <button onClick={handleLogout} type='button'><FiLogOut/> Logout</button>
  </div>
    <div className={style.container}>
      <div className={style.boxes}>
        <div className={style.boxesupper}>
          <p style={{color:'#71717B'}}>Total Products</p>
          <h2>{getProductDataFromSupabase.length}</h2>
        </div>
        <button onClick={()=>{navigate('/admin/adminproducts')}}>View</button>
      </div>
      <div className={style.boxes}>
        <div className={style.boxesupper}>
          <p style={{color:'#71717B'}}>Total Customers</p>
          <h2>{getCustomersDataFromSupabase.length}</h2>
        </div>
        <button onClick={()=>{navigate('/admin/admincustomers')}}>View</button>
      </div>
    </div>
  </>
  )
}

export default AdminDashboard
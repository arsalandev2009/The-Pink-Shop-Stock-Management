import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

function ProtectedRoute({children}) {

const [userData,setUserData]=useState()
const [loading, setLoading] = useState(true);

    useEffect(()=>{
     async function checkUser(){
      const {data:{user},error}=await supabase.auth.getUser()
      if(!error){
        setUserData(user)
      }
      setLoading(false)
     }
     checkUser()
    },[])

    if (loading) { return <div>Loading...</div>; }
    
    if(!userData){
      return <Navigate to='/login' replace/>
    }
    return children;
    

  return (
    <div></div>
  )
}

export default ProtectedRoute
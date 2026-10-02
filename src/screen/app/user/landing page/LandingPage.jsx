import React from 'react'
import style from './LandingPage.module.css'
import { FiLogOut } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../../../asset/logo.png'

function LandingPage() {

  const navigate = useNavigate()

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
        <p> <img src={Logo} alt="The Pink Shop" width={60} /></p>
        <div className={style.headermid}>
          {/* <Link>Home</Link> */}
          <Link>All Products</Link>
          <Link>Contact Us</Link>
        </div>
        <button onClick={handleLogout} type='button'><FiLogOut/> Logout</button>
      </div>
      <div className={style.container}>

      </div>
      <div className={style.footer}>

      </div>
    </>
  )
}

export default LandingPage
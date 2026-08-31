import React, { useEffect, useState } from 'react'
import { supabase } from '../../../utils/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import style from './Login.module.css'

function Login() {
    const navigate = useNavigate()
    const [loginData,setLoginData]=useState({email:'',password:''})
    const [showPassword,setShowPassword]=useState()

    const handleChange=(e)=>{
        setLoginData({...loginData,[e.target.name]:e.target.value})
    }
   
    const handleSubmit=async(e)=>{
        e.preventDefault()

        const {data,error}=await supabase.auth.signInWithPassword({email:loginData.email,password:loginData.password})
            if(!error){
            
            navigate("/productsdashboard");
            return
            }
            alert('Error! Contact the developer')
    }
    return (
        <div className={style.container}>

          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.upper}>
              <h2 style={{color:'#ff1493'}}> THE PINK SHOP </h2>
              <p > Login to your account </p>
            </div>

            <div className={style.mid}>
              <label className={style.label}> Email </label>
              <div className={style.inputparent}>
                <input className={style.input} value={loginData.email} type='email' onChange={handleChange} name="email" required  placeholder="Enter your Email" />
                {/* <button className={style.eyebutton} type="button"  onClick={() => setShowPassword(!showPassword)} > {showPassword ? <FaEyeSlash /> : <FaEye />} </button> */}
              </div>
              <label className={style.label}> Password </label>
              <div className={style.inputparent}>
                <input className={style.input} type={showPassword ? "text" : "password"} onChange={handleChange} name="password" required  placeholder="Enter your password" />
                <button className={style.eyebutton} value={loginData.password} type="button"  onClick={() => setShowPassword(!showPassword)} > {showPassword ? <FaEyeSlash /> : <FaEye />} </button>
              </div>

            </div>

            <div className={style.lower}>

                <Link to={'/forgetpassword'} className={style.link}> Forget Password </Link>
            <button type="submit" className={style.button}> Login </button>
            </div>
          </form>
        </div>
    )
}

export default Login


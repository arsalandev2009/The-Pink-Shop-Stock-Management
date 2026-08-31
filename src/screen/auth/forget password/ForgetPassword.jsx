import React, {useState } from 'react'
import style from './ForgetPassword.module.css'
import { supabase } from '../../../utils/supabase'

function ForgetPassword() {
    const [email,setEmail]=useState()

    const handleChange=(e)=>{setEmail(e.target.value)}
   
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const {data,error}=await supabase.auth.resetPasswordForEmail(email, {redirectTo: "https://thepinkshopstock.vercel.app/updatepassword",})
        if(!error){
            if (email.endsWith("@gmail.com")) {
              window.location.href = "https://mail.google.com/";
            }
        }
    }

    return (
        <div className={style.container}>

          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.upper}>
              <h2 style={{color:'#ff1493'}}> THE PINK SHOP </h2>
              <p >Enter Your Email to Reset <br /> Your Password </p>
            </div>

            <div className={style.mid}>
              <label className={style.label}> Email </label>
              <div className={style.inputparent}>
                <input className={style.input} type='email' onChange={handleChange} name="email" required  placeholder="Enter your Email" />
                {/* <button className={style.eyebutton} type="button"  onClick={() => setShowPassword(!showPassword)} > {showPassword ? <FaEyeSlash /> : <FaEye />} </button> */}
              </div>

            </div>

            <div className={style.lower}>

            <button type="submit" className={style.button}> Send </button>
            </div>
          </form>
        </div>
    )
}

export default ForgetPassword


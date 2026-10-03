import React, {useState } from 'react'
import style from './ForgetPassword.module.css'
import { supabase } from '../../../utils/supabase'
import { Link } from 'react-router-dom'

function ForgetPassword() {
    const [email,setEmail]=useState('')
    const [isDisabled,setIsDisabled]=useState(false)

    const handleChange=(e)=>{setEmail(e.target.value)}
   
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setIsDisabled(true)
        const {data,error}=await supabase.auth.resetPasswordForEmail(email, {redirectTo: "https://thepinkshopstock.vercel.app/updatepassword",})
        if(!error && email.endsWith("@gmail.com")){  
            window.location.href = "https://mail.google.com/";
            setEmail('')
            return
        }
        if(error.message.includes('For security purposes, you can only request this after')){
          Swal.fire({
            title: 'Wait 1 Minute! 🌸',
            text: 'Dobaara email bhejne ke liye 1 minute intezaar karein.',
            icon: 'info',
            iconColor: '#ea4c89', 
            confirmButtonText: 'Okay',
            confirmButtonColor: '#ea4c89', 
            background: '#fffafb', 
            color: '#333333', 
            borderRadius: '15px'
          });
          return
        }
        alert(error.message)
    }

    return (
        <div className={style.container}>

          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.upper}>
              <h1> THE PINK SHOP </h1>
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
              <button type="submit" className={style.button} disabled={isDisabled}> {isDisabled ? 'Check your gmail' :'Send'} </button>
              <p>Remember Your Password? <Link to={'/login'}>Login</Link></p> 
            </div>
          </form>
        </div>
    )
}

export default ForgetPassword


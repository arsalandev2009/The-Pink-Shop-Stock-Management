import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import style from './UpdatePassword.module.css'
import { supabase } from '../../../utils/supabase'

function UpdatePassword() {
    const navigate = useNavigate()
    const [password,setPassword]=useState()
        const [showPassword,setShowPassword]=useState()
    


    const handleChange=(e)=>{
        setPassword(e.target.value)
    }
   
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const {data,error}=await supabase.auth.updateUser({password})
        if(!error){
     navigate('/login')
        }
    }
    return (
        <div className={style.container}>

          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.upper}>
              <h2 style={{color:'#ff1493'}}> THE PINK SHOP </h2>
              <p >Enter Your New Password </p>
            </div>

            <div className={style.mid}>
              <label className={style.label}> Password </label>
              <div className={style.inputparent}>
                <input className={style.input} type={showPassword?'text':'password'} onChange={handleChange} name="password" required  placeholder="Enter your Password" />
                <button className={style.eyebutton} type="button"  onClick={() => setShowPassword(!showPassword)} > {showPassword ? <FaEyeSlash /> : <FaEye />} </button>
              </div>

            </div>

            <div className={style.lower}>

            <button type="submit" className={style.button}> Submit </button>
            </div>
          </form>
        </div>
    )
}

export default UpdatePassword


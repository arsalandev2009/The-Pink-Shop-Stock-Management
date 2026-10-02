import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import style from './UpdatePassword.module.css'
import { supabase } from '../../../utils/supabase'

function UpdatePassword() {
    const navigate = useNavigate()
        const [passwords,setPasswords]=useState({password:'',confirmpassword:''})
        const [showPassword,setShowPassword]=useState()
        const [showConfirmPassword,setShowConfirmPassword]=useState()
    


    const handleChange=(e)=>{
      let name  = e.target.name;
      let value = e.target.value
        setPasswords((prev)=>({...prev,[name]:value}))
    }
   
    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(passwords.password === passwords.confirmpassword){
          const {data,error}=await supabase.auth.updateUser({password:passwords.password})
            if(!error){
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your password has been updated successfully.',
                confirmButtonText: 'Continue',
                confirmButtonColor: '#E7437E',
                background: '#FFF3F4',
                customClass: {
                  popup: 'custom-sweet-alert',
                  title: 'sweet-alert-title',
                  htmlContainer: 'sweet-alert-text'
                }
              });
            navigate('/login')
            }
          return
        }
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Passwords do not match!',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#E7437E',
          background: '#FFF3F4',
          customClass: {
            popup: 'custom-sweet-alert',
            title: 'sweet-alert-title',
            htmlContainer: 'sweet-alert-text'
          }
        });
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
                <input className={style.input} type={showPassword?'text':'password'} onChange={handleChange} value={passwords.password} name="password" required  placeholder="Enter your Password" />
                <button className={style.eyebutton} type="button"  onClick={() => setShowPassword(!showPassword)} > {showPassword ? <FaEyeSlash /> : <FaEye />} </button>
              </div>

              <label className={style.label}>Confirm Password </label>
              <div className={style.inputparent}>
                <input className={style.input} type={showConfirmPassword?'text':'password'} onChange={handleChange} value={passwords.confirmpassword} name="confirmpassword" required  placeholder="Re-enter your Password" />
                <button className={style.eyebutton} type="button"  onClick={() => setShowConfirmPassword(!showConfirmPassword)} > {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} </button>
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


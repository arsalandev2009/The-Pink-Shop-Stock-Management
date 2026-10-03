import React, { useState } from 'react'
import style from './Signup.module.css'
import {FaEye,FaEyeSlash} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../../utils/supabase'
import Swal from 'sweetalert2'

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupData,setSignupData] = useState({name:'',email:'',password:'',confirmpassword:''})
  const navigate = useNavigate()
  function handleChange(e){
    let name = e.target.name;
    let value = e.target.value
    setSignupData((prev)=>({...prev,[name]:value}))
  }
  async function handleSubmit(e){
    e.preventDefault()
    if(signupData.password === signupData.confirmpassword){
      const {data,error} =await supabase.auth.signUp({email:signupData.email,password:signupData.password,options:{data:{display_name: signupData.name,}}})
      if(data.user){
        const {data:userdata,error:usererror} =await supabase.from('webcustomers').insert([{id:data.user.id,role:'user',name:signupData.name,email:signupData.email}])
          if(!usererror){
            alert('success')
            return
          }
          alert(usererror)  
        return
      }
      if(error.message.toLowerCase() === 'user already registered'){
        Swal.fire({
          title: 'Already Registered! 🌸',
          text: 'This email is already registered. Please log in instead.',
          icon: 'warning',
          iconColor: '#ea4c89', 
          confirmButtonText: 'Login',
          confirmButtonColor: '#ea4c89', 
          background: '#fffafb', 
          color: '#333333', 
          borderRadius: '15px'
        }).then(()=>{
          navigate('/login')
        });
      return
      }
      alert(error.message)
    }
  }

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.upper}>
          <h1>THE PINK SHOP</h1>
          <p>Create your account</p>
        </div>

        <div className={style.mid}>
          <label className={style.label}>Name</label>
          <div className={style.inputparent}>
            <input 
              type="text" 
              className={style.input} 
              placeholder="Enter Your Name" 
              onChange={handleChange}
              name='name'
              value={signupData.name}
            />
          </div>
        </div>

        <div className={style.mid}>
          <label className={style.label}>Email</label>
          <div className={style.inputparent}>
            <input 
              type="email" 
              className={style.input} 
              placeholder="Enter Your Email" 
              onChange={handleChange}
              name='email'
              value={signupData.email}
            />
          </div>
        </div>

        <div className={style.mid}>
          <label className={style.label}>Password</label>
          <div className={style.inputparent}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className={style.input} 
              placeholder="Enter Your Password" 
              onChange={handleChange}
              name='password'
              value={signupData.password}
            />
            <button 
              type="button" 
              className={style.eyebutton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash/>:<FaEye/>}
            </button>
          </div>
        </div>

        <div className={style.mid}>
          <label className={style.label}>Confirm Password</label>
          <div className={style.inputparent}>
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              className={style.input} 
              placeholder="Re-enter Your Password" 
              onChange={handleChange}
              name='confirmpassword'
              value={signupData.confirmpassword}
            />
            <button 
              type="button" 
              className={style.eyebutton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash/>:<FaEye/>}
            </button>
          </div>
        </div>

        <div className={style.lower}>
          <button type='submit' className={style.button}>Sign Up</button>
          <p className={style.loginText}>
            Already have an account? <Link to='/login' className={style.link}>Login</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Signup
import React, { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { Navigate, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'

function Login() {
    const navigate = useNavigate()
    const [loginData,setLoginData]=useState()
    const [getData,setGetData]=useState([])
    const [showPassword,setShowPassword]=useState()

    useEffect(()=>{
        const getData = async()=>{
            const {data,error} = await supabase.from('login').select().single()
            if(!error){
                setGetData(data)
            }
        }
        getData()
    },[])
   

    const handleChange=(e)=>{
        setLoginData(e.target.value)
    }
    const handleSubmit=(e)=>{
        e.preventDefault()

        if(loginData.trim()=== getData.password){
            Swal.fire({
                icon: "success",
                title: "Login Successful!",
                text: "Welcome back!",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => {
                sessionStorage.setItem('loggedin',getData.password)
                navigate("/home");
            });
        }
    }
    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-white">

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 p-4 bg-white rounded-4 shadow-lg border" style={{ width: "350px", maxWidth: "90%" }} >
            <div className="text-center mb-2">
              <h3 className="fw-bold mb-1" style={{ color: "#e91e63" }} > THE PINK SHOP </h3>
              <p className="text-secondary small mb-0"> Login to your account </p>
            </div>

            <div>
              <label className="form-label fw-semibold text-dark"> Password </label>
              <div className="input-group">
                <input type={showPassword ? "text" : "password"} onChange={handleChange} name="password" required className="form-control shadow-none" placeholder="Enter your password" />
                <button type="button" className="btn btn-outline-secondary shadow-none" onClick={() => setShowPassword(!showPassword)} > {showPassword ? <FaEyeSlash /> : <FaEye />} </button>
              </div>
            </div>

            <button type="submit" className="btn text-white w-100 py-2 fw-semibold rounded-3" style={{ backgroundColor: "#e91e63" }} > Login </button>
          </form>
        </div>
    )
}

export default Login


import React, { useState } from 'react'
import { supabase } from '../../../utils/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import style from './Login.module.css'

function Login() {
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({ email: loginData.email, password: loginData.password })
        
        if (!error) {
          const {data:roledata,error:roleerror} = await supabase.from('webcustomers').select('*').eq('id',data.user.id).maybeSingle()
            if(roledata.role.toLowerCase() === 'user'){
              navigate('/')
              return
            }
            if(roledata.role.toLowerCase()==='admin'){
              navigate("/admin")
              return
            }
            alert('Login page error ! Contact the developer')
            Console.log(roleerror)
            return
        }
        alert(error.message)
        
    }

    return (
        <div className={style.container}>
            <form onSubmit={handleSubmit} className={style.form}>
                
                {/* Header */}
                <div className={style.upper}>
                    <h2>THE PINK SHOP</h2>
                    <p>Login to your account</p>
                </div>

                {/* Form Fields */}
                <div className={style.mid}>
                    <div className={style.fieldGroup}>
                        <label className={style.label}>Email</label>
                        <div className={style.inputparent}>
                            <input 
                                className={style.input} 
                                value={loginData.email} 
                                type="email" 
                                onChange={handleChange} 
                                name="email" 
                                required 
                                placeholder="Enter your Email" 
                            />
                        </div>
                    </div>

                    <div className={style.fieldGroup}>
                        <label className={style.label}>Password</label>
                        <div className={style.inputparent}>
                            <input 
                                className={style.input} 
                                value={loginData.password} 
                                type={showPassword ? "text" : "password"} 
                                onChange={handleChange} 
                                name="password" 
                                required 
                                placeholder="Enter your password" 
                            />
                            <button 
                                className={style.eyebutton} 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                            > 
                                {showPassword ? <FaEyeSlash /> : <FaEye />} 
                            </button>
                        </div>
                        <Link to={'/forgetpassword'} className={style.forgotLink}> 
                            Forgot Password? 
                        </Link>
                    </div>
                </div>

                {/* Action Buttons & Links */}
                <div className={style.lower}>
                    <button type="submit" className={style.button}> Login </button>
                    <p className={style.signupText}>
                        Don't have an account? {' '}
                        <Link to={'/signup'} className={style.signupLink}> Sign Up </Link>
                    </p>
                </div>

            </form>
        </div>
    )
}

export default Login
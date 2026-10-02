import React from 'react'
import { AdminProducts, Login,   ForgetPassword, UpdatePassword,  AdminDashboard, AdminSidebar, AdminCustomers,  ComingSoon, Signup,  Extra, LandingPage } from '../screen/screen'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

export default function Routing() {
  return (
    <div>

<BrowserRouter>
<Routes>
    {/* <Route path='/' element={<LandingPage/>}/> */}
    <Route path='/' element={<Extra/>}/>
    
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/forgetpassword' element={<ForgetPassword/>}/>
    <Route path='/updatepassword' element={<UpdatePassword/>}/>

    <Route path='/admin' element={ <ProtectedRoute> <AdminSidebar/> </ProtectedRoute>}>
    <Route index element={<Navigate to="admindashboard" replace />} />
    <Route path='admindashboard' element={  <AdminDashboard/>  }/>
    <Route path='adminproducts' element={  <AdminProducts/> }/>
    <Route path='admincustomers' element={  <AdminCustomers/>  }/>
    {/* <Route path='adminsettings' element={  <AdminSettings/>  }/> */}
    <Route path='adminorders' element={  <ComingSoon/> }/>

    </Route>
</Routes>
</BrowserRouter>
        
      
    </div>
  )
}

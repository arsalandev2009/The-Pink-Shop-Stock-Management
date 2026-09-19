import React from 'react'
import { AdminProducts, Login, ProductsShow,  ForgetPassword, UpdatePassword,  AdminDashboard, AdminSidebar, AdminCustomers, AdminSettings, ComingSoon } from '../screen/screen'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

export default function Routing() {
  return (
    <div>

<BrowserRouter>
<Routes>
    <Route path='/' element={<ProductsShow/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/forgetpassword' element={<ForgetPassword/>}/>
    <Route path='/updatepassword' element={<UpdatePassword/>}/>

    <Route path='/admin' element={ <ProtectedRoute> <AdminSidebar/> </ProtectedRoute>}>
    <Route index element={<Navigate to="admindashboard" replace />} />
    <Route path='admindashboard' element={  <AdminDashboard/>  }/>
    <Route path='adminproducts' element={  <AdminProducts/> }/>
    <Route path='admincustomers' element={  <AdminCustomers/>  }/>
    {/* <Route path='adminsettings' element={  <AdminSettings/>  }/> */}
    <Route path='adminsettings' element={  <ComingSoon/> }/>

    </Route>
</Routes>
</BrowserRouter>
        
      
    </div>
  )
}

import React from 'react'
import { AdminProducts, Login, ProductsShow, AdminProductsDetailsPage, ForgetPassword, UpdatePassword,  AdminDashboard, AdminSidebar, AdminCustomers, AdminSettings } from '../screen/screen'
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
    <Route path='adminsettings' element={  <AdminSettings/>  }/>
    <Route path='adminproductsdetail/:id' element={<AdminProductsDetailsPage/>}/>
    </Route>
</Routes>
</BrowserRouter>
        
      
    </div>
  )
}

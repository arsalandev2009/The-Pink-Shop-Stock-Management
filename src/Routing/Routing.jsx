import React from 'react'
import { ProductsDashboard, Login, ProductsShow, ProductsDetailsPage, ForgetPassword, UpdatePassword } from '../screen/screen'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
    <Route path='/productsdashboard' element={ <ProtectedRoute> <ProductsDashboard/> </ProtectedRoute> }/>
    <Route path='/productsdetail/:id' element={<ProductsDetailsPage/>}/>
</Routes>
</BrowserRouter>
        
      
    </div>
  )
}

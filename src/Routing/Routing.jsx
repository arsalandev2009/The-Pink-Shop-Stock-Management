import React from 'react'
import { ProductsDashboard, Login, ProductsShow, ProductsDetailsPage } from '../screen/screen'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

export default function Routing() {
  return (
    <div>

<BrowserRouter>
<Routes>
    <Route path='/' element={<ProductsShow/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/productsdashboard' element={ <ProtectedRoute> <ProductsDashboard/> </ProtectedRoute> }/>
    <Route path='/productsdetail/:id' element={<ProductsDetailsPage/>}/>
</Routes>
</BrowserRouter>
        
      
    </div>
  )
}

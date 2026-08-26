import React from 'react'
import { Home, Login, ProductsShow } from '../screen/screen'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

export default function Routing() {
  return (
    <div>

<BrowserRouter>
<Routes>
    <Route path='/' element={<ProductsShow/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/home' element={
      <ProtectedRoute>
      <Home/>
      </ProtectedRoute>
      }/>
</Routes>
</BrowserRouter>
        
      
    </div>
  )
}

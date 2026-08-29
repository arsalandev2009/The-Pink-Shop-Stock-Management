import React, { useEffect, useState } from 'react'
import Logo from '../../../assets/logo.png'
import { Navigate, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { supabase } from '../../../utils/supabase'
function ProductsShow() {

  
  const navigate=useNavigate()
  const [filtered,setFiltered]=useState([])
  const [searchInput,setSearchInput]=useState('')
  const [getProducts,setGetProducts]=useState([])

  useEffect(()=>{
    const getProducts=async()=>{
      const {data,error}=await supabase.from('products').select()
      if(!error){
        setGetProducts(data)
      }
      
    }
    getProducts()

  

  },[])

  const handleSearch = (e)=>{
    const Search= e.target.value
    setSearchInput(Search)
    const result = getProducts.filter((item) => item.name.toLowerCase().includes(Search.toLowerCase()));
    setFiltered(result)
  }
  
  return (
  <div>

    
  <header  className="d-flex align-items-center justify-content-between border bg-white position-fixed top-0 start-0 end-0 z-3 px-2 px-sm-4 py-1">
    
    <img src={Logo} alt="The Pink Shop" className="headerimage img-fluid"  />

    <button onClick={() => navigate('/login')} className="headerloginbutton  text-white px-3 py-2 rounded-2" style={{ backgroundColor: "#EA558A" }} > Add More Products </button>

  </header>

 <div className=" pt-5 productshowmain">

  <div className=" rounded-pill mx-auto  productshowinput">
    <FaSearch className="productshowsearchicon" />

    <input type="text" className="form-control border-0 shadow-none p-0 productshowsearch" onChange={handleSearch} name='search' placeholder="Search..." />
  </div>

  <div className="productshowproducts">

   {searchInput == '' ? (
    getProducts.map((item)=>(
      <div key={item.id} className=" border-0 rounded-3 overflow-hidden productshowcard" >
        <div className="d-flex align-items-center justify-content-center productshowimagebox">
          <img src={item.image} alt={item.name} className=" productshowimage" />
        </div>
        <div className=" d-flex flex-column justify-content-between productshowbody">
          <h6 className="card-title fw-semibold  mb-1 productshowname"> {item.name} </h6>
          <p className="card-text fw-bold  mb-0 productshowprice"> {item.price} </p>
        </div>
      </div>
    ))
   ):filtered.length > 0 ? (
    filtered.map((item)=>(
      <div key={item.id} className=" border-0 rounded-3 overflow-hidden productshowcard" >
        <div className="d-flex align-items-center justify-content-center productshowimagebox">
          <img src={item.image} alt={item.name} className=" productshowimage" />
        </div>
        <div className=" d-flex flex-column justify-content-between productshowbody">
          <h6 className="card-title fw-semibold mb-1 productshowname"> {item.name} </h6>
          <p className="card-text fw-bold  mb-0 productshowprice"> {item.price} </p>
        </div>
      </div>
    ))
   ):(
    <div className="text-center w-100 py-5">
      <h5>No Products Found</h5>
    </div>
   )}
  
  </div>

</div>
  </div>
  )
}

export default ProductsShow
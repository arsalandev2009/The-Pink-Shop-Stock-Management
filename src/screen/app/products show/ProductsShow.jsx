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
    const fetchProducts=async()=>{
      const {data,error}=await supabase.from('products').select()
      if(!error){
        setGetProducts(data)
      }
      
    }
    fetchProducts()

  

  },[])

console.log(getProducts[0]?.productcode)

  const handleSearch = (e)=>{
    const Search= e.target.value
    setSearchInput(Search)
    const result = getProducts.filter((item) => item.name.toLowerCase().includes(Search.toLowerCase()) ||
String(item.productcode).toLowerCase().includes(Search.toLowerCase()));
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
      <div key={item.id} className=" border-0 rounded-3 overflow-hidden productshowcard" style={{backgroundColor:'#FFF5F8'}}>
        <div className="d-flex align-items-center justify-content-center border-bottom position-relative productshowimagebox">
          <img src={item.image} alt={item.name} className="productshowimage" />
          <p className="position-absolute top-0 end-0 m-1 m-md-2 px-2 px-md-3 py-1 rounded-pill fw-semibold shadow-sm" style={{ backgroundColor: item.stockquantity > 0 ? "#FFF0F6" : "#FFE4EC", color: item.stockquantity > 0 ? "#D6336C" : "#C2185B", border: item.stockquantity > 0 ? "1px solid #FFB6D2" : "1px solid #FF9FBC",letterSpacing: "0.2px", fontSize: "clamp(9px, 1.5vw, 12px)", whiteSpace: "nowrap" }} > {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
        </div>
        <div className=" productshowbody" style={{backgroundColor:'#FFF5F8'}}>
          <p className="productshowcode">Code : {item.productcode} </p>
          <p className=" productshowname"> {item.name} </p>
          <p className=" productshowprice">Rs: {item.price} </p>
        </div>
      </div>
    ))
   ):filtered.length > 0? (
    filtered.map((item)=>(
      <div key={item.id} className=" border-0 rounded-3 overflow-hidden productshowcard" style={{backgroundColor:'#FFF5F8'}}>
        <div className="d-flex align-items-center justify-content-center border-bottom position-relative productshowimagebox">
          <img src={item.image} alt={item.name} className="productshowimage" />
          <p className="position-absolute top-0 end-0 m-1 m-md-2 px-2 px-md-3 py-1 rounded-pill fw-semibold shadow-sm" style={{ backgroundColor: item.stockquantity > 0 ? "#FFF0F6" : "#FFE4EC", color: item.stockquantity > 0 ? "#D6336C" : "#C2185B", border: item.stockquantity > 0 ? "1px solid #FFB6D2" : "1px solid #FF9FBC",letterSpacing: "0.2px", fontSize: "clamp(9px, 1.5vw, 12px)", whiteSpace: "nowrap" }} > {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
        </div>
        <div className=" productshowbody" style={{backgroundColor:'#FFF5F8'}}>
          <p className="productshowcode">Code : {item.productcode} </p>
          <p className=" productshowname"> {item.name} </p>
          <p className=" productshowprice">Rs: {item.price} </p>
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
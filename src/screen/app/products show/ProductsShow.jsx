import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../utils/supabase'
import { Header, SearchBar } from '../../../components/component'
import style from './ProductShow.module.css'

function ProductsShow() {

  
  const navigate=useNavigate()

  const [getProducts,setGetProducts]=useState([])

  useEffect(()=>{
    const fetchProducts=async()=>{
      const {data,error}=await supabase.from('products').select().order("productcode", { ascending: true })
      if(error){
        alert('Error Plz Contact The Developer')
        return
      }
      setGetProducts(data)
    }
    fetchProducts()

  },[])



  const [searchInput,setSearchInput]=useState('')
  const [filtered,setFiltered]=useState([])

  const handleSearch=(e)=>{
    const search = e.target.value
    setSearchInput(search)
    const result = getProducts.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) ||String(item.productcode).toLowerCase().includes(search.toLowerCase()));
    setFiltered(result)
  }

  return (
    <div className={style.container}>
      <div className={style.header}><Header HeaderButtonText='Add More Products' HeaderButtonOnClick={()=>{navigate('/login')}} /></div>
      <div className={style.searchbar}><SearchBar SearchValue={searchInput} SearchOnChange={handleSearch}/></div>
      
      <div className={style.maincontent}>
        {searchInput == ''?(
            getProducts.map((item)=>(
             <div key={item.id} className={style.productcontainer}>
               <div className={style.productupper}>
                 <img src={item.image} alt={item.name} className={style.image}/>
                 <p className={style.productstock} style={{backgroundColor:item.stockquantity>0?'#ff1493':'#9f1239'}}> {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
               </div>
               <div className={style.productlower}>
                 <p className={style.productcode}>Code: <b>{item.productcode}</b> </p>
                 <p className={style.productname}> {item.name} </p>
                 <p className={style.productprice}>Rs:<b> {item.price}</b> </p>
               </div>
             </div>
            ))):filtered.length>0?(
              filtered.map(item=>
               <div key={item.id} className={style.productcontainer}>
                 <div className={style.productupper}>
                   <img src={item.image} alt={item.name} className={style.image}/>
                   <p className={style.productstock} style={{backgroundColor:item.stockquantity>0?'#ff1493':'#9f1239'}}> {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
                 </div>
                 <div className={style.productlower}>
                   <p className={style.productcode}>Code: <b>{item.productcode}</b> </p>
                   <p className={style.productname}> {item.name} </p>
                   <p className={style.productprice}>Rs: <b>{item.price}</b> </p>
                 </div>
                </div>
              )):(
              <h5>No Products Found</h5>
              )}

        
      </div>
    </div>
    
  )
}

export default ProductsShow


    //   const handleSearch = (e)=>{
//     const Search= e.target.value
//     setSearchInput(Search)
//     const result = getProducts.filter((item) => item.name.toLowerCase().includes(Search.toLowerCase()) ||
// String(item.productcode).toLowerCase().includes(Search.toLowerCase()));
//     setFiltered(result)
//   }


//   <div>

    
//   {/* <header  className="d-flex align-items-center justify-content-between border bg-white position-fixed top-0 start-0 end-0 z-3 px-2 px-sm-4 py-1">
    
//     <img src={Logo} alt="The Pink Shop" className="headerimage img-fluid"  />

//     <button onClick={() => navigate('/login')} className="headerloginbutton  text-white px-3 py-2 rounded-2" style={{ backgroundColor: "#EA558A" }} > Add More Products </button>

//   </header> */}


//  <div className=" pt-5 productshowmain">

//   <div className=" rounded-pill mx-auto  productshowinput">
//     <FaSearch className="productshowsearchicon" />

//     <input type="text" className="form-control border-0 shadow-none p-0 productshowsearch" onChange={handleSearch} name='search' placeholder="Search..." />
//   </div>

//   <div className="productshowproducts">




//    {searchInput == '' ? (
//     getProducts.map((item)=>(
//       <div key={item.id} className=" border-0 rounded-3 overflow-hidden productshowcard" style={{backgroundColor:'#FFF5F8'}}>
//         <div className="d-flex align-items-center justify-content-center border-bottom position-relative productshowimagebox">
//           <img src={item.image} alt={item.name} className="productshowimage" />
//           <p className="position-absolute top-0 end-0 m-1 m-md-2 px-2 px-md-3 py-1 rounded-pill fw-semibold shadow-sm" style={{ backgroundColor: item.stockquantity > 0 ? "#FFF0F6" : "#FFE4EC", color: item.stockquantity > 0 ? "#D6336C" : "#C2185B", border: item.stockquantity > 0 ? "1px solid #FFB6D2" : "1px solid #FF9FBC",letterSpacing: "0.2px", fontSize: "clamp(9px, 1.5vw, 12px)", whiteSpace: "nowrap" }} > {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
//         </div>
//         <div className=" productshowbody" style={{backgroundColor:'#FFF5F8'}}>
//           <p className="productshowcode">Code : {item.productcode} </p>
//           <p className=" productshowname"> {item.name} </p>
//           <p className=" productshowprice">Rs: {item.price} </p>
//         </div>
//       </div>
//     ))
//    ):filtered.length > 0? (
//     filtered.map((item)=>(
//       <div key={item.id} className=" border-0 rounded-3 overflow-hidden productshowcard" style={{backgroundColor:'#FFF5F8'}}>
//         <div className="d-flex align-items-center justify-content-center border-bottom position-relative productshowimagebox">
//           <img src={item.image} alt={item.name} className="productshowimage" />
//           <p className="position-absolute top-0 end-0 m-1 m-md-2 px-2 px-md-3 py-1 rounded-pill fw-semibold shadow-sm" style={{ backgroundColor: item.stockquantity > 0 ? "#FFF0F6" : "#FFE4EC", color: item.stockquantity > 0 ? "#D6336C" : "#C2185B", border: item.stockquantity > 0 ? "1px solid #FFB6D2" : "1px solid #FF9FBC",letterSpacing: "0.2px", fontSize: "clamp(9px, 1.5vw, 12px)", whiteSpace: "nowrap" }} > {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
//         </div>
//         <div className=" productshowbody" style={{backgroundColor:'#FFF5F8'}}>
//           <p className="productshowcode">Code : {item.productcode} </p>
//           <p className=" productshowname"> {item.name} </p>
//           <p className=" productshowprice">Rs: {item.price} </p>
//         </div>
//       </div>
//     ))
//    ):(
//     <div className="text-center w-100 py-5">
//       <h5>No Products Found</h5>
//     </div>
//    )}
  
//   </div>

// </div>
//   </div>

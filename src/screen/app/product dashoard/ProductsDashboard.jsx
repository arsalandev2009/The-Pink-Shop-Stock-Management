import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { supabase } from '../../../utils/supabase';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import Logo from '../../../assets/logo.png'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

function ProductsDashboard() {

  const navigate = useNavigate()

  const [getProductsFromSupabase,setGetProductsFromSupabase]=useState([])
  const [addProductPopup,setAddProductPopup]=useState(false)
  const [refresh,setRefresh]=useState(false)
  const [addProductForm,setAddProductForm]=useState({image:'',name:'',price:'',stockquantity:'',productcode:""})
  const [searchInput,setSearchInput]=useState('')
  const [filteredResult,setFilteredResult]=useState([])

  useEffect(()=>{
    const getProducts =async()=>{
      const {data,error}=await supabase.from('products').select().order("id", { ascending: true });
      if(!error){
        setGetProductsFromSupabase(data)
      }
    }
    getProducts()
  },[refresh])
  


  
  const handleChangeImage = async(e) => {
    const url = await uploadToCloudinary(e.target.files[0]);
     setAddProductForm(prev => ({
        ...prev,
        image: url
      })) 
  }

  const handleChange = (e) => {
  setAddProductForm(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
  };

  const handleAddProductDone=async(e)=>{
    e.preventDefault()


    if(getProductsFromSupabase.some(item => item.productcode == addProductForm.productcode)){
      alert('Product With this Code already Exist')
      return;
    }


    const {data,error}=await supabase.from('products').insert({image:addProductForm.image,name:addProductForm.name,price:addProductForm.price,stockquantity:addProductForm.stockquantity,productcode:addProductForm.productcode})
    if(!error){   
      
      setAddProductPopup(false)
      Swal.fire({
        icon: "success",
        title: "Product Added Successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
      setAddProductForm({image:'',name:'',price:'',stockquantity:"",productcode:''})
      setRefresh(prev => !prev);
      return;
    }
    console.log(error)
   
  }



const handleSearch=(e)=>{
 const search=e.target.value
 setSearchInput(search)
const searchResult = getProductsFromSupabase.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase())||String(item.productcode).toLowerCase().includes(search.toLowerCase()))
setFilteredResult(searchResult)
}

  return(
    <div >

       <header  className="d-flex align-items-center justify-content-between border bg-white position-fixed top-0 start-0 end-0 z-3 px-2 px-sm-4 py-1">        
         <img src={Logo} alt="The Pink Shop" className="headerimage img-fluid"  onClick={()=>{navigate('/productsdashboard')}} />
         <button onClick={() =>{ sessionStorage.removeItem('loggedin'); navigate('/')}} className="headerloginbutton  text-white px-3 py-2 rounded-2" style={{ backgroundColor: "#EA558A" }} > Logout </button>
       </header>

      <div>
        
        <div className="productTopBar"> <div></div> <div className="productSearch"><FaSearch/><input type="text"  placeholder="Search products..." onChange={handleSearch} style={{height:'100%',width:'100%',border:'none',outline:'none'}}/></div> <button onClick={() => { setAddProductPopup(true); }} className="homeaddbutton rounded-2 text-white" > + Add Product </button> </div>
      
        <div className="homecontainer container-fluid py-4">
          
          <div className="homeproductschildcont d-flex gap-4 flex-wrap justify-content-start ">

            {searchInput=='' ? (

            getProductsFromSupabase.map((item) => (
              <div key={item.id} className='homeproducts'>
                
                <div className="homeproduct-card" style={{boxShadow: '0 4px 16px rgba(234, 85, 138, 0.10)',backgroundColor:'#FFF5F8'}}>
                  {/* <div className="homeimagebox">
                    <img src={item.image} alt={item.name} className="homeimage" />
                  </div>           */}
                    <div className="d-flex align-items-center justify-content-center position-relative homeimagebox">
                      <img src={item.image} alt={item.name} className="homeimage" />
                      <p className="position-absolute top-0 end-0 m-1 m-md-2 px-2 px-md-3 py-1 rounded-pill fw-semibold shadow-sm" style={{ backgroundColor: item.stockquantity > 0 ? "#FFF0F6" : "#FFE4EC", color: item.stockquantity > 0 ? "#D6336C" : "#C2185B", border: item.stockquantity > 0 ? "1px solid #FFB6D2" : "1px solid #FF9FBC",letterSpacing: "0.2px", fontSize: "clamp(9px, 1.5vw, 12px)", whiteSpace: "nowrap" }} > {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
                    </div>
                  <div className="homeproductscard-lower">
                   <div className='homeproductscard-lower1'>
                     <h6 className="homeproductscard-lower1-productcode">Code: {item.productcode} </h6>
                     <h6 className="homeproductscard-lower1-name"> {item.name} </h6>
                      <h5 className="homeproductscard-lower1-price"> Rs. {item.price} </h5>
                   </div>
               

                    <div>
                      <button className="btn btn-sm flex-grow-1" style={{margin:'0',backgroundColor:'#92003A ',color:'#ffffff'}}  onClick={() => navigate(`/productsdetail/${item.id}`)}>Details </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
            ):filteredResult.length>0?
            (filteredResult.map(item=>
             <div key={item.id} className='homeproducts'>
                
                <div className="homeproduct-card" style={{boxShadow: '0 4px 16px rgba(234, 85, 138, 0.10)',backgroundColor:'#FFF5F8'}}>
                  {/* <div className="homeimagebox">
                    <img src={item.image} alt={item.name} className="homeimage" />
                  </div>           */}
                    <div className="d-flex align-items-center justify-content-center position-relative homeimagebox">
                      <img src={item.image} alt={item.name} className="homeimage" />
                      <p className="position-absolute top-0 end-0 m-1 m-md-2 px-2 px-md-3 py-1 rounded-pill fw-semibold shadow-sm" style={{ backgroundColor: item.stockquantity > 0 ? "#FFF0F6" : "#FFE4EC", color: item.stockquantity > 0 ? "#D6336C" : "#C2185B", border: item.stockquantity > 0 ? "1px solid #FFB6D2" : "1px solid #FF9FBC",letterSpacing: "0.2px", fontSize: "clamp(9px, 1.5vw, 12px)", whiteSpace: "nowrap" }} > {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
                    </div>
                  <div className="homeproductscard-lower">
                   <div className='homeproductscard-lower1'>
                     <h6 className="homeproductscard-lower1-productcode">Code: {item.productcode} </h6>
                     <h6 className="homeproductscard-lower1-name"> {item.name} </h6>
                      <h5 className="homeproductscard-lower1-price"> Rs. {item.price} </h5>
                   </div>
               

                    <div>
                      <button className="btn btn-sm flex-grow-1" style={{margin:'0',backgroundColor:'#92003A ',color:'#ffffff'}}  onClick={() => navigate(`/productsdetail/${item.id}`)}>Details </button>
                    </div>
                  </div>
                </div>

              </div> )
            ):(<h5>No Products Found</h5>)}

          </div>

        </div>
      </div>
      


      {addProductPopup &&(
    
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>

          <form onSubmit={handleAddProductDone} className="bg-white p-4  rounded-4 shadow" style={{ width: "380px", maxWidth: "90%" }} >
            <div className='text-end' ><button style={{border:'none',background:'none'}} type='button' onClick={()=>{setAddProductPopup(false)}}><IoClose size={30}/></button></div>
            
            <label className="form-label fw-semibold">Image</label>
            <input type="file" onChange={handleChangeImage} name="image" accept="image/*" className="form-control mb-3" required/>

            <label className="form-label fw-semibold">Name</label>
            <input type="text" onChange={handleChange} value={addProductForm.name} placeholder='Enter Your Product Name' name="name" className="form-control mb-3" required/>

            <label className="form-label fw-semibold">Price</label>
            <input type="number" onChange={handleChange} value={addProductForm.price} placeholder='Enter Your Product Price' name="price" className="form-control mb-3" required/>

            <label className="form-label fw-semibold">Stock Quantity</label>
            <input type="number" onChange={handleChange} value={addProductForm.stockquantity} placeholder='Enter Your Stock Quantity' name="stockquantity" className="form-control mb-3" required/>

            <label className="form-label fw-semibold">Product Code</label>
            <input type="number" onChange={handleChange} value={addProductForm.productcode} placeholder='Enter Your Product Code' name="productcode" className="form-control mb-3" required/>

            <button type="submit" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: "#ff69b4" }} > Done </button>
          </form>

        </div>
      )}
    </div>
  )
}

export default ProductsDashboard

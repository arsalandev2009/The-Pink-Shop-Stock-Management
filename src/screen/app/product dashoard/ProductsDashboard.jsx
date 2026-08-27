import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { supabase } from '../../../utils/supabase';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import Logo from '../../../assets/logo.png'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ProductsDashboard() {

  const navigate = useNavigate()

  const [getProductsFromSupabase,setGetProductsFromSupabase]=useState([])
  const [addProductPopup,setAddProductPopup]=useState(false)
  const [refresh,setRefresh]=useState(false)
  const [addProductForm,setAddProductForm]=useState({image:'',name:'',price:'',stockquantity:''})


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

    const {data,error}=await supabase.from('products').insert({image:addProductForm.image,name:addProductForm.name,price:addProductForm.price,stockquantity:addProductForm.stockquantity})
    if(!error){   
      
      setAddProductPopup(false)
      setAddProductForm({image:'',name:'',price:'',stockquantity:""})
      setRefresh(prev => !prev);
      return;
    }
    console.log(error)
   
  }





  return(
    <div >

       <header  className="d-flex align-items-center justify-content-between border bg-white position-fixed top-0 start-0 end-0 z-3 px-2 px-sm-4 py-1">        
         <img src={Logo} alt="The Pink Shop" className="headerimage img-fluid"  />
         <button onClick={() =>{ sessionStorage.removeItem('loggedin'); navigate('/')}} className="headerloginbutton  text-white px-3 py-2 rounded-2" style={{ backgroundColor: "#EA558A" }} > Logout </button>
       </header>

      <div>
        <button onClick={()=>{setAddProductPopup(true)}} className='homeaddbutton rounded-2 px-3 py-2 text-white'> + Add Product</button>
      
        <div className="homecontainer container-fluid py-4">
          
          <div className="homeproductschildcont d-flex gap-4 flex-wrap justify-content-between ">
      
            {getProductsFromSupabase.map((item) => (
              <div key={item.id} className='homeproducts'>
                
                <div className="homeproduct-card" style={{boxShadow: '0 4px 16px rgba(234, 85, 138, 0.10)'}}>
                  <div className="homeimagebox">
                    <img src={item.image} alt={item.name} className="homeimage" />
                  </div>          
                  <div className="homeproductscard-lower">
                   <div className='homeproductscard-lower1'>
                     <h6 className="homeproductscard-lower1-name"> {item.name} </h6>
                      <h5 className="homeproductscard-lower1-price"> Rs. {item.price} </h5>
                   </div>
               

                    <div>
                      <button className="btn btn-danger btn-sm flex-grow-1"  onClick={() => navigate(`/productsdetail/${item.id}`)}>Details </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
      


      {addProductPopup &&(
    
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>

          <form onSubmit={handleAddProductDone} className="bg-white p-4  rounded-4 shadow" style={{ width: "380px", maxWidth: "90%" }} >
            <div className='text-end' ><button style={{border:'none',background:'none'}} type='button' onClick={()=>{setAddProductPopup(false)}}><IoClose size={30}/></button></div>
            
            <label className="form-label fw-semibold">Image</label>
            <input type="file" onChange={handleChangeImage} name="image" required className="form-control mb-3" />

            <label className="form-label fw-semibold">Name</label>
            <input type="text" onChange={handleChange} value={addProductForm.name} name="name" required className="form-control mb-3" />

            <label className="form-label fw-semibold">Price</label>
            <input type="number" onChange={handleChange} value={addProductForm.price} name="price" required className="form-control mb-3" />

            <label className="form-label fw-semibold">STock Quantity</label>
            <input type="number" onChange={handleChange} value={addProductForm.stockquantity} name="stockquantity" required className="form-control mb-3" />

            <button type="submit" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: "#ff69b4" }} > Done </button>
          </form>

        </div>
      )}
    </div>
  )
}

export default ProductsDashboard

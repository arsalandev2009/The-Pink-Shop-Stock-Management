import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { supabase } from '../../../utils/supabase';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import Logo from '../../../assets/logo.png'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Home() {

    

 

  const navigate = useNavigate()

  const [getProductsFromSupabase,setGetProductsFromSupabase]=useState([])
  const [addProductPopup,setAddProductPopup]=useState(false)
  const [updateProductPopup,setUpdateProductPopup]=useState(false)
  const [refresh,setRefresh]=useState(false)
  const [addProductForm,setAddProductForm]=useState({image:'',name:'',price:''})


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

    const {data,error}=await supabase.from('products').insert({image:addProductForm.image,name:addProductForm.name,price:addProductForm.price})
    if(!error){   
      
      setAddProductPopup(false)
      setAddProductForm({image:'',name:'',price:''})
      setRefresh(prev => !prev);
      return;
    }
    console.log(error)
   
  }

 const handleDeleteProductButton = async(id)=>{
   const result = await Swal.fire({
    title: "Are you sure?",
    text: "This product will be deleted!",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    confirmButtonText: "Yes, Delete",
     reverseButtons: true,
  });
  if(result.isConfirmed){

    const {data,error}=await supabase.from('products').delete().eq('id',id) ; 
    if(error){
      console.log(error)
      return
    }
    setRefresh(prev => !prev);
  }
  }

  const handleUpdateProductDone = async (e) => {
  e.preventDefault()

  const { data, error } = await supabase
    .from('products')
    .update({
      image: addProductForm.image,
      name: addProductForm.name,
      price: addProductForm.price
    })
    .eq('id', addProductForm.id)

  if (error) {
    console.log(error)
    return
  }

  setUpdateProductPopup(false)

  setAddProductForm({
    image: '',
    name: '',
    price: ''
  })

  setRefresh(prev => !prev)
}

  return(
    <div>

      <header style={{position:'fixed',top:'0',left:'0',zIndex:'999',right:'0',padding:'0px 20px',display:'flex',alignItems:'center',backgroundColor:'white',justifyContent:'space-between',boxShadow:'0px 0px 2px 0px #eb6595'}}>
      <img src={Logo} alt="" width={80}/>
      <button onClick={()=>{sessionStorage.removeItem('loggedin');navigate('/')}}  className='btn d-flex m-4 text-white fs-5' style={{backgroundColor:"#eb6595"}}>Logout</button>
      </header>

      <div  style={{marginTop:'120px'}}>
        <button onClick={()=>{setAddProductPopup(true)}} className='btn text-white d-flex m-4' style={{fontWeight:'bold',justifySelf:'end',backgroundColor:'#009414'}}> + Add Product</button>
      
      <div className="container-fluid p-4">
        <div className="row g-4">
          {getProductsFromSupabase.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="bg-light text-center p-3">
                  <img src={item.image} alt={item.name} className="img-fluid" style={{ width: "100%", height: "180px", objectFit: "contain" }} />
                </div>          
                <div className="card-body">
                  <h6 className="fw-bold mb-2"> {item.name} </h6>
                  <h5 className="fw-bold text-success mb-3"> Rs. {item.price} </h5>
                  <div className="d-flex gap-2">
                    <button onClick={()=>{setUpdateProductPopup(true);setAddProductForm(item)}}  className="btn btn-primary btn-sm flex-grow-1"> Update </button>
                  
                    <button onClick={()=>{handleDeleteProductButton(item.id)}} className="btn btn-danger btn-sm flex-grow-1">Delete </button>

                  </div>
                  
                </div>
              </div>
                  
            </div>
          ))}
        </div>
      </div>
      </div>
      
      {updateProductPopup &&(
    
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>

          <form onSubmit={handleUpdateProductDone} className="bg-white p-4  rounded-4 shadow" style={{ width: "380px", maxWidth: "90%" }} >
            <div className='text-end' ><button style={{border:'none',background:'none'}} type='button' onClick={()=>{setUpdateProductPopup(false)}}><IoClose size={30}/></button></div>
            
            <label className="form-label fw-semibold">Image</label>
            <input type="file" onChange={handleChangeImage} name="image" required className="form-control mb-3" />

            <label className="form-label fw-semibold">Name</label>
            <input type="text"   onChange={handleChange} value={addProductForm.name}  name="name" required className="form-control mb-3" />

            <label className="form-label fw-semibold">Price</label>
            <input type="number" onChange={handleChange} value={addProductForm.price}  name="price" required className="form-control mb-3" />

            <button type="submit" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: "#ff69b4" }} > Update </button>
          </form>

        </div>
      )}

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

            <button type="submit" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: "#ff69b4" }} > Done </button>
          </form>

        </div>
      )}
    </div>
  )
}

export default Home

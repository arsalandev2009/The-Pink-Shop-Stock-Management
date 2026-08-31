import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { supabase } from '../../../utils/supabase';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Header, SearchBar } from '../../../components/component';
import style from './ProductDashboard.module.css'
// import Logo from '../../../assets/logo.png'
// import { FaSearch } from 'react-icons/fa';

function ProductsDashboard() {

  const navigate = useNavigate()

  const [getProductsFromSupabase,setGetProductsFromSupabase]=useState([])
  const [addProductPopup,setAddProductPopup]=useState(false)
  const [refresh,setRefresh]=useState(false)
  const [addProductForm,setAddProductForm]=useState({image:'',name:'',price:'',stockquantity:'',productcode:"",instockdate:''})
  const [searchInput,setSearchInput]=useState('')
  const [filteredResult,setFilteredResult]=useState([])

  useEffect(()=>{
    const getProducts =async()=>{
      const {data,error}=await supabase.from('products').select().order("productcode", { ascending: true });
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

    const {data,error}=await supabase.from('products').insert({image:addProductForm.image,name:addProductForm.name,price:addProductForm.price,stockquantity:addProductForm.stockquantity,productcode:addProductForm.productcode , instockdate:addProductForm.instockdate})
    if(!error){       
      setAddProductPopup(false)
      setAddProductForm({image:'',name:'',price:'',stockquantity:"",productcode:'',instockdate:''})
      setRefresh(prev => !prev);
      return;
    }
    alert('Error! Contact the developer')
    console.log(error)
   
  }

  const handleSearch=(e)=>{
    const search=e.target.value
    setSearchInput(search)
    const searchResult = getProductsFromSupabase.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase())||String(item.productcode).toLowerCase().includes(search.toLowerCase()))
    setFilteredResult(searchResult)
  }


  const handleLogout =async()=>{
    const {data,error}=await supabase.auth.signOut()
    if(error){
      alert(error.message)
    return
    }else{
    navigate('/')
    }
  }

  return(
    <div className={style.container}>

    <div className={style.header}>
      <Header HeaderButtonText={'Logout'} HeaderButtonOnClick={handleLogout}/>
    </div>

    <div className={style.searchbar}>
      <SearchBar SearchValue={searchInput} SearchOnChange={handleSearch}/>
    </div>
    
    <div className={style.maincontent}>
      <button className={style.addproductbutton} onClick={()=>{setAddProductPopup(true)}}><span className={style.fullscreen}>+ Add Product</span><span className={style.mobilescreen}>+ Add</span></button>
        <div className={style.maincontentwrapper}>
            {searchInput == ''?(
                getProductsFromSupabase.map((item)=>(
                 <div key={item.id} className={style.productcontainer}>
                     <span className={style.edit}>Edit</span>
                   <div className={style.productupper} onClick={() => navigate(`/productsdetail/${item.id}`)}>
                     <img src={item.image} alt={item.name} className={style.image}/>
                     <p className={style.productstock} style={{backgroundColor:item.stockquantity>0?'#ff1493':'#9f1239'}}> {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
                   </div>
                   <div className={style.productlower} onClick={() => navigate(`/productsdetail/${item.id}`)}>
                     <p className={style.productcode}>Code: <b>{item.productcode}</b></p>
                     <p className={style.productname}> {item.name} </p>
                     <p className={style.productprice}> <span>Rs: <b>{item.price}</b></span>  </p>
                
                   </div>
                 </div>
                ))):filteredResult.length>0?(
                  filteredResult.map(item=>
                    <div key={item.id} className={style.productcontainer}>
                        <span className={style.edit}>Edit</span>
                      <div className={style.productupper} onClick={() => navigate(`/productsdetail/${item.id}`)}>
                        <img src={item.image} alt={item.name} className={style.image}/>
                        <p className={style.productstock} style={{backgroundColor:item.stockquantity>0?'#ff1493':'#9f1239'}}> {item.stockquantity > 0 ? `${item.stockquantity} in stock` : "Out of Stock"} </p>
                      </div>
                      <div className={style.productlower} onClick={() => navigate(`/productsdetail/${item.id}`)}>
                        <p className={style.productcode}>Code: <b>{item.productcode}</b> </p>
                        <p className={style.productname}> {item.name} </p>
                        <p className={style.productprice}> <span>Rs: <b>{item.price}</b></span>  </p>
                      </div>
                    </div>
                  )):(
                  <h5>No Products Found</h5>
                  )}
    
            
        </div>   
    </div>


      {addProductPopup &&(
    
        <div className={style.overlay}> 
          <form onSubmit={handleAddProductDone} className={style.popup}> 
            <div className={style.close}> 
              <button type="button" onClick={() => setAddProductPopup(false)} className={style.closeBtn} > <IoClose size={30} /> </button> 
            </div> 

            <label className={style.label}>Image</label> 
            <input type="file" onChange={handleChangeImage} name="image" accept="image/*" className={style.input} required /> 

            <label className={style.label}>Product Code</label> 
            <input type="number" onChange={handleChange} value={addProductForm.productcode} placeholder="Enter Your Product Code" name="productcode" className={style.input} required /> 

            <label className={style.label}>Name</label> 
            <input type="text" onChange={handleChange} value={addProductForm.name} placeholder="Enter Your Product Name" name="name" className={style.input} required /> 

            <label className={style.label}>Price</label> 
            <input type="number" onChange={handleChange} value={addProductForm.price} placeholder="Enter Your Product Price" name="price" className={style.input} required /> 

            <label className={style.label}>Stock Quantity</label> 
            <input type="number" onChange={handleChange} value={addProductForm.stockquantity} placeholder="Enter Your Stock Quantity" name="stockquantity" className={style.input} required /> 

            <label className={style.label}>In Stock Date</label> 
            <input type="date" onChange={handleChange} value={addProductForm.instockdate} name="instockdate" className={style.input} placeholder='ddd' required /> 

            <button type="submit" className={style.submitBtn}> Done </button> 
          </form> 
        </div>
      )}
    </div>
  )
}

export default ProductsDashboard

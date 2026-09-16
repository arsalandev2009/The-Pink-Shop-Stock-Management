import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { supabase } from '../../../../utils/supabase';
import { uploadToCloudinary } from '../../../../utils/cloudinary';
import { useNavigate } from 'react-router-dom';
import { Header, SearchBar } from '../../../../components/component';
import style from './AdminProducts.module.css'
import { FiLogOut } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';


function AdminProducts() {

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
    const searchResult = getProductsFromSupabase.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase())||String(item.productcode).toLowerCase().startsWith(search.toLowerCase()))
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
    <p> <span style={{color:'#71717B'}}>Admin / </span>Products</p>
    <button onClick={handleLogout} type='button'><FiLogOut/> Logout</button>
  </div>

   
    <div className={style.maincontent}>

      <div className={style.top}>

        <div className={style.toptop}>
          <div>
            <h2>Products</h2>
            <p>Keep your catalog fresh, organized, and ready to sell</p>
          </div>
          <button className={style.addproductbutton} onClick={()=>{setAddProductPopup(true)}}><span className={style.fullscreen}>+ Add Product</span><span className={style.mobilescreen}>+ Add</span></button>
        </div>

        <div>
          <div className={style.searchbar}>
            <FaSearch color='#71717B' size={20}/> 
            <input className={style.searchinput} type="text" name='search' value={searchInput} onChange={handleSearch} placeholder="Search Your Product..." /> 
          </div>
        </div>
      </div>

        <div className={style.maincontentwrapper}>
          <div className={style.maincontentwrapperupper}>
            <div className={style.maincontentwrappertop}>
              <h4> {getProductsFromSupabase.length} products</h4>
              <p> out of stock</p>
            </div>
            <div className={style.maincontentwrappermid}>
              <p>CODE</p>
              <p>PRODUCTS</p>
              <p>PRICE</p>
              <p>INVENTORY</p>
              <p>STATUS</p>
              <p>UPDATED</p>
              <p>ACTIONS</p>
            </div>
          </div>
            
          <div className={style.maincontentwrapperbottom}>

            {searchInput == ''?(
                getProductsFromSupabase.map((item)=>(

                  <div key={item.id} className={style.productcontainer}>
                    <div className={style.productcode}> {item.productcode}</div>
                    <div className={style.productname}> <img src={item.image} width={30} alt="" /> {item.name} </div>
                    <div className={style.productprice}> <span>{item.price} /-</span>  </div>
                    <div className={style.productstock}> {!isNaN(item.stockquantity)&&item.stockquantity.trim()!== ""? item.stockquantity > 0 ? `${item.stockquantity} in Stock`:'Out of Stock':item.stockquantity} </div>

                    <div>5</div>
                    <div className={style.productinstockdate}>  {new Date(item.instockdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"})} </div>
                    
                    <div>:</div>

                   
                  </div>
                //  <div key={item.id} className={style.productcontainer}>
                //      <span className={style.edit}>Edit</span>
                //    <div className={style.productupper} onClick={() => navigate(`/admin/adminproductsdetail/${item.id}`)}>
                //      <img src={item.image} alt={item.name} className={style.image}/>
                //      <p className={style.productstock} style={{backgroundColor:item.stockquantity>0?'#ff1493':'#9f1239'}}> {!isNaN(item.stockquantity)&&item.stockquantity.trim()!== ""? item.stockquantity > 0 ? `${item.stockquantity} in Stock`:'Out of Stock':item.stockquantity} </p>
                //    </div>
                //    <div className={style.productlower} onClick={() => navigate(`/admin/adminproductsdetail/${item.id}`)}>
                //      <p className={style.productcode}>Code: <b>{item.productcode}</b></p>
                //      <p className={style.productname}> {item.name} </p>
                //      <p className={style.productprice}> <span>Rs: <b>{item.price}</b></span>  </p>
                
                //    </div>
                //  </div>

                ))):filteredResult.length>0?(
                  filteredResult.map(item=>
                    <div key={item.id} className={style.productcontainer}>
                        <span className={style.edit}>Edit</span>
                      <div className={style.productupper} onClick={() => navigate(`/admin/adminproductsdetail/${item.id}`)}>
                        <img src={item.image} alt={item.name} className={style.image}/>
                        <p className={style.productstock} style={{backgroundColor:item.stockquantity>0?'#ff1493':'#9f1239'}}> {!isNaN(item.stockquantity)&&item.stockquantity.trim()!== ""? item.stockquantity > 0 ? `${item.stockquantity} in Stock`:'Out of Stock':item.stockquantity} </p>
                      </div>
                      <div className={style.productlower} onClick={() => navigate(`/admin/adminproductsdetail/${item.id}`)}>
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
    </div>


      {addProductPopup &&(
    
        <div className={style.overlay}> 
          <form onSubmit={handleAddProductDone} className={style.popup}> 
            <div className={style.close}> 
              <button type="button" onClick={() =>{ setAddProductPopup(false), setAddProductForm({image:'',name:'',price:'',stockquantity:'',productcode:"",instockdate:''})}} className={style.closeBtn} > <IoClose size={30} /> </button> 
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
            <input type="text" onChange={handleChange} value={addProductForm.stockquantity} placeholder="Enter Your Stock Quantity" name="stockquantity" className={style.input} required /> 

            <label className={style.label}>In Stock Date</label> 
            <input type="date" onChange={handleChange} value={addProductForm.instockdate} name="instockdate" className={style.input} placeholder='ddd' required /> 

            <button type="submit" className={style.submitBtn}> Done </button> 
          </form> 
        </div>
      )}
    </div>
  )
}

export default AdminProducts




// import React from 'react'

// function AdminProducts() {
//   return (
//     <div>AdminProducts</div>
//   )
// }

// export default AdminProducts
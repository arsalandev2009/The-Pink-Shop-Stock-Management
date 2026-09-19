import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { supabase } from '../../../../utils/supabase';
import { uploadToCloudinary } from '../../../../utils/cloudinary';
import { useNavigate } from 'react-router-dom';
import style from './AdminProducts.module.css'
import { FiLogOut } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';


function AdminProducts() {

  const navigate = useNavigate()

  const [menu,setMenu] =useState(null)
  const [getProductsFromSupabase,setGetProductsFromSupabase]=useState([])
  const [addProductPopup,setAddProductPopup]=useState(false)
  const [refresh,setRefresh]=useState(false)
  const [addProductForm,setAddProductForm]=useState({image:'',name:'',price:'',stockquantity:'',productcode:"",instockdate:''})
  const [updateProductPopup, setUpdateProductPopup] = useState(false);
  const [editProductData, setEditProductData] = useState({ image: "", name: "", price: "",stockquantity:'',productcode:'',instockdate:'' });
  const [deleteProductPopup, setDeleteProductPopup] = useState(false);
  const [searchInput,setSearchInput]=useState('')
  const [filteredResult,setFilteredResult]=useState([])

  setTimeout(()=>{setMenu(null)},10000)

  useEffect(()=>{
    const getProducts =async()=>{
      const {data,error}=await supabase.from('productCosmetics').select().order("productcode", { ascending: true });
      if(!error){
        setGetProductsFromSupabase(data)
      }
    }
    getProducts()
  },[refresh])
  
    const handleDeleteProductButton = async () => {   
        const { data, error } = await supabase .from("products") .delete() .eq("id", editProductData.id);
        if (!error) {
           setDeleteProductPopup(false);
          setRefresh(prev => !prev);
          setMenu(null)
          return;
        }
        console.log(error);
    };
  
    const handleUpdateProductDone = async (e) => {
      e.preventDefault();
      if(getProductsFromSupabase.some((item) => item.productcode == editProductData.productcode && item.id !=editProductData.id)){
        alert('Product With this Code already Exist')
        return;
      }
      if(addProductForm.productcode < 0){
      alert('wrong code')
      return
    }
      const { data, error } = await supabase .from("products") .update({ image: editProductData.image, name: editProductData.name, price: editProductData.price,stockquantity:editProductData.stockquantity,productcode:editProductData.productcode,instockdate:editProductData.instockdate }).eq("id", editProductData.id).select().single();
      if (error) {
        console.log(error);
        return;
      }
  
      setUpdateProductPopup(false);
      setMenu(null)
      setEditProductData({
        image: "",
        name: "",
        price: "",
        stockquantity:'',
        productcode:'',
        instockdate:''
      });
  
      setRefresh((prev) => !prev);
    };

  const handleChangeUpdateImage = async(e) => {
    const url = await uploadToCloudinary(e.target.files[0]);
     setEditProductData(prev => ({
        ...prev,
        image: url
      })) 
  }

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
    if(addProductForm.productcode < 0){
      alert('wrong code')
      return
    }
    const {data,error}=await supabase.from('productCosmetics').insert({image:addProductForm.image,name:addProductForm.name,price:addProductForm.price,stockquantity:addProductForm.stockquantity,productcode:addProductForm.productcode , instockdate:addProductForm.instockdate})
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
                <div>
                  <p> Total Products {getProductsFromSupabase.length} </p>
                </div>
                <div>
                  <select name="category" >
                    <option value="undergarments">Under Garments</option>
                    <option value="cosmetics">Beauty Products</option>
                  </select>
                </div>
            </div>
            <div className={style.maincontentwrappermid}>
              <p>CODE</p>
              <p>PRODUCTS</p>
              <p>PRICE</p>
              <p>QUANTITY</p>
              <p>RE-STOCK DATE</p>
              <p>ACTIONS</p>
            </div>
          </div>
            
          <div className={style.maincontentwrapperbottom}>

            {searchInput == ''?(
                getProductsFromSupabase.map((item)=>(
                <>
                  <div key={item.id} className={style.productcontainer}>
                    <div className={style.productcode}> {item.productcode}</div>
                    <div className={style.productname}>
                        <div className={style.imagecontainer}><img src={item.image}  alt="" /> </div>
                       {item.name} 
                    </div>
                    <div className={style.productprice}> <span>{item.price} /-</span>  </div>
                    <div className={style.productstock}> {!isNaN(item.stockquantity)&&item.stockquantity.trim()!== ""? item.stockquantity > 0 ? `${item.stockquantity} in Stock`:'Out of Stock':item.stockquantity} </div>
                    <div className={style.productinstockdate}>  {new Date(item.instockdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"})} </div>
                    <div className={style.productmenubutton}>
                      <BsThreeDotsVertical style={{cursor:'pointer'}} onClick={()=>{setMenu(menu === item.id?null : item.id)}}/>
                      {menu  === item.id && (
                        <div className={style.productmenubuttoncontent}>
                          <button style={{background:'green'}}  onClick={() => { setEditProductData(item); setUpdateProductPopup(true); setMenu(null) }} >Edit</button>
                          <button style={{background:'red'}} onClick={() => { setEditProductData(item); setDeleteProductPopup(true); setMenu(null)}}>Delete</button>
                        </div>
                      )}
                    </div>                   
                  </div>

                  <div key={item.id} className={style.productcontainermobile}>
                    <div className={style.imagecontainer}><img src={item.image}  alt="" /> </div>
                    <div className={style.mid}>
                      {/* <div className={style.productcode}>  </div> */}
                      <div className={style.productname}>{item.name} </div>
                      <div className={style.productstock}> <p>Code: {item.productcode} </p><p>Rs: {item.price} /-</p> </div>
                      {/* <div className={style.productprice}>  </div> */}
                      <div className={style.productinstockdate}> <p style={{backgroundColor:`${item.stockquantity >0 ? '#DCFCE7' : '#FEF3C6'}`,color:`${item.stockquantity>0?'#008236 ':'#BB4D00'}`}}> {!isNaN(item.stockquantity)&&item.stockquantity.trim()!== ""? item.stockquantity > 0 ? `${item.stockquantity} in Stock`:'Out of Stock':item.stockquantity} </p>   <p>{new Date(item.instockdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"})}</p> </div>
                    </div> 
                    <div className={style.productmenubutton}>
                      <BsThreeDotsVertical style={{cursor:'pointer'}} onClick={()=>{setMenu(menu === item.id?null : item.id)}}/>
                      {menu  === item.id && (
                        <div className={style.productmenubuttoncontent}>
                          <button style={{background:'green'}}  onClick={() => { setEditProductData(item); setUpdateProductPopup(true); setMenu(null) }} >Edit</button>
                          <button style={{background:'red'}} onClick={() => { setEditProductData(item); setDeleteProductPopup(true); setMenu(null)}}>Delete</button>
                        </div>
                      )}
                    </div>                   
                  </div>

                </>
                ))):filteredResult.length>0?(
                  filteredResult.map(item=>
                <>
                  <div key={item.id} className={style.productcontainer}>
                    <div className={style.productcode}> {item.productcode}</div>
                    <div className={style.productname}>
                        <div className={style.imagecontainer}><img src={item.image}  alt="" /> </div>
                       {item.name} 
                    </div>
                    <div className={style.productprice}> <span>{item.price} /-</span>  </div>
                    <div className={style.productstock}> {!isNaN(item.stockquantity)&&item.stockquantity.trim()!== ""? item.stockquantity > 0 ? `${item.stockquantity} in Stock`:'Out of Stock':item.stockquantity} </div>
                    
                    <div className={style.productinstockdate}>  {new Date(item.instockdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"})} </div>
                    <div className={style.productmenubutton}>
                      <BsThreeDotsVertical onClick={()=>{setMenu(menu === item.id?null : item.id)}}/>
                      {menu  === item.id && (
                        <div className={style.productmenubuttoncontent}>
                          <button style={{background:'green'}}  onClick={() => { setEditProductData(item); setUpdateProductPopup(true); setMenu(null)}} >Edit</button>
                          <button style={{background:'red'}} onClick={() => { setEditProductData(item); setDeleteProductPopup(true); setMenu(null)}}>Delete</button>
                        </div>
                      )}
                    </div>                   
                  </div>

                  <div key={item.id} className={style.productcontainermobile}>
                    <div className={style.imagecontainer}><img src={item.image}  alt="" /> </div>
                    <div className={style.mid}>
                      {/* <div className={style.productcode}>  </div> */}
                      <div className={style.productname}>{item.name} </div>
                      <div className={style.productstock}> <p>Code: {item.productcode} </p><p>Rs: {item.price} /-</p> </div>
                      {/* <div className={style.productprice}>  </div> */}
                      <div className={style.productinstockdate}> <p style={{backgroundColor:`${item.stockquantity >0 ? '#DCFCE7' : '#FEF3C6'}`,color:`${item.stockquantity>0?'#008236 ':'#BB4D00'}`}}> {!isNaN(item.stockquantity)&&item.stockquantity.trim()!== ""? item.stockquantity > 0 ? `${item.stockquantity} in Stock`:'Out of Stock':item.stockquantity} </p>   <p>{new Date(item.instockdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"})}</p> </div>
                    </div> 
                    <div className={style.productmenubutton}>
                      <BsThreeDotsVertical style={{cursor:'pointer'}} onClick={()=>{setMenu(menu === item.id?null : item.id)}}/>
                      {menu  === item.id && (
                        <div className={style.productmenubuttoncontent}>
                          <button style={{background:'green'}}  onClick={() => { setEditProductData(item); setUpdateProductPopup(true); setMenu(null) }} >Edit</button>
                          <button style={{background:'red'}} onClick={() => { setEditProductData(item); setDeleteProductPopup(true); setMenu(null)}}>Delete</button>
                        </div>
                      )}
                    </div>                   
                  </div>  
                </>                
                )):(
                  <h5 className={style.noproducts}>No Products Found</h5>
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

      {updateProductPopup && (
         <div className={style.updateProductOverlay}>
      
        <form onSubmit={handleUpdateProductDone} className={style.updateProductModal} >
      
          <div className={style.updateProductHeader}>
            <div className={style.updateProductTitleSection}>
              <h4 className={style.updateProductTitle}> Update Product </h4>
              <small className={style.updateProductSubtitle}> Edit product information </small>
            </div>
            <button type="button" onClick={() => setUpdateProductPopup(false)} className={style.updateProductCloseButton} > × </button>
          </div>
      
          <div className={style.updateProductField}>
            <label className={style.updateProductLabel}> Product Image </label>
            <input type="file" className={style.updateProductFileInput} onChange={handleChangeUpdateImage} />
          </div>
      
          <div className={style.updateProductField}>
            <label className={style.updateProductLabel}> Product Name </label>
            <input type="text" className={style.updateProductInput} value={editProductData.name} onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value, }) } />
          </div>
      
          <div className={style.updateProductField}>
            <label className={style.updateProductLabel}> Price </label>
            <input type="number" className={style.updateProductInput} value={editProductData.price} onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value, }) } />
          </div>
      
          <div className={style.updateProductField}>
            <label className={style.updateProductLabel}> Stock Quantity </label>
            <input type="text" className={style.updateProductInput} value={editProductData.stockquantity} onChange={(e) => setEditProductData({ ...editProductData, stockquantity: e.target.value, }) } />
          </div>
      
          <div className={style.updateProductField}>
            <label className={style.updateProductLabel}> Product Code </label>
            <input type="number" className={style.updateProductInput} value={editProductData.productcode} onChange={(e) => setEditProductData({ ...editProductData, productcode: e.target.value, }) } />
          </div>
      
          <div className={style.updateProductField}>
            <label className={style.updateProductLabel}> In Stock Date </label>
            <input type="date" className={style.updateProductInput} value={editProductData.instockdate} onChange={(e) => setEditProductData({ ...editProductData, instockdate: e.target.value, }) } />
          </div>
      
      
          {/* Buttons */}
          <div className={style.updateProductButtons}>
      
            <button
              type="button"
              onClick={() => setUpdateProductPopup(false)}
              className={style.updateProductCancelButton}
            >
              Cancel
            </button>
      
            <button
              type="submit"
              className={style.updateProductSaveButton}
            >
              Save Changes
            </button>
      
          </div>
      
        </form>
      </div>
      )}
      
      {deleteProductPopup && (
            <div className={style.overlay}>
                <div className={style.deletePopup}>
                    <h3 className={style.h3}>Are you sure?</h3>
                    <p className={style.p}> Are you sure you want to delete this item? </p>
                    <div className={style.popupButtons}>
                        <button className={style.cancelBtn} onClick={() => setDeleteProductPopup(false)} > Cancel </button>
                        <button className={style.deleteBtn} onClick={handleDeleteProductButton} > Yes, Delete </button>
                    </div>
                </div>
            </div>
      )}
    </div>
  )
}

export default AdminProducts


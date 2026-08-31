import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import Header from "../../../components/header/Header";
import style from './ProductDetailsPage.module.css'

function ProductsDetailsPage() {
  const [getProductsFromSupabase,setGetProductsFromSupabase]=useState([])
  const [updateProductPopup, setUpdateProductPopup] = useState(false);
  const [deleteProductPopup, setDeleteProductPopup] = useState(false);
  const [productData, setProductData] = useState([]);
  const [editProductData, setEditProductData] = useState({ image: "", name: "", price: "",stockquantity:'',productcode:'',instockdate:'' });
  const [refresh,setRefresh]=useState()
  const navigate = useNavigate();
  const { id } = useParams();

    useEffect(() => {
      const getProductDetail = async () => {
        const { data, error } = await supabase .from("products") .select() .eq("id", id) .single();
        if (!error) {
          setProductData(data);
          return
        }
        alert('Error! Contact the Developer')
      };
      getProductDetail();
    }, [refresh]);

    useEffect(()=>{
      const getProducts =async()=>{
        const {data,error}=await supabase.from('products').select().order("productcode", { ascending: true });
        if(!error){
          setGetProductsFromSupabase(data)
          return
        }
        alert('Error! Contact Developer')
      }
      getProducts()
    },[refresh])

  const handleDeleteProductButton = async () => {   
      const { data, error } = await supabase .from("products") .delete() .eq("id", id);
      if (!error) {
        navigate("/productsdashboard");
        return;
      }
      console.log(error);
  };

  const handleUpdateProductDone = async (e) => {
    e.preventDefault();
    if(getProductsFromSupabase.some((item) => item.productcode == editProductData.productcode && item.id !=id)){
      alert('Product With this Code already Exist')
      return;
    }
    const { data, error } = await supabase .from("products") .update({ image: editProductData.image, name: editProductData.name, price: editProductData.price,stockquantity:editProductData.stockquantity,productcode:editProductData.productcode,instockdate:editProductData.instockdate }).eq("id", id).select().single();
    if (error) {
      console.log(error);
      return;
    }

    setUpdateProductPopup(false);

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

  const handleChangeImage = async(e) => {
    const url = await uploadToCloudinary(e.target.files[0]);
     setEditProductData(prev => ({
        ...prev,
        image: url
      })) 
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
  return (

    <div className={style.container}>
      <div className={style.header}> <Header HeaderButtonText={'Logout'} HeaderButtonOnClick={handleLogout}/> </div>
      <div className={style.maincontent}>
        <div className={style.maincontentchild}>
          <div className={style.imagebox}><img className={style.image} src={productData.image} alt={productData.name} /></div>
          <div className={style.lower}>
            <div className={style.detailsHeader}> <p>PRODUCT DETAILS</p> <h2>{productData.name}</h2> </div>
            <div className={style.priceBox}> <span>Product Price</span> <h2>Rs: {productData.price}</h2> </div>
            <div className={style.detailsBox}>
              <div className={style.detailRow}> <span>Product Code</span> <b>{productData.productcode}</b> </div>
              <div className={style.detailRow}> <span>Stock Quantity</span> <b>{productData.stockquantity}</b> </div>
              <div className={style.detailRow}> <span>In Stock Date</span> <b> {new Date(productData.instockdate).toLocaleDateString("en-PK",{timeZone:"Asia/Karachi",day:"2-digit",month:"2-digit",year:"numeric"})} </b> </div>
            </div>
            <div className={style.productbuttons}> <button className={style.updateBtn} onClick={() => { setEditProductData(productData); setUpdateProductPopup(true); }} > Update </button> <button className={style.deleteBtn} onClick={() => { setDeleteProductPopup(true); }} > Delete </button> </div>
          </div>
        </div>        
      </div>

  
    
  {updateProductPopup && (
   <div className={style.updateProductOverlay}>

  <form
    onSubmit={handleUpdateProductDone}
    className={style.updateProductModal}
  >

    {/* Header */}
    <div className={style.updateProductHeader}>

      <div className={style.updateProductTitleSection}>
        <h4 className={style.updateProductTitle}>
          Update Product
        </h4>

        <small className={style.updateProductSubtitle}>
          Edit product information
        </small>
      </div>

      <button
        type="button"
        onClick={() => setUpdateProductPopup(false)}
        className={style.updateProductCloseButton}
      >
        ×
      </button>

    </div>


    {/* Product Image */}
    <div className={style.updateProductField}>

      <label className={style.updateProductLabel}>
        Product Image
      </label>

      <input
        type="file"
        className={style.updateProductFileInput}
        onChange={handleChangeImage}
      />

    </div>


    {/* Product Name */}
    <div className={style.updateProductField}>

      <label className={style.updateProductLabel}>
        Product Name
      </label>

      <input
        type="text"
        className={style.updateProductInput}
        value={editProductData.name}
        onChange={(e) =>
          setEditProductData({
            ...editProductData,
            name: e.target.value,
          })
        }
      />

    </div>


    {/* Price */}
    <div className={style.updateProductField}>

      <label className={style.updateProductLabel}>
        Price
      </label>

      <input
        type="number"
        className={style.updateProductInput}
        value={editProductData.price}
        onChange={(e) =>
          setEditProductData({
            ...editProductData,
            price: e.target.value,
          })
        }
      />

    </div>


    {/* Stock */}
    <div className={style.updateProductField}>

      <label className={style.updateProductLabel}>
        Stock Quantity
      </label>

      <input
        type="number"
        className={style.updateProductInput}
        value={editProductData.stockquantity}
        onChange={(e) =>
          setEditProductData({
            ...editProductData,
            stockquantity: e.target.value,
          })
        }
      />

    </div>


    {/* Product Code */}
    <div className={style.updateProductField}>

      <label className={style.updateProductLabel}>
        Product Code
      </label>

      <input
        type="number"
        className={style.updateProductInput}
        value={editProductData.productcode}
        onChange={(e) =>
          setEditProductData({
            ...editProductData,
            productcode: e.target.value,
          })
        }
      />

    </div>
    {/*Update Time */}
    <div className={style.updateProductField}>

      <label className={style.updateProductLabel}>
        In Stock Date
      </label>

      <input
        type="date"
        className={style.updateProductInput}
        value={editProductData.instockdate}
        onChange={(e) =>
          setEditProductData({
            ...editProductData,
            instockdate: e.target.value,
          })
        }
      />

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
  );
}
export default ProductsDetailsPage;

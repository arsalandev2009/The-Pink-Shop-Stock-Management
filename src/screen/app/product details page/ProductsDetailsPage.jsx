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
    if(getProductsFromSupabase.some(item => item.productcode == editProductData.productcode)){
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

{/* <div
  className="card border-0 shadow rounded-4 overflow-hidden"
  style={{ maxWidth: "700px", margin: "0 auto" }}
>

  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      width: "100%",
      height: "360px",
      background: "linear-gradient(135deg, #fff0f6, #ffe4ef)",
      borderBottom: "1px solid #f8d5e2",
    }}
  >
    <img
      src={productData.image}
      alt={productData.name}
      className="img-fluid"
      style={{
        maxWidth: "90%",
        maxHeight: "320px",
        objectFit: "contain",
      }}
    />
  </div>

 
  <div className="card-body p-4 p-md-5">

    
    <div className="mb-4">
      <small
        className="text-uppercase fw-semibold"
        style={{ color: "#EA558A", letterSpacing: "1px" }}
      >
        Product Details
      </small>

      <p className="fw-bold fs-3 mb-0 mt-2 text-dark">
        {productData.name}
      </p>
    </div>

    
    <div
      className="p-3 rounded-3 mb-4"
      style={{
        backgroundColor: "#fff5f8",
        border: "1px solid #f8d5e2",
      }}
    >
      <small className="text-secondary d-block mb-1">
        Product Price
      </small>

      <p
        className="fw-bold fs-3 mb-0"
        style={{ color: "#EA558A" }}
      >
        Rs: {productData.price}
      </p>
    </div>

    
    <div className="border rounded-3 overflow-hidden mb-4">

      <div className="d-flex justify-content-between align-items-center px-3 py-3" style={{ backgroundColor: "#fff8fa" }} > <span className="text-secondary fw-semibold"> Product Code  </span> <span className="fw-bold text-dark"> {productData.productcode} </span> </div>

      <div className="border-top d-flex justify-content-between align-items-center px-3 py-3"> <span className="text-secondary fw-semibold">Stock Quantity </span> <span className="fw-semibold text-dark">{productData.stockquantity}</span></div>
      
      <div className="border-top d-flex justify-content-between align-items-center px-3 py-3"> <span className="text-secondary fw-semibold"> In Stock Time </span> <span className="fw-semibold text-dark">{new Date(productData.created_at).toLocaleTimeString()}</span></div>

      <div className="border-top d-flex justify-content-between align-items-center px-3 py-3">
        <span className="text-secondary fw-semibold">
          In Stock Date
        </span>

        <span className="fw-semibold text-dark">
          {new Date(productData.created_at).toLocaleDateString()}
        </span>
      </div>

    </div>

    
    <div className="d-flex gap-3">

      <button
        onClick={() => {
          setEditProductData(productData);
          setUpdateProductPopup(true);
        }}
        className="btn flex-grow-1 py-2 fw-semibold text-white rounded-3"
        style={{
          backgroundColor: "#EA558A",
          borderColor: "#EA558A",
        }}
      >
        Update
      </button>

      <button
        onClick={handleDeleteProductButton}
        className="btn flex-grow-1 py-2 fw-semibold rounded-3"
        style={{
          backgroundColor: "#fff0f6",
          color: "#EA558A",
          borderColor: "#f3bfd1",
        }}
      >
        Delete
      </button>

    </div>

  </div>
</div> */}



  


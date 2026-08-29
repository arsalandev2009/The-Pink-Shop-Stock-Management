import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import Logo from '../../../assets/logo.png'
import { uploadToCloudinary } from "../../../utils/cloudinary";

function ProductsDetailsPage() {
  const [updateProductPopup, setUpdateProductPopup] = useState(false);
  const [productData, setProductData] = useState([]);
  const [editProductData, setEditProductData] = useState({ image: "", name: "", price: "",stockquantity:'',productcode:'' });
  const [refresh,setRefresh]=useState()
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getProductDetail = async () => {
      const { data, error } = await supabase
        .from("products")
        .select()
        .eq("id", id)
        .single();
      if (!error) {
        setProductData(data);
      }
    };
    getProductDetail();
  }, [refresh]);

  const handleDeleteProductButton = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Delete",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (!error) {
        navigate("/productsdashboard");
        return;
      }
      console.log(error);
    }
  };

  const handleUpdateProductDone = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase .from("products") .update({ image: editProductData.image, name: editProductData.name, price: editProductData.price,stockquantity:editProductData.stockquantity,productcode:editProductData.productcode }).eq("id", id).select().single();

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
      productcode:''
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

  return (

    <div>
    <header  className="d-flex align-items-center justify-content-between border bg-white position-fixed top-0 start-0 end-0 z-3 px-2 px-sm-4 py-1">        
         <img src={Logo} alt="The Pink Shop" className="headerimage img-fluid"  onClick={()=>{navigate('/productsdashboard')}} />
         <button onClick={() =>{ sessionStorage.removeItem('loggedin'); navigate('/')}} className="headerloginbutton  text-white px-3 py-2 rounded-2" style={{ backgroundColor: "#EA558A" }} > Logout </button>
       </header>


  
    <div className="productdetailscontainer container-fluid bg-light p-3">

<div
  className="card border-0 shadow rounded-4 overflow-hidden"
  style={{ maxWidth: "700px", margin: "0 auto" }}
>
  {/* Product Image */}
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

  {/* Product Details */}
  <div className="card-body p-4 p-md-5">

    {/* Product Name */}
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

    {/* Price */}
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

    {/* Product Information */}
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

    {/* Actions */}
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
</div>



  {/* Update Popup */}
  {updateProductPopup && (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
      style={{
        backgroundColor: "rgba(0,0,0,.5)",
        zIndex: 9999,
      }}
    >

      <form
        onSubmit={handleUpdateProductDone}
        className="bg-white rounded-4 shadow-lg p-4 w-100"
        style={{ maxWidth: "450px" }}
      >

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h4 className="fw-bold mb-1">
              Update Product
            </h4>

            <small className="text-secondary">
              Edit product information
            </small>
          </div>

          <button
            type="button"
            onClick={() => setUpdateProductPopup(false)}
            className="btn-close"
          ></button>

        </div>

        {/* Product Image */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Product Image
          </label>

          <input
            type="file"
            className="form-control"
            onChange={handleChangeImage}
          />
        </div>

        {/* Product Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Product Name
          </label>

          <input
            type="text"
            className="form-control"
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
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Price
          </label>

          <input
            type="number"
            className="form-control"
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
        <div className="mb-4">
          <label className="form-label fw-semibold">
            Stock Quantity
          </label>

          <input
            type="number"
            className="form-control"
            value={editProductData.stockquantity}
            onChange={(e) =>
              setEditProductData({
                ...editProductData,
                stockquantity: e.target.value,
              })
            }
          />
        </div>

        {/* Code */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
           Product Code
          </label>

          <input
            type="number"
            className="form-control"
            value={editProductData.productcode}
            onChange={(e) =>
              setEditProductData({
                ...editProductData,
                productcode: e.target.value,
              })
            }
          />
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">

          <button
            type="button"
            onClick={() => setUpdateProductPopup(false)}
            className="btn btn-light border flex-grow-1 fw-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn text-white flex-grow-1 fw-semibold"
            style={{
              backgroundColor: "#EA558A",
              borderColor: "#EA558A",
            }}
          >
            Save Changes
          </button>

        </div>

      </form>
    </div>
  )}
</div>
  </div>
  );
}
export default ProductsDetailsPage;

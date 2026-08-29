import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { uploadToCloudinary } from "../../../utils/cloudinary";

function ProductsDetailsPage() {
  const [updateProductPopup, setUpdateProductPopup] = useState(false);
  const [productData, setProductData] = useState([]);
  const [editProductData, setEditProductData] = useState({ image: "", name: "", price: "",stockquantity:'' });
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

    const { data, error } = await supabase .from("products") .update({ image: editProductData.image, name: editProductData.name, price: editProductData.price,stockquantity:editProductData.stockquantity }).eq("id", id).select().single();

    if (error) {
      console.log(error);
      return;
    }

    setUpdateProductPopup(false);

    setEditProductData({
      image: "",
      name: "",
      price: "",
      stockquantity:''
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
    <div className="container-fluid bg-light p-3">
  <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

    {/* Product Image */}
    <div className="bg-pink-light d-flex justify-content-center align-items-center p-3">
      <img
        src={productData.image}
        alt=""
        width={150}
        className="img-fluid"
        style={{ height: "170px", objectFit: "contain" }}
      />
    </div>

    {/* Product Details */}
    <div className="card-body">

      <p className="fw-bold fs-5 mb-2"> {productData.name} </p>

      <p className="fw-bold fs-4 mb-2" style={{ color: "#EA558A" }} > Rs: {productData.price} </p>

      <p className="text-secondary small mb-3"> <span className="fw-semibold">Stock Quantity:</span>{" "} {productData.stockquantity} </p>

      <p className="text-secondary small mb-3"> <span className="fw-semibold">In Stock Time: </span>{new Date(productData.created_at).toLocaleTimeString()}</p>

      <p className="text-secondary small mb-3"> <span className="fw-semibold">In Stock Date: </span>{new Date(productData.created_at).toLocaleDateString()}</p>


      <div className="d-flex gap-2">

        <button onClick={() => { setEditProductData(productData); setUpdateProductPopup(true); }} className="btn btn-sm flex-grow-1 text-white fw-semibold" style={{ backgroundColor: "#EA558A", borderColor: "#EA558A", }} > Update </button>

        <button onClick={handleDeleteProductButton} className="btn btn-sm flex-grow-1 fw-semibold" style={{ backgroundColor: "#fff0f6", color: "#EA558A", borderColor: "#f3bfd1", }} > Delete </button>

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
  );
}

export default ProductsDetailsPage;

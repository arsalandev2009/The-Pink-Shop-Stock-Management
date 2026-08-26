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
    <div>
        
        <div>
            <img src={productData.image} alt="" width={150} />
            <p>{productData.name}</p>
            <p>{productData.price}</p>
            <p>{productData.stockquantity}</p>
            <div className="d-flex gap-2">
              <button onClick={() => { setEditProductData(productData);setUpdateProductPopup(true); }} className="btn btn-primary btn-sm flex-grow-1" > {" "} Update{" "} </button>
              <button onClick={handleDeleteProductButton} className="btn btn-danger btn-sm flex-grow-1" > Delete{" "} </button>
            </div>
        </div>

        {updateProductPopup && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 9999, }} >
            <form onSubmit={handleUpdateProductDone} className="bg-white rounded-4 shadow p-4" style={{ width: "100%", maxWidth: "450px", }} >

              {/* Header */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="fw-bold mb-0">Update Product</h4>
                <button type="button" onClick={() => setUpdateProductPopup(false)} className="btn-close" ></button>
              </div>
        
                {/* Product Image */}
              <div className="mb-3">
                <label className="form-label fw-semibold"> Product Name </label>
                <input type="file" className="form-control"  onChange={handleChangeImage} />
              </div>
        
              {/* Product Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold"> Product Name </label>
                <input type="text" className="form-control" value={editProductData.name} onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value, }) } />
              </div>
        
              {/* Price */}
              <div className="mb-3">
                <label className="form-label fw-semibold"> Price </label>
                <input type="number" className="form-control" value={editProductData.price} onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value, }) } />
              </div>
        
              {/* Stock */}
              <div className="mb-4">
                <label className="form-label fw-semibold"> Stock Quantity </label>
                <input type="number" className="form-control" value={editProductData.stockquantity} onChange={(e) => setEditProductData({ ...editProductData, stockquantity: e.target.value, }) } />
              </div>
        
              {/* Buttons */}
              <div className="d-flex gap-2">
                <button type="button" onClick={() => setUpdateProductPopup(false)} className="btn btn-light border flex-grow-1" > Cancel </button>
                <button type="submit" className="btn text-white flex-grow-1" style={{ backgroundColor: "#EA558A" }} > Save Changes </button>
              </div>
        
            </form>
          </div>
        )}
    </div>
  );
}

export default ProductsDetailsPage;

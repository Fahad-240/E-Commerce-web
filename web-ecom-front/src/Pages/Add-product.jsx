import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../Context/Context';
import api from '../Component/api';
import Navbar from '../Component/Navbar';
import "./AddProduct.css";
import Footer from '../Component/Footer';
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [isSale, setIsSale] = useState(false);
  const [salePercentage, setSalePercentage] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  let { state } = useContext(GlobalContext);

  const getCategory = async () => {
    try {
      let res = await api.get("/categories");
      if (res.status === 200) {
        setCategoryList(res.data.category_list);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "presets");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/duwxwlve7/image/upload",
        formData
      );
      setImage(res.data.secure_url);
      setLoading(false);
    } catch (err) {
      console.error("Upload failed:", err);
      setLoading(false);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      let response = await api.post(`/product`, {
        name,
        description,
        price,
        image,
        category_id: category,
        is_sale: isSale,
        sale_percentage: isSale ? salePercentage : null,
        original_price: isSale ? originalPrice : null,
      });

      if (response.status === 201) {
        toast.success("✅ Product added successfully!");
        clearForm();
        setTimeout(() => {
          navigate("/shop");
        }, 1000);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(" Failed to add product!");
    }
  };

  const clearForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImage("");
    setIsSale(false);
    setSalePercentage("");
    setOriginalPrice("");
  };

  return (
    <div>
      <Navbar />
      <div className="formContainer">
        <div className="product-head">
          <h1>Add Product</h1>
        </div>

        <form className="formInner" onSubmit={addProduct}>
          <label className="full-width">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categoryList.map((eachCategory, i) => (
                <option key={i} value={eachCategory.category_id}>
                  {eachCategory.category_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Product Name
            <input
              placeholder='Premium Watch, etc.'
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Price ($)
            <input
              placeholder='0.00'
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>

          <label className="full-width">
            Image Upload
            <input type="file" onChange={handleImageUpload} />
          </label>

          {(loading || image) && (
            <div className="preview-container full-width">
              {loading ? (
                <p className="uploading">Uploading to Cloudinary...</p>
              ) : (
                image && <img src={image} alt="preview" className="preview-img" />
              )}
            </div>
          )}

          <label className="checkbox-label full-width">
            <input
              type="checkbox"
              checked={isSale}
              onChange={(e) => setIsSale(e.target.checked)}
            />
            <span>Mark as <span className="highlight" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>On Sale</span> (Visible on Home & Shop)</span>
          </label>

          {isSale && (
            <div className="sale-details-row full-width" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <label>
                Original Price ($) <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(Strikethrough price)</span>
                <input
                  type="number"
                  placeholder="e.g. 1800"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  required={isSale}
                />
              </label>
              <label>
                Sale Percentage (%) <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(e.g. 20 for 20% off badge)</span>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  value={salePercentage}
                  onChange={(e) => setSalePercentage(e.target.value)}
                  min="1"
                />
              </label>
            </div>
          )}

          <label className="full-width">
            Description
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Briefly describe the product features...'
              required
            />
          </label>

          <button type="submit" className="submit-btn">Add Product to Collection</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct;

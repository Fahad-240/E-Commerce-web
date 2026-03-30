import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router";
import api from "../Component/api";
import { GlobalContext } from "../Context/Context";
import "./ProductDetail.css"
import Navbar from '../Component/Navbar';
import Footer from "../Component/Footer";
import Reviews from "./Reviews";
import ProductCard from "../Component/ProductCard";
import { FaShoppingCart, FaStar, FaTruck, FaShieldAlt, FaPlus, FaMinus, FaRegHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { state } = useContext(GlobalContext);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`, { withCredentials: true });
        if (res.data.product) {
          const currentProduct = res.data.product;
          setProduct(currentProduct);
          setError(null);
          fetchRelated(currentProduct.category_name, currentProduct.product_id);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (category, currentId) => {
      try {
        const res = await api.get("/products", { withCredentials: true });
        const filtered = res.data.products.filter(p =>
          p.category_name === category && p.product_id !== parseInt(currentId)
        );
        setRelatedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error("Related fetch error:", err);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const addToCart = async (targetProduct, qty = 1) => {
    try {
      await api.post(
        "/cart",
        { product_id: targetProduct.product_id, quantity: qty },
        { withCredentials: true }
      );
      toast.success(`${targetProduct.product_name} added to cart!`);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart.");
    }
  };

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) return <div className="detail-loading"><div className="spinner"></div></div>;
  if (error) return <div className="detail-error"><p>{error}</p><button onClick={() => navigate("/shop")}>Back to Shop</button></div>;
  if (!product) return null;

  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="breadcrumb-container">
         <div className="container">
            <div className="breadcrumbs">
               <Link to="/home">Home</Link>
               <span className="separator">/</span>
               <Link to="/shop">Shop</Link>
               <span className="separator">/</span>
               <span className="current">{product.category_name}</span>
            </div>
         </div>
      </div>

      <div className="container detail-container">
        <div className="detail-main-card">
          <div className="detail-grid">
            {/* Left Column: Visuals */}
            <div className="detail-visuals">
              <div className="main-image-box">
                <img src={product.product_image} alt={product.product_name} />
                <button className="wishlist-float-btn"><FaRegHeart /></button>
              </div>
            </div>

            {/* Right Column: Information */}
            <div className="detail-info">
              <span className="stock-badge">In Stock</span>
              <h1 className="product-name-heading">{product.product_name}</h1>
              
              <div className="rating-summary">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.avg_rating || 0) ? "star-filled" : "star-empty"} />
                  ))}
                </div>
                <span className="rating-text">{product.avg_rating || "No reviews"}</span>
                <span className="dot">•</span>
                <span className="orders-count">154 orders</span>
              </div>

              <div className="price-block">
                <h2 className="current-price">${product.price}</h2>
                {product.is_sale && product.original_price && (
                  <span className="old-price">${product.original_price}</span>
                )}
                {product.is_sale && product.sale_percentage && (
                  <span className="detail-sale-badge">{product.sale_percentage}% OFF</span>
                )}
              </div>

              <div className="description-text">
                <p>{product.description || "No description provided for this premium item."}</p>
              </div>

              <div className="purchase-controls">
                <div className="qty-picker">
                  <button onClick={decrement}><FaMinus /></button>
                  <span>{quantity}</span>
                  <button onClick={increment}><FaPlus /></button>
                </div>
                <button onClick={() => addToCart(product, quantity)} className="buy-now-btn">Add to Cart</button>
                <button className="save-btn"><FaRegHeart /> Save</button>
              </div>

              <div className="guarantees">
                  <div className="guarantee-item"><FaTruck /> Free Worldwide Shipping</div>
                  <div className="guarantee-item"><FaShieldAlt /> 2 Year Extended Warranty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Section */}
        {relatedProducts.length > 0 && (
          <div className="related-section">
            <h2 className="section-title">Related Products</h2>
            <div className="related-grid">
              {relatedProducts.map(item => (
                <ProductCard
                   key={item.product_id}
                   product={item}
                   onAddToCart={() => addToCart(item, 1)}
                   isAdmin={state?.user?.user_role === 1}
                />
              ))}
            </div>
          </div>
        )}

        <div className="reviews-section">
           <h2 className="section-title">Customer Feedback</h2>
           <Reviews productId={id} />
        </div>
      </div>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
};

export default ProductDetail;

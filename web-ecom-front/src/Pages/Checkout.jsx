import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router";
import "./Checkout.css";
import Footer from "../Component/Footer";
import Navbar from "../Component/Navbar";
import { GlobalContext } from "../Context/Context";
import api from "../Component/api";
import { FaTruck, FaLock, FaCreditCard, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaShieldAlt } from "react-icons/fa";

const Checkout = () => {
  const { state } = useContext(GlobalContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOrdered, setIsOrdered] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    payment: "cod",
  });

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart", { withCredentials: true });
      setCart(res.data.cart || []);
    } catch (err) {
      console.error("Fetch Cart Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOrdered(true);
    // In a real app, this would send data to backend
    window.scrollTo(0, 0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (isOrdered) {
    return (
      <div className="checkout-success-page">
        <Navbar />
        <div className="container success-container">
           <div className="success-box">
              <div className="check-icon">✓</div>
              <h1>Order Placed Successfully!</h1>
              <p>Thank you for your purchase. Your order #LX-99281 is being processed.</p>
              <div className="success-footer">
                 <Link to="/shop" className="btn-primary">Continue Shopping</Link>
                 <Link to="/profile" className="btn-secondary">View My Orders</Link>
              </div>
           </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <Navbar />
      
      <div className="container checkout-main-container">
        <div className="checkout-flex-layout">
          
          {/* LEFT: Shipping & Payment */}
          <div className="checkout-form-column">
            <div className="checkout-card">
              <h2 className="card-title">Shipping Address</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="premium-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full name</label>
                    <input type="text" name="fullName" placeholder="Type here" value={formData.fullName} onChange={handleChange} required />
                  </div>
                </div>
                
                <div className="form-row double">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" placeholder="+92 333 1234567" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                   <div className="form-group">
                    <label>Street Address</label>
                    <input type="text" name="address" placeholder="House #, Street Name" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row double">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" placeholder="Karachi" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Zip code</label>
                    <input type="text" name="zip" placeholder="71000" value={formData.zip} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-divider"></div>

                <h2 className="card-title mt-20">Payment Method</h2>
                <div className="payment-grid">
                  <label className={`payment-card ${formData.payment === 'cod' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="cod" checked={formData.payment === 'cod'} onChange={handleChange} />
                    <div className="payment-info">
                       <FaTruck />
                       <span>Cash on Delivery</span>
                    </div>
                  </label>
                  <label className={`payment-card ${formData.payment === 'card' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="card" checked={formData.payment === 'card'} onChange={handleChange} />
                    <div className="payment-info">
                       <FaCreditCard />
                       <span>Credit Card</span>
                    </div>
                  </label>
                </div>
              </form>
            </div>
            
            <div className="checkout-bottom-nav">
               <Link to="/cart" className="back-link">Return to cart</Link>
               <button type="submit" form="checkout-form" className="submit-order-btn">Place Order</button>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <aside className="checkout-summary-column">
            <div className="checkout-card summary-card">
              <h3 className="summary-card-title">Items in order</h3>
              <div className="summary-items-list">
                {cart.map((item) => (
                  <div key={item.cart_id} className="mini-item">
                    <div className="mini-img"><img src={item.product_image} alt="" /></div>
                    <div className="mini-details">
                       <p className="mini-name">{item.product_name}</p>
                       <p className="mini-price">${item.price} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-breakdown">
                 <div className="breakdown-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                 </div>
                 <div className="breakdown-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                 </div>
                 <div className="breakdown-row highlight">
                    <span>Total (USD)</span>
                    <span>${total.toFixed(2)}</span>
                 </div>
              </div>

              <div className="trust-footer">
                  <div className="trust-item"><FaLock /> Secure SSL Encryption</div>
                  <div className="trust-item"><FaShieldAlt /> Buyer Protection</div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;

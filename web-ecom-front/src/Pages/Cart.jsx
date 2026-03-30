import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import api from "../Component/api";
import "./Cart.css"; // 👈 external css import
import Footer from '../Component/Footer';
import Navbar from "../Component/Navbar";
import { FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from "react-icons/fa";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const productId = location.state?.productId;

  const fetchCart = async () => {
    try {
      setLoading(true);
      let res = await api.get("/cart", { withCredentials: true });
      setCart(res.data.cart || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch cart.");
      console.error("Fetch Cart Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cart_id, product_id, newQty) => {
    if (newQty <= 0) {
      removeItem(cart_id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cart_id === cart_id ? { ...item, quantity: newQty } : item
      )
    );

    try {
      await api.put(
        `/cart/${cart_id}`,
        { quantity: newQty },
        { withCredentials: true }
      );
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  const removeItem = async (cart_id) => {
    try {
      setCart((prevCart) => prevCart.filter((item) => item.cart_id !== cart_id));
      await api.delete(`/cart/${cart_id}`, { withCredentials: true });
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error("Remove Error:", err);
    }
  };

  useEffect(() => {
    const handleCart = async () => {
      if (productId) {
        try {
          await api.post(
            "/cart",
            { product_id: productId, quantity: 1 },
            { withCredentials: true }
          );
        } catch (err) {
          setError("Failed to add product to cart.");
        }
      }
      await fetchCart();
    };
    handleCart();
  }, [productId]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page-wrapper">
      <Navbar />

      <div className="container cart-main-container">
        <h1 className="page-title">My Cart ({cart.length})</h1>

        {loading ? (
          <div className="cart-loading"><div className="spinner"></div></div>
        ) : cart.length === 0 ? (
          <div className="cart-empty-state">
            <div className="empty-icon"><FaShoppingCart /></div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="shop-now-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Items List */}
            <div className="cart-items-section">
              {cart.map((item) => (
                <div key={item.cart_id} className="cart-item-card">
                  <div className="item-thumbnail">
                    <img src={item.product_image} alt={item.product_name} />
                  </div>
                  <div className="item-details">
                    <div className="item-info-top">
                      <h3 className="item-title">{item.product_name}</h3>
                      <p className="item-category">{item.category_name || 'Others'}</p>
                    </div>
                    <div className="item-controls">
                      <div className="qty-selector">
                        <button onClick={() => updateQuantity(item.cart_id, item.product_id, item.quantity - 1)}><FaMinus /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cart_id, item.product_id, item.quantity + 1)}><FaPlus /></button>
                      </div>
                      <button onClick={() => removeItem(item.cart_id)} className="item-remove-link">Remove</button>
                    </div>
                  </div>
                  <div className="item-price-col">
                    <p className="unit-price">${item.price}</p>
                    <p className="total-price-text">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="cart-footer-actions">
                <Link to="/shop" className="back-to-shop-link"><FaArrowLeft /> Continue Shopping</Link>
                <button className="clear-cart-btn" onClick={() => { if (window.confirm('Clear all items?')) setCart([]) }}>Clear Cart</button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <aside className="cart-summary-sidebar">
              <div className="summary-card">
                <h3 className="summary-title">Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-text">Calculated at checkout</span>
                </div>
                <div className="summary-row">
                  <span>Service Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row grand-total">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className="checkout-link-btn">Checkout Now</Link>

                <div className="payment-trust-badges">
                  <p>Secure payment methods supported:</p>
                  <div className="badge-icons">
                    {/* Placeholder icons or text badges */}
                    <span>Visa</span>
                    <span>MasterCard</span>
                    <span>PayPal</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;

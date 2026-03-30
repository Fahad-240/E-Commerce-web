import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "./api";
import "./CartDrawer.css";
import { FaTimes, FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

const CartDrawer = ({ isOpen, onClose }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        if (!isOpen) return;
        try {
            setLoading(true);
            const res = await api.get("/cart", { withCredentials: true });
            setCart(res.data.cart || []);
            setError("");
        } catch (err) {
            setError("Failed to fetch cart.");
            console.error("Fetch Cart Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
        const handleUpdate = () => fetchCart();
        window.addEventListener("cartUpdated", handleUpdate);
        return () => window.removeEventListener("cartUpdated", handleUpdate);
    }, [isOpen]);

    const updateQuantity = async (cart_id, product_id, newQty) => {
        if (newQty <= 0) {
            removeItem(cart_id);
            return;
        }

        setCart((prev) =>
            prev.map((item) =>
                item.cart_id === cart_id ? { ...item, quantity: newQty } : item
            )
        );

        try {
            await api.put(`/cart/${cart_id}`, { quantity: newQty }, { withCredentials: true });
            window.dispatchEvent(new CustomEvent("cartUpdated"));
        } catch (err) {
            console.error("Update Error:", err);
        }
    };

    const removeItem = async (cart_id) => {
        try {
            setCart((prev) => prev.filter((item) => item.cart_id !== cart_id));
            await api.delete(`/cart/${cart_id}`, { withCredentials: true });
            window.dispatchEvent(new CustomEvent("cartUpdated"));
        } catch (err) {
            console.error("Remove Error:", err);
        }
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <div className={`cart-drawer-overlay ${isOpen ? "open" : ""}`} onClick={onClose}></div>
            <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
                <div className="drawer-header">
                    <h2><FaShoppingCart /> Your Cart</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes /></button>
                </div>

                <div className="drawer-content">
                    {loading && cart.length === 0 ? (
                        <div className="loader-container"><div className="loader"></div></div>
                    ) : error ? (
                        <p className="error-msg">{error}</p>
                    ) : cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <Link to="/home" onClick={onClose} className="shop-now-btn">Shop Now</Link>
                        </div>
                    ) : (
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div key={item.cart_id} className="drawer-item">
                                    <div className="item-img">
                                        <img src={item.product_image} alt={item.product_name} />
                                    </div>
                                    <div className="item-info">
                                        <h4 className="item-name">{item.product_name}</h4>
                                        <p className="item-price">${item.price}</p>
                                    </div>
                                    <div className="item-controls">
                                        <div className="qty-controls">
                                            <button onClick={() => updateQuantity(item.cart_id, item.product_id, item.quantity - 1)}><FaMinus size={10} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cart_id, item.product_id, item.quantity + 1)}><FaPlus size={10} /></button>
                                        </div>
                                        <button className="delete-btn" onClick={() => removeItem(item.cart_id)}><FaTrash size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="drawer-footer">
                        <div className="total-sec">
                            <span>Total:</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="checkout-btn" onClick={onClose}>
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;

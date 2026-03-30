import React from "react";
import { Link } from "react-router";
import { FaStar, FaRegStar, FaShoppingCart, FaTrash, FaRegHeart } from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({ product, onDelete, onAddToCart, isAdmin }) => {
    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`star-icon ${star <= (rating || 0) ? 'star-filled' : 'star-empty'}`}>
                {star <= (rating || 0) ? <FaStar /> : <FaRegStar />}
            </span>
        ));
    };

    return (
        <div className="product-card">
            {isAdmin && (
                <button className="delete-btn" title="Delete Product" onClick={() => onDelete(product.product_id)}>
                    <FaTrash />
                </button>
            )}

            <div className="card-image-wrapper">
                <Link to={`/product/${product.product_id}`} className="card-image">
                    <img src={product.product_image} alt={product.product_name} />
                    {product.is_sale && (
                        <span className="sale-badge">
                            {product.sale_percentage ? `${product.sale_percentage}% OFF` : "SALE"}
                        </span>
                    )}
                </Link>
                {/* <button className="heart-btn" title="Add to Wishlist">
                    <FaRegHeart />
                </button> */}
            </div>

            <div className="card-details">
                <div className="price-row">
                    <span className="current-price">${product.price}</span>
                    {product.is_sale && product.original_price && (
                        <span className="old-price">${product.original_price}</span>
                    )}
                </div>
                
                <div className="rating-row">
                    <div className="stars">
                      {renderStars(product.avg_rating)}
                    </div>
                    <span className="rating-score">{product.avg_rating || 0}</span>
                </div>

                <Link to={`/product/${product.product_id}`}>
                  <h4 className="product-title" title={product.product_name}>{product.product_name}</h4>
                </Link>
                
                <button className="add-cart-simple" onClick={() => onAddToCart(product)}>
                   Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;

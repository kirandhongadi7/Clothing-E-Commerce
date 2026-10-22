import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

    const displayImage =
    (product.images && product.images[0]) ||
    product.image ||
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80";


   const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  return (
    <div>
      <div className="product-card h-100">
        <div
          className="product-img-wrap"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/products/${product._id}`)}
        >
            <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
        />

        {/* wishlist */}
         <button
          type="button">
          <i className= "fs-5">Add to Wishlist</i>
        </button>
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span
            className="badge bg-danger position-absolute"
            style={{ top: "12px", left: "12px", fontWeight: "600", fontSize: "0.75rem" }}
          >
            {discountPercent}% OFF
          </span>
        )}
        </div>
        <div className="p-3 d-flex flex-column flex-grow-1">
        {/* Category & Rating */}
        <div className="d-flex align-items-center justify-content-between mb-1">
          <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
            {product.category}
          </small>
          <div className="d-flex align-items-center bg-light px-2 py-0.5 rounded" style={{ fontSize: "0.8rem" }}>
            <i className="bi bi-star-fill star-rating me-1"></i>
            <span className="fw-bold">{product.rating || "4.5"}</span>
          </div>
        </div>

        {/* Product Title */}
        <h6
          className="product-title mb-2 fw-semibold text-truncate"
          style={{ cursor: "pointer", color: "#222" }}
          onClick={() => navigate(`/products/${product._id}`)}
          title={product.name}
        >
          {product.name}
        </h6>

        {/* Price Section */}
        <div className="d-flex align-items-baseline gap-2 mb-3 mt-auto">
          <span className="fs-5 fw-bold text-royal">
            ₹{(product.discountPrice || product.price).toLocaleString()}
          </span>
          {product.discountPrice && (
            <span className="text-decoration-line-through text-muted small">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-royal flex-grow-1 d-flex align-items-center justify-content-center py-2"
          >
            <i className="bi bi-cart-plus me-1.5"></i>
            <span>Add to Cart</span>
          </button>
          
          <button
            type="button"
            
          >
            <i>Add to Wishlist</i>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductCard;

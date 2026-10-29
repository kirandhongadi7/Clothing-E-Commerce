import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";


export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const inCart = isInCart(product._id);

  const displayImage =
    (product.images && product.images[0]) ||
    product.image ||
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80";

  const handleWishlistToggle = (e) => {
    e.stopPropagation(); // Don't trigger card navigation
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-card h-100">
      {/* Product Image & Wishlist Button */}
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

        {/* Wishlist toggle button */}
        <button
          type="button"
          className={`wishlist-btn-overlay ${isWishlisted ? "active text-danger" : "text-muted"}`}
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
        >
          <i className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"} fs-5`}></i>
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

      {/* Product Body */}
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
            onClick={handleAddToCart}
          >
            <i className="bi bi-cart-plus me-1.5"></i>
            <span>{inCart ? "Add More" : "Add to Cart"}</span>
          </button>
          
          <button
            type="button"
            className={`btn btn-outline-secondary d-flex align-items-center justify-content-center px-3 ${
              isWishlisted ? "text-danger border-danger" : ""
            }`}
            onClick={handleWishlistToggle}
            title={isWishlisted ? "Wishlisted" : "Add to Wishlist"}
          >
            <i className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

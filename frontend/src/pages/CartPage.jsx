import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * CartPage Component:
 * - Lists cart items with quantity adjuster (+ / -), remove button, and move to wishlist button
 * - Price Details summary card with breakdown and "Proceed to Checkout" button
 */
export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartSummary,
    isLoading,
    updateQuantity,
    removeFromCart,
    moveToWishlist,
  } = useCart();

  if (isLoading) {
    return (
      <div className="container py-5">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
        <Navbar />
           <div className="container py-4">
      {/* Title Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="font-serif fw-bold text-royal mb-1">Shopping Cart</h2>
          <p className="text-muted small mb-0">
            {cartCount} item{cartCount !== 1 ? "s" : ""} selected for checkout
          </p>
        </div>
        {cartItems.length > 0 && (
          <Link to="/products" className="btn btn-outline-royal btn-sm">
            Add More Items
          </Link>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-light p-5 shadow-sm">
          <div className="rounded-circle bg-light d-inline-flex p-4 text-royal mb-3">
            <i className="bi bi-bag-x display-4"></i>
          </div>
          <h4 className="fw-bold text-royal mb-2">Your Cart is Currently Empty</h4>
          <p className="text-muted mb-4" style={{ maxWidth: "420px", margin: "0 auto" }}>
            Add your favorite festive outfits and traditional attire to your cart to enjoy free express delivery.
          </p>
          <Link to="/products" className="btn btn-royal px-4 py-2.5 fw-semibold">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => {
                const product = item.product || {};
                const displayImage =
                  (product.images && product.images[0]) ||
                  product.image ||
                  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80";

                return (
                  <div
                    key={item._id || product._id}
                    className="p-3 bg-white rounded-4 border border-light shadow-sm d-flex flex-column flex-sm-row gap-3 align-items-sm-center"
                  >
                    {/* Thumbnail */}
                    <div
                      className="rounded-3 overflow-hidden flex-shrink-0"
                      style={{ width: "110px", height: "130px", backgroundColor: "#f9f8f6" }}
                    >
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>

                    {/* Information */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>
                            {product.category}
                          </small>
                          <h6
                            className="fw-bold mb-1 text-dark"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/products/${product._id}`)}
                          >
                            {product.name}
                          </h6>
                          <div className="d-flex gap-2 text-muted small mb-2">
                            <span>Size: <strong>{item.size || "M"}</strong></span>
                            <span>•</span>
                            <span>Color: <strong>{item.color || "Standard"}</strong></span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-end">
                          <h6 className="fw-bold text-royal mb-0">
                            ₹{((product.discountPrice || product.price || 0) * (item.quantity || 1)).toLocaleString()}
                          </h6>
                          {product.discountPrice && (
                            <small className="text-decoration-line-through text-muted">
                              ₹{(product.price * (item.quantity || 1)).toLocaleString()}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls & Actions */}
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3 pt-2 border-top">
                        {/* Quantity Counter */}
                        <div className="d-flex align-items-center border rounded-pill px-2 py-0.5 bg-light">
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark p-0"
                            style={{ width: "24px" }}
                            onClick={() => updateQuantity(product._id, "decrement")}
                            title="Decrease quantity"
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="px-2 fw-bold small">{item.quantity}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark p-0"
                            style={{ width: "24px" }}
                            onClick={() => updateQuantity(product._id, "increment")}
                            title="Increase quantity"
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>

                        {/* Action buttons */}
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                            onClick={() => moveToWishlist(item)}
                          >
                            <i className="bi bi-heart"></i>
                            <span>Move to Wishlist</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            onClick={() => removeFromCart(product._id)}
                          >
                            <i className="bi bi-trash3"></i>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          
          <div className="col-lg-4">
            <div className="price-summary-card sticky-top" style={{ top: "85px" }}>
              <h5 className="font-serif fw-bold text-royal pb-3 border-bottom mb-3">
                Price Details ({cartSummary.totalItems} Items)
              </h5>

              <div className="d-flex justify-content-between mb-2.5 small">
                <span className="text-muted">Total MRP:</span>
                <span>₹{cartSummary.originalTotal.toLocaleString()}</span>
              </div>

              {cartSummary.totalDiscount > 0 && (
                <div className="d-flex justify-content-between mb-2.5 small text-success">
                  <span>Discount on MRP:</span>
                  <span>- ₹{cartSummary.totalDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2.5 small">
                <span className="text-muted">Delivery Charges:</span>
                <span className="text-success fw-bold">FREE</span>
              </div>

              <hr className="my-3 text-muted" />

              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold fs-6">Total Amount:</span>
                <span className="fw-bold fs-5 text-royal">
                  ₹{cartSummary.finalTotal.toLocaleString()}
                </span>
              </div>

              {cartSummary.totalDiscount > 0 && (
                <div className="alert alert-success py-2 small mb-4">
                  <i className="bi bi-tags-fill me-1"></i> You will save ₹{cartSummary.totalDiscount.toLocaleString()} on this order!
                </div>
              )}

              {/* Checkout Button */}
              <button
                type="button"
                className="btn btn-royal w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate("/checkout")}
              >
                <span>Proceed to Checkout</span>
                <i className="bi bi-arrow-right"></i>
              </button>

              <div className="text-center mt-3 text-muted small">
                <i className="bi bi-shield-check text-success me-1"></i>
                Safe and Secure Payments Guaranteed
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
 
        <Footer />
    </div>
  );
}

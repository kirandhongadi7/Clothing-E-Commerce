import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, isLoading } = useWishlist();
  const { moveWishlistToCart } = useCart();

  const handleMoveToCart = async (product) => {
    await moveWishlistToCart(product);
  };

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
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="font-serif fw-bold text-royal mb-1">My Royal Wishlist</h2>
          <p className="text-muted small mb-0">
            {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved for your upcoming celebrations
          </p>
        </div>
        {wishlist.length > 0 && (
          <Link to="/products" className="btn btn-outline-royal btn-sm">
            Continue Shopping
          </Link>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-light p-5 shadow-sm">
          <div className="rounded-circle bg-light d-inline-flex p-4 text-royal mb-3">
            <i className="bi bi-heart display-4"></i>
          </div>
          <h4 className="fw-bold text-royal mb-2">Your Wishlist is Empty</h4>
          <p className="text-muted mb-4" style={{ maxWidth: "420px", margin: "0 auto" }}>
            Explore our handcrafted collections of Lehengas, Half-Sarees, and Anarkalis to save your favorite styles.
          </p>
          <Link to="/products" className="btn btn-royal px-4 py-2.5 fw-semibold">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlist.map((item) => {
            const product = item.product || item;
            if (!product || !product._id) return null;

            const displayImage =
              (product.images && product.images[0]) ||
              product.image ||
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80";

            return (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="product-card h-100">
                  {/* Image Wrap */}
                  <div
                    className="product-img-wrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <img src={displayImage} alt={product.name} />
                    
                    {/* Remove Icon */}
                    <button
                      type="button"
                      className="wishlist-btn-overlay text-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(product._id);
                      }}
                      title="Remove from Wishlist"
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-3 d-flex flex-column flex-grow-1">
                    <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>
                      {product.category}
                    </small>

                    <h6
                      className="product-title mb-2 fw-semibold text-truncate"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      {product.name}
                    </h6>

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

                    {/* Action buttons */}
                    <div className="d-flex flex-column gap-2">
                      <button
                        type="button"
                        className="btn btn-royal w-100 d-flex align-items-center justify-content-center py-2"
                        onClick={() => handleMoveToCart(product)}
                      >
                        <i className="bi bi-bag-plus me-2"></i>
                        <span>Move to Cart</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={() => removeFromWishlist(product._id)}
                      >
                        <i className="bi bi-trash3 me-1"></i> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    <Footer />
    </div>
  );
}

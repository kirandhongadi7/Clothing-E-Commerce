import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { useProducts } from "../context/ProductContext";

/**
 * Navbar Component:
 * - Brand logo & category links
 * - Integrated Search input (filters product list)
 * - Wishlist badge & Cart badge
 * - User Profile / Authentication navigation
 */
export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { searchTerm, setSearchTerm } = useProducts();
  const [navCollapsed, setNavCollapsed] = useState(true);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand brand-title d-flex align-items-center" to="/">
          <i className="bi bi-gem text-gold me-2 fs-4"></i>
          <span>Aura <span className="text-gold font-serif">Ethnic</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setNavCollapsed(!navCollapsed)}
          aria-controls="navbarContent"
          aria-expanded={!navCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className={`collapse navbar-collapse ${navCollapsed ? "" : "show"}`} id="navbarContent">
          {/* Main Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/" onClick={() => setNavCollapsed(true)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/products" onClick={() => setNavCollapsed(true)}>
                All Products
              </Link>
            </li>
          </ul>

          {/* Search Bar in Header Navbar */}
          <form className="d-flex mx-lg-3 my-2 my-lg-0 flex-grow-1" style={{ maxWidth: "420px" }} onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0 ps-0 shadow-none"
                type="search"
                placeholder="Search lehengas, sarees, suits..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // If not currently on products page, redirect to products page
                  if (window.location.pathname !== "/products") {
                    navigate("/products");
                  }
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-white border border-start-0 text-muted"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </form>

          {/* Action Icons (Wishlist, Cart, Profile) */}
          <div className="d-flex align-items-center gap-3 ms-lg-auto mt-2 mt-lg-0">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="position-relative text-dark text-decoration-none p-2 d-flex align-items-center justify-content-center"
              title="Wishlist"
              onClick={() => setNavCollapsed(true)}
            >
              <i className="bi bi-heart fs-4 text-royal"></i>
              {wishlistCount > 0 && (
                <span className="position-absolute badge rounded-pill bg-royal navbar-count-badge">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="position-relative text-dark text-decoration-none p-2 d-flex align-items-center justify-content-center"
              title="Cart"
              onClick={() => setNavCollapsed(true)}
            >
              <i className="bi bi-bag fs-4 text-royal"></i>
              {cartCount > 0 && (
                <span className="position-absolute badge rounded-pill bg-danger navbar-count-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 py-1.5 px-3 rounded-pill"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => navigate("/profile")}
                >
                  <i className="bi bi-person-circle fs-5 text-royal"></i>
                  <span className="fw-semibold small">{user?.name?.split(" ")[0] || "Profile"}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-royal py-1.5 px-3 rounded-pill fw-semibold"
                onClick={() => setNavCollapsed(true)}
              >
                <i className="bi bi-person me-1"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

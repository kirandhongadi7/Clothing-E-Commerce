import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * HomePage Component:
 * - Grand Hero banner with call-to-action
 * - Featured Categories: Clicking a category redirects to /products with that category filter applied
 * - Featured Products showcase
 */
export default function HomePage() {
  const navigate = useNavigate();
  const { categories, products, isLoading, } = useProducts();

  const handleCategoryClick = () => {
    navigate("/products");
  };

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div>
    <Navbar />
     <div className="homepage-wrapper">
      {/* 1. Hero Banner */}
      <section className="container py-4">
        <div className="hero-banner p-4 p-md-5 d-flex align-items-center">
          <div className="row align-items-center w-100 g-4">
            <div className="col-lg-7">
              <span className="badge bg-gold-subtle text-gold mb-3 px-3 py-2 rounded-pill fw-bold" style={{ letterSpacing: "1px" }}>
                ROYAL FESTIVE COUTURE 2026
              </span>
              <h1 className="display-4 fw-bold font-serif mb-3 text-white">
                Drape Yourself in <br />
                <span className="text-gold">Timeless Royalty</span>
              </h1>
              <p className="lead text-white-50 mb-4" style={{ maxWidth: "520px" }}>
                Authentic hand-embroidered Lehengas, Kanchipuram silk Half-Sarees, and regal Anarkali suits crafted with centuries-old Indian artisan heritage.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/products" className="btn btn-gold px-4 py-2.5 fs-6 fw-bold">
                  Explore Full Collection <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("Lehenga Choli")}
                  className="btn btn-outline-light px-4 py-2.5 fs-6 fw-semibold"
                >
                  Bridal Lehengas
                </button>
              </div>
            </div>
            <div className="col-lg-5 text-center d-none d-lg-block">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80"
                alt="Royal Couture Banner"
                className="img-fluid rounded-4 shadow-lg border border-warning border-opacity-25"
                style={{ maxHeight: "380px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="container py-5">
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
          <div>
            <span className="text-gold text-uppercase fw-bold small" style={{ letterSpacing: "1px" }}>
              Explore By Style
            </span>
            <h2 className="font-serif fw-bold text-royal mb-1">Featured Categories</h2>
            <p className="text-muted mb-0 small">
              Click any category to browse our specially curated traditional ensembles
            </p>
          </div>
          <Link to="/products" className="text-royal fw-semibold text-decoration-none mt-2 mt-md-0 small">
            View All Categories <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        {isLoading ? (
         <p>Loading...</p>
        ) : (
          <div className="row g-4">
            {categories.map((cat) => (
              <div
                key={cat._id || cat.name}
                className="col-6 col-md-4 col-lg-4"
                onClick={() => handleCategoryClick()}
              >
                <div className="category-card">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-card-overlay">
                    <span className="badge bg-gold-subtle text-gold mb-1 align-self-start fw-bold" style={{ fontSize: "0.7rem" }}>
                      {cat.tagline || "Handcrafted"}
                    </span>
                    <h5 className="font-serif fw-bold mb-1">{cat.name}</h5>
                    <p className="small mb-0 text-white-50 text-truncate d-none d-sm-block">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="container py-4">
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
          <div>
            <span className="text-gold text-uppercase fw-bold small" style={{ letterSpacing: "1px" }}>
              Handpicked Essentials
            </span>
            <h2 className="font-serif fw-bold text-royal mb-1">Royal Trending Highlights</h2>
            <p className="text-muted mb-0 small">
              Our most celebrated masterpieces chosen for weddings and festive grandeur
            </p>
          </div>
          <Link to="/products" className="btn btn-outline-royal btn-sm px-3 mt-2 mt-md-0">
            See All Products ({products.length})
          </Link>
        </div>

        {isLoading ? (
        <p>Loading...</p>
        ) : (
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container py-5">
        <div className="p-4 p-md-5 rounded-4 bg-white border border-light shadow-sm">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="text-gold text-uppercase fw-bold small">Direct From Master Weavers</span>
              <h2 className="font-serif fw-bold text-royal mt-2 mb-3">
                Centuries of Tradition in Every Single Thread
              </h2>
              <p className="text-muted">
                Each Aura Ethnic ensemble is born in historic artisan clusters across Varanasi, Kanchipuram, and Chanderi. We eliminate middlemen to deliver pure silks, real zari embroidery, and authentic handwork directly to your doorstep.
              </p>
              <div className="d-flex gap-4 mt-4">
                <div>
                  <h4 className="fw-bold text-royal mb-0">100%</h4>
                  <small className="text-muted">Silk Mark Certified</small>
                </div>
                <div className="border-start ps-4">
                  <h4 className="fw-bold text-royal mb-0">500+</h4>
                  <small className="text-muted">Master Artisans</small>
                </div>
                <div className="border-start ps-4">
                  <h4 className="fw-bold text-royal mb-0">4.8★</h4>
                  <small className="text-muted">Customer Rating</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80"
                alt="Artisan Craftsmanship"
                className="img-fluid rounded-4 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
           
    <Footer />
    </div>
  );
}

import { useProducts } from "../context/ProductContext"
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
const ProductListingPage = () => {
    const {
    categories,
    filteredProducts,
    isLoading,
    error,
    selectedCategories,
    setSelectedCategories,
    toggleCategory,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    searchTerm,
    clearFilters,
  } = useProducts();
    //for mobile responsive
  const [showMobileFilters, setShowMobileFilters] = useState(false);

    
  return (
   <div>
    <Navbar />
    <div className="container py-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="font-serif fw-bold text-royal mb-1">Traditional Ethnic Collection</h2>
          <p className="text-muted small mb-0">
            Showing <span className="fw-bold text-dark">{filteredProducts.length}</span> handcrafted products
            {searchTerm && <span> matching "<strong>{searchTerm}</strong>"</span>}
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="d-md-none mt-3">
          <button
            className="btn btn-outline-royal w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <i className="bi bi-funnel"></i>
            <span>{showMobileFilters ? "Hide Filters" : "Filter & Sort"}</span>
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* ================= FILTER SIDEBAR ================= */}
        <div className={`col-lg-3 col-md-4 ${showMobileFilters ? "d-block" : "d-none d-md-block"}`}>
          <div className="filters-sidebar sticky-top" style={{ top: "85px" }}>
            {/* Header & Clear Filters Button */}
            <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-royal">
                <i className="bi bi-sliders"></i> Filters
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-link text-decoration-none text-royal fw-semibold p-0"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>

            {/* 1. Sort by Price (Radio buttons) */}
            <div className="mb-4">
              <label className="fw-bold small text-uppercase text-muted mb-2.5 d-block" style={{ letterSpacing: "0.5px" }}>
                Sort by Price
              </label>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="priceSort"
                  id="sortLowToHigh"
                  value="low_to_high"
                  checked={sortBy === "low_to_high"}
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <label className="form-check-label small" htmlFor="sortLowToHigh">
                  Price: Low to High
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="priceSort"
                  id="sortHighToLow"
                  value="high_to_low"
                  checked={sortBy === "high_to_low"}
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <label className="form-check-label small" htmlFor="sortHighToLow">
                  Price: High to Low
                </label>
              </div>
            </div>

            <hr className="my-3 text-muted" />

            {/* 2. Category Checkboxes */}
            <div className="mb-4">
              <label className="fw-bold small text-uppercase text-muted mb-2.5 d-block" style={{ letterSpacing: "0.5px" }}>
                Category
              </label>
              <div className="d-flex flex-column gap-2">
                {categories.map((cat) => (
                  <div className="form-check" key={cat._id || cat.name}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`cat-${cat.name}`}
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                    />
                    <label className="form-check-label small text-dark" htmlFor={`cat-${cat.name}`}>
                      {cat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-3 text-muted" />

            {/* 3. Ratings Slider */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="fw-bold small text-uppercase text-muted mb-0" style={{ letterSpacing: "0.5px" }}>
                  Rating
                </label>
                <span className="badge bg-gold-subtle text-gold fw-bold px-2 py-1">
                  ★ {minRating}.0 & above
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="1"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
              />
              <div className="d-flex justify-content-between text-muted" style={{ fontSize: "0.75rem" }}>
                <span>1★</span>
                <span>2★</span>
                <span>3★</span>
                <span>4★</span>
                <span>5★</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PRODUCTS GRID ================= */}
        <div className="col-lg-9 col-md-8">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="alert alert-danger py-4 text-center">
              <h5>Unable to load products</h5>
              <p className="mb-0">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border border-light p-5 shadow-sm">
              <i className="bi bi-search display-3 text-muted mb-3 d-block"></i>
              <h4 className="fw-bold text-royal">No products match your criteria</h4>
              <p className="text-muted mb-4">
                Try loosening your filters, adjusting the rating slider, or clearing active filters.
              </p>
              <button className="btn btn-royal px-4" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="col-12 col-sm-6 col-lg-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
   </div>
  )
}

export default ProductListingPage
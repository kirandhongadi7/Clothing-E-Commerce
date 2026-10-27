import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    useEffect(() =>{
      const loadProduct = async() =>{
        setLoading(true)
        setError(null)
        try{
         const prodRes = await fetchProductById(productId)

         if(prodRes.success && prodRes.data.product){
            const prod= prodRes.data.product
            setProduct(prod)
            if(prod.sizes && prod.sizes.length >0){
                setSelectedSize(prod.sizes[0]);
            }
            if (prod.colors && prod.colors.length > 0) {
            setSelectedColor(prod.colors[0]);
          }
         }else{
            setError("Product not found")
         }
        }catch(e){
             console.error("Error fetching product details:", e);
             setError(e.message || "Unable to load product");
        }finally{
             setLoading(false)
        }
      }
       loadProduct()
    },[productId])

  const wishlisted = product ? isInWishlist(product._id) : false;

  const handleWishlistClick = () => {
    if (wishlisted) {
       removeFromWishlist(product._id);
    } else {
       addToWishlist(product);
    }
  };

    if (loading) {
    return (
      <div className="container py-5">
       <p>Loading...</p>
      </div>
    );
  }

    if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning py-4">
          <h4>Product Not Available</h4>
          <p className="mb-3">{error || "Could not find the requested product."}</p>
          <Link to="/products" className="btn btn-royal">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

    const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  return (
    <div>
      <Navbar/>
     <div className="container py-4">
        <div className="row g-5">

            <div className="col-lg-6">
          <div className="d-flex flex-column gap-3">
            {/* Main Featured Photo */}
            <div
              className="rounded-4 overflow-hidden shadow-sm border border-light position-relative"
              style={{ height: "480px", backgroundColor: "#f6f3ee" }}
            >
              <img
                src={product.images}
                alt={product.name}
                className="w-100 h-100 object-fit-cover"
              />
              {discountPercent > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2 fw-bold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            
          </div>
        </div>

        <div className="col-lg-6">
          <span className="badge bg-gold-subtle text-gold text-uppercase fw-bold mb-2 px-3 py-1.5 rounded-pill">
            {product.category}
          </span>

          <h2 className="font-serif fw-bold text-royal mb-2">{product.name}</h2>

          {/* Rating & Review Counter */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="bg-light px-2.5 py-1 rounded d-flex align-items-center">
              <i className="bi bi-star-fill star-rating me-1.5"></i>
              <span className="fw-bold">{product.rating || "4.5"}</span>
            </div>
            <span className="text-muted small">
              ({product.ratingCount || 85} Verified Buyer Ratings)
            </span>
          </div>

          {/* Price Section */}
          <div className="d-flex align-items-baseline gap-3 mb-4 pb-3 border-bottom">
            <span className="display-6 fw-bold text-royal">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <>
                <span className="fs-5 text-decoration-line-through text-muted">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="badge bg-danger-subtle text-danger fw-bold">
                  Save ₹{(product.price - product.discountPrice).toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-muted mb-4">{product.description}</p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <label className="fw-bold small text-uppercase text-muted d-block mb-2">
                Select Size: <span className="text-dark fw-bold">{selectedSize}</span>
              </label>
              <div className="d-flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`btn btn-sm px-3 py-2 fw-semibold ${
                      selectedSize === size
                        ? "btn-royal"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <label className="fw-bold small text-uppercase text-muted d-block mb-2">
                Available Colors: <span className="text-dark fw-bold">{selectedColor}</span>
              </label>
              <div className="d-flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`btn btn-sm px-3 py-1.5 rounded-pill ${
                      selectedColor === color
                        ? "btn-dark"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Specifications Grid */}
          <div className="bg-light p-3 rounded-3 mb-4">
            <div className="row g-2 small">
              <div className="col-6">
                <span className="text-muted">Fabric:</span>{" "}
                <span className="fw-semibold text-dark">{product.fabric || "Pure Silk Blend"}</span>
              </div>
              <div className="col-6">
                <span className="text-muted">Work / Embroidery:</span>{" "}
                <span className="fw-semibold text-dark">{product.work || "Handcrafted Zari"}</span>
              </div>
              <div className="col-6">
                <span className="text-muted">Stock Status:</span>{" "}
                <span className="fw-semibold text-success">
                  <i className="bi bi-check-circle-fill me-1"></i>In Stock ({product.stock} left)
                </span>
              </div>
              <div className="col-6">
                <span className="text-muted">Dispatch:</span>{" "}
                <span className="fw-semibold text-dark">Within 24-48 Hours</span>
              </div>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            <button
              type="button"
              className="btn btn-royal flex-grow-1 py-3 px-4 fs-6 fw-bold d-flex align-items-center justify-content-center gap-2"
              onClick={() =>
                addToCart(
                  product,
                  1,
                  selectedSize,
                  selectedColor || "Standard",
                )
              }
            >
              <i className="bi bi-cart-plus fs-5"></i>
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              className={`btn py-3 px-4 fs-6 fw-bold d-flex align-items-center justify-content-center gap-2 ${
                wishlisted ? "text-danger border-danger" : ""
              }`}
              onClick={handleWishlistClick}
              aria-pressed={wishlisted}
            >
              <i className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"}`}></i>
              <span>{wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}</span>
            </button>
          </div>
        </div>
        </div>
     </div>
     <Footer/>
    </div>
  )
}

export default ProductDetailsPage
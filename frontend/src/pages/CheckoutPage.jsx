import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { getAddresses, createOrderApi } from "../api/api";
import AddressModal from "../components/AddressModal";
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartSummary, clearCart } = useCart();
  const { showAlert } = useAlert();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // Fetch addresses
  const loadAddresses = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await getAddresses();
      if (res.success && res.data.addresses) {
        setAddresses(res.data.addresses);
        // Default to default address or first address
        const defaultAddr = res.data.addresses.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (res.data.addresses.length > 0) {
          setSelectedAddressId(res.data.addresses[0]._id);
        }
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="p-5 bg-white rounded-4 border shadow-sm" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <i className="bi bi-shield-lock display-3 text-royal mb-3 d-block"></i>
          <h4 className="fw-bold text-royal mb-2">Login Required for Checkout</h4>
          <p className="text-muted mb-4">
            Please log in to your account to select a delivery address and place your order securely.
          </p>
          <Link to="/login" className="btn btn-royal px-4 py-2.5 w-100 fw-semibold">
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderSuccessModal) {
    return (
      <div className="container py-5 text-center">
        <div className="p-5 bg-white rounded-4 border shadow-sm" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <i className="bi bi-cart-x display-3 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold mb-2">No Items in Cart</h4>
          <p className="text-muted mb-4">Your cart is empty. Please add items before checking out.</p>
          <Link to="/products" className="btn btn-royal px-4 py-2">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showAlert("Please choose a delivery address to proceed", "warning");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        items: cartItems,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          addressLine: selectedAddress.addressLine,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        },
        totalAmount: cartSummary.finalTotal,
        paymentMethod: "COD",
      };

      const res = await createOrderApi(orderPayload);
      if (res.success && res.data.order) {
        setPlacedOrderDetails(res.data.order);
        clearCart();
        setOrderSuccessModal(true);
        showAlert("Order Placed Successfully.", "success");
      }
    } catch (err) {
      showAlert(err.message || "Failed to place order. Please try again.", "danger");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Title */}
      <div className="mb-4 pb-2 border-bottom">
        <h2 className="font-serif fw-bold text-royal mb-1">Checkout & Order Review</h2>
        <p className="text-muted small mb-0">Select your destination address and finalize your order</p>
      </div>

      <div className="row g-4">
        {/* Left Column: Address Selection & Order Summary */}
        <div className="col-lg-8">
          {/* 1. Address Selection */}
          <div className="p-4 bg-white rounded-4 border border-light shadow-sm mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="font-serif fw-bold text-royal mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-fill text-gold"></i>
                1. Select Delivery Address
              </h5>
              <button
                type="button"
                className="btn btn-outline-royal btn-sm"
                onClick={() => setShowAddressModal(true)}
              >
                <i className="bi bi-plus-lg me-1"></i> Add New Address
              </button>
            </div>

            {isLoading ? (
             <p>Loading...</p>
            ) : addresses.length === 0 ? (
              <div className="alert alert-warning py-3 mb-0">
                <p className="mb-2">No delivery addresses found on your account.</p>
                <button
                  type="button"
                  className="btn btn-royal btn-sm"
                  onClick={() => setShowAddressModal(true)}
                >
                  Add Delivery Address Now
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`d-flex p-3 rounded-3 border cursor-pointer transition ${
                      selectedAddressId === addr._id
                        ? "border-danger bg-light shadow-sm"
                        : "border-light"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="form-check me-3 mt-1">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="addressRadio"
                        id={`addr-${addr._id}`}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-bold text-dark">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="badge bg-secondary-subtle text-secondary small">
                            Default
                          </span>
                        )}
                        <span className="text-muted small ms-auto">
                          <i className="bi bi-telephone me-1"></i>{addr.phone}
                        </span>
                      </div>
                      <p className="text-muted small mb-0">
                        {addr.addressLine}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 2. Order Items Review */}
          <div className="p-4 bg-white rounded-4 border border-light shadow-sm mb-4">
            <h5 className="font-serif fw-bold text-royal mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-bag-check-fill text-gold"></i>
              2. Order Items ({cartItems.length})
            </h5>
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => {
                const prod = item.product || {};
                const displayImg =
                  (prod.images && prod.images[0]) ||
                  prod.image ||
                  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80";

                return (
                  <div key={item._id || prod._id} className="d-flex align-items-center gap-3 pb-3 border-bottom">
                    <img
                      src={displayImg}
                      alt={prod.name}
                      className="rounded-3 object-fit-cover"
                      style={{ width: "65px", height: "75px" }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: "350px" }}>
                        {prod.name}
                      </h6>
                      <small className="text-muted d-block">
                        Qty: <strong>{item.quantity}</strong> | Size: <strong>{item.size || "M"}</strong> | Color: <strong>{item.color || "Standard"}</strong>
                      </small>
                    </div>
                    <div className="text-end fw-bold text-royal">
                      ₹{((prod.discountPrice || prod.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="p-4 bg-white rounded-4 border border-light shadow-sm">
            <h5 className="font-serif fw-bold text-royal mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-credit-card-2-front-fill text-gold"></i>
              3. Payment Method
            </h5>
            <div className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-cash-stack fs-3 text-success"></i>
                <div>
                  <h6 className="fw-bold mb-0">Cash on Delivery (COD)</h6>
                  <small className="text-muted">Pay comfortably with cash or UPI upon delivery</small>
                </div>
              </div>
              <span className="badge bg-success-subtle text-success fw-bold">Supported</span>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary & Place Order */}
        <div className="col-lg-4">
          <div className="price-summary-card sticky-top" style={{ top: "85px" }}>
            <h5 className="font-serif fw-bold text-royal pb-3 border-bottom mb-3">
              Order Summary
            </h5>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Items Total:</span>
              <span>₹{cartSummary.originalTotal.toLocaleString()}</span>
            </div>

            {cartSummary.totalDiscount > 0 && (
              <div className="d-flex justify-content-between mb-2 small text-success">
                <span>Product Discount:</span>
                <span>- ₹{cartSummary.totalDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Delivery Charges:</span>
              <span className="text-success fw-bold">FREE</span>
            </div>

            <hr className="my-3 text-muted" />

            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold fs-6">Amount to Pay:</span>
              <span className="fw-bold fs-5 text-royal">
                ₹{cartSummary.finalTotal.toLocaleString()}
              </span>
            </div>

            {/* Selected Address Snapshot */}
            {selectedAddress && (
              <div className="bg-light p-2.5 rounded-3 mb-4 small">
                <span className="text-muted d-block mb-1">Delivering to:</span>
                <strong className="text-dark d-block">{selectedAddress.fullName}</strong>
                <span className="text-muted d-block text-truncate">
                  {selectedAddress.addressLine}, {selectedAddress.city}
                </span>
              </div>
            )}

            {/* Place Order Button */}
            <button
              type="button"
              className="btn btn-royal w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || addresses.length === 0}
            >
              {isPlacingOrder ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle fs-5"></i>
                  <span>Place Order (₹{cartSummary.finalTotal.toLocaleString()})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddressModal
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSaved={loadAddresses}
      />

      {/* Order Placed Successfully Modal */}
      {orderSuccessModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg text-center p-4 rounded-4">
              <div className="rounded-circle bg-success-subtle text-success d-inline-flex p-3 mx-auto mb-3">
                <i className="bi bi-check-circle-fill display-4"></i>
              </div>

              <h3 className="font-serif fw-bold text-royal mb-2">Order Placed Successfully.</h3>
              <p className="text-muted mb-4">
                Thank you for shopping with Aura Ethnic! Your traditional ensemble has been confirmed and saved to your backend order records.
              </p>

              {placedOrderDetails && (
                <div className="bg-light p-3 rounded-3 text-start small mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Order ID:</span>
                    <strong className="text-dark">{placedOrderDetails._id}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Total Paid (COD):</span>
                    <strong className="text-royal">₹{placedOrderDetails.totalAmount?.toLocaleString()}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Delivery Address:</span>
                    <span className="text-dark text-truncate" style={{ maxWidth: "220px" }}>
                      {placedOrderDetails.shippingAddress?.city}, {placedOrderDetails.shippingAddress?.state}
                    </span>
                  </div>
                </div>
              )}

              <div className="d-flex gap-3 justify-content-center">
                <button
                  type="button"
                  className="btn btn-royal px-4 py-2"
                  onClick={() => navigate("/profile")}
                >
                  View Order History
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2"
                  onClick={() => navigate("/products")}
                >
                  Shop More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

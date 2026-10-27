import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { getAddresses, deleteAddressApi, getOrders } from "../api/api";
import AddressModal from "../components/AddressModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const { showAlert } = useAlert();

  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "addresses" | "orders"
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadAddresses();
    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await getAddresses();
      if (res.success && res.data.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await getOrders();
      if (res.success && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await deleteAddressApi(addressId);
      showAlert("Address deleted successfully", "info");
      await loadAddresses();
      await refreshUser();
    } catch (err) {
      showAlert(err.message || "Failed to delete address", "danger");
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div>
        <Navbar />

        <div className="container py-4">
      {/* Page Title */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div>
          <h2 className="font-serif fw-bold text-royal mb-1">My Account</h2>
          <p className="text-muted small mb-0">Manage profile details, addresses, and order history</p>
        </div>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Navigation Sidebar */}
        <div className="col-md-3">
          <div className="bg-white p-3 rounded-4 border border-light shadow-sm d-flex flex-column gap-2">
            <button
              type="button"
              className={`btn text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 fw-semibold ${
                activeTab === "profile" ? "btn-royal text-white" : "btn-light text-dark"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="bi bi-person-badge"></i>
              <span>Profile Details</span>
            </button>

            <button
              type="button"
              className={`btn text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 fw-semibold ${
                activeTab === "addresses" ? "btn-royal text-white" : "btn-light text-dark"
              }`}
              onClick={() => setActiveTab("addresses")}
            >
              <i className="bi bi-geo-alt"></i>
              <span>Address Management</span>
            </button>

            <button
              type="button"
              className={`btn text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 fw-semibold ${
                activeTab === "orders" ? "btn-royal text-white" : "btn-light text-dark"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <i className="bi bi-receipt"></i>
              <span>Order History</span>
              {orders.length > 0 && (
                <span className="badge bg-secondary ms-auto">{orders.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="col-md-9">
          {/* TAB 1: Profile Details (Static user info as required) */}
          {activeTab === "profile" && (
            <div className="p-4 bg-white rounded-4 border border-light shadow-sm">
              <h5 className="font-serif fw-bold text-royal mb-4 pb-2 border-bottom">
                User Profile Information
              </h5>

              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="text-muted small fw-semibold d-block">Full Name</label>
                  <span className="fw-bold fs-6 text-dark">{user.name || "Kiran Demo"}</span>
                </div>

                <div className="col-sm-6">
                  <label className="text-muted small fw-semibold d-block">Email Address</label>
                  <span className="fw-bold fs-6 text-dark">{user.email || "demo@example.com"}</span>
                </div>

                <div className="col-sm-6">
                  <label className="text-muted small fw-semibold d-block">Phone Number</label>
                  <span className="fw-bold fs-6 text-dark">{user.phone || "+91 98765 43210"}</span>
                </div>

                <div className="col-sm-6">
                  <label className="text-muted small fw-semibold d-block">Account Status</label>
                  <span className="badge bg-success-subtle text-success fw-bold">Active Member</span>
                </div>
              </div>

              <hr className="my-4 text-muted" />

              <div className="d-flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn btn-outline-royal btn-sm"
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressModal(true);
                  }}
                >
                  <i className="bi bi-plus-lg me-1"></i> Add New Address
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setActiveTab("orders")}
                >
                  <i className="bi bi-clock-history me-1"></i> View Order History
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Address Management */}
          {activeTab === "addresses" && (
            <div className="p-4 bg-white rounded-4 border border-light shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                <h5 className="font-serif fw-bold text-royal mb-0">Saved Delivery Addresses</h5>
                <button
                  type="button"
                  className="btn btn-royal btn-sm d-flex align-items-center gap-1"
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle"></i>
                  <span>Add New Address</span>
                </button>
              </div>

              {isLoadingAddresses ? (
                <p>Loading...</p>
              ) : addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No saved addresses yet.</p>
                  <button
                    type="button"
                    className="btn btn-royal btn-sm"
                    onClick={() => {
                      setEditingAddress(null);
                      setShowAddressModal(true);
                    }}
                  >
                    Add Address Now
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="col-12">
                      <div className="p-3 rounded-3 border bg-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-bold text-dark">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="badge bg-gold text-white small">Default</span>
                            )}
                          </div>
                          <p className="text-muted small mb-1">
                            {addr.addressLine}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                          </p>
                          <small className="text-muted">
                            <i className="bi bi-telephone me-1"></i>{addr.phone}
                          </small>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setEditingAddress(addr);
                              setShowAddressModal(true);
                            }}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteAddress(addr._id)}
                          >
                            <i className="bi bi-trash3 me-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Order History */}
          {activeTab === "orders" && (
            <div className="p-4 bg-white rounded-4 border border-light shadow-sm">
              <h5 className="font-serif fw-bold text-royal mb-4 pb-2 border-bottom">
                Order History & Past Purchases
              </h5>

              {isLoadingOrders ? (
                <p>Loading...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-bag-check display-4 text-muted mb-3 d-block"></i>
                  <h5 className="fw-bold">No Orders Placed Yet</h5>
                  <p className="text-muted mb-3 small">
                    When you place an order, all details, addresses and invoices will appear here.
                  </p>
                  <Link to="/products" className="btn btn-royal btn-sm">
                    Browse Collection
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {orders.map((order) => (
                    <div key={order._id} className="p-3 border rounded-3 bg-light">
                      <div className="d-flex flex-wrap justify-content-between align-items-center pb-2 mb-2 border-bottom small">
                        <div>
                          <span className="text-muted">Order ID: </span>
                          <strong className="text-dark">{order._id}</strong>
                        </div>
                        <div>
                          <span className="text-muted">Placed on: </span>
                          <strong className="text-dark">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </strong>
                        </div>
                        <div>
                          <span className="badge bg-success-subtle text-success text-uppercase fw-bold">
                            {order.orderStatus || "Placed"}
                          </span>
                        </div>
                      </div>

                      {/* Items in this order */}
                      <div className="d-flex flex-column gap-2 my-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="d-flex align-items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="rounded object-fit-cover"
                                style={{ width: 45, height: 50 }}
                              />
                            )}
                            <div className="flex-grow-1 small">
                              <span className="fw-bold d-block text-truncate" style={{ maxWidth: 300 }}>
                                {item.name}
                              </span>
                              <span className="text-muted">
                                Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
                              </span>
                            </div>
                            <div className="fw-bold text-royal small">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 mt-2 border-top small">
                        <span className="text-muted">
                          Shipping to: <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.city})
                        </span>
                        <div>
                          <span className="text-muted me-2">Total Paid:</span>
                          <strong className="text-royal fs-6">₹{order.totalAmount?.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Edit/Add Modal */}
      <AddressModal
        show={showAddressModal}
        initialData={editingAddress}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSaved={loadAddresses}
      />
    </div>

        <Footer />
    </div>
  );
}

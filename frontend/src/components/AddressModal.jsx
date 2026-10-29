import React, { useState, useEffect } from "react";
import { addAddressApi, updateAddressApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

export default function AddressModal({ show, onClose, initialData = null, onSaved }) {
  const { refreshUser } = useAuth();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        addressLine: initialData.addressLine || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        isDefault: !!initialData.isDefault,
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }
  }, [initialData, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue =
      name === "phone" || name === "pincode"
        ? value.replace(/\D/g, "").slice(0, name === "phone" ? 10 : 6)
        : value;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : fieldValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData && initialData._id) {
        // Update existing address
        await updateAddressApi(initialData._id, formData);
        showAlert("Address updated successfully", "success");
      } else {
        // Add new address
        await addAddressApi(formData);
        showAlert("New address added successfully", "success");
      }

      await refreshUser();
      if (onSaved) onSaved();
      onClose();
    } catch (error) {
      showAlert(error.message || "Failed to save address", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title font-serif fw-bold text-royal">
              {initialData ? "Update Delivery Address" : "Add New Delivery Address"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body py-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Kiran Kumar"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    name="phone"
                    className="form-control"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Flat / House No. / Street Address *</label>
                  <textarea
                    name="addressLine"
                    className="form-control"
                    rows="2"
                    required
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="e.g. Flat 301, Silver Oak Apts, 5th Cross Road"
                  ></textarea>
                </div>

                <div className="col-md-5">
                  <label className="form-label small fw-semibold">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">State *</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Karnataka"
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">PIN Code *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="pincode"
                    className="form-control"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="560001"
                  />
                </div>

                <div className="col-12">
                  <div className="form-check mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isDefaultCheck"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                    />
                    <label className="form-check-label small" htmlFor="isDefaultCheck">
                      Make this my default delivery address
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top-0 pt-0">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-royal px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

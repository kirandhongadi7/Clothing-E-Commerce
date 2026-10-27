
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export const RegisterPage = () => {
    const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

   const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    navigate("/profile");
    return null;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await register(formData);
    setIsSubmitting(false);
    if (res.success) {
      navigate("/");
    }
  };
    return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="p-4 p-md-5 bg-white rounded-4 border border-light shadow-sm">
            <div className="text-center mb-4">
              <h2 className="font-serif fw-bold text-royal mb-1">Create Account</h2>
              <p className="text-muted small">Join Aura Ethnic for exclusive couture updates</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  required
                  placeholder="e.g. Aditi Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+91 99887 76655"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-royal w-100 py-2.5 fw-bold mb-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Register Now"}
              </button>

              <div className="text-center small text-muted">
                Already have an account?{" "}
                <Link to="/login" className="text-royal fw-bold text-decoration-none">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


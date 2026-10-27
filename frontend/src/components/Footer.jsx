
export default function Footer() {
  return (
    <footer className="bg-white border-top mt-5 pt-5 pb-4">
      <div className="container">
        <div className="row g-4 pb-5 mb-1 text-center text-md-start">
          <div className="col-md-3 col-6">
            <div className="d-flex flex-column flex-md-row align-items-center gap-3">
              <div className="rounded-circle bg-gold-subtle p-3 text-gold fs-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                <i className="bi bi-patch-check"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">100% Authentic</h6>
                <small className="text-muted">Direct from artisan weavers</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="d-flex flex-column flex-md-row align-items-center gap-3">
              <div className="rounded-circle bg-gold-subtle p-3 text-gold fs-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                <i className="bi bi-truck"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Free Express Shipping</h6>
                <small className="text-muted">On all domestic orders</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="d-flex flex-column flex-md-row align-items-center gap-3">
              <div className="rounded-circle bg-gold-subtle p-3 text-gold fs-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                <i className="bi bi-arrow-repeat"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Easy 7-Day Returns</h6>
                <small className="text-muted">Hassle-free doorstep pickup</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="d-flex flex-column flex-md-row align-items-center gap-3">
              <div className="rounded-circle bg-gold-subtle p-3 text-gold fs-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                <i className="bi bi-shield-lock"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Secure COD & Payment</h6>
                <small className="text-muted">Encrypted checkout security</small>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center pt-3 border-top text-muted small">
          © {new Date().getFullYear()} Aura Ethnic Couture. All rights reserved. MERN Stack E-Commerce.
        </div>
      </div>
    </footer>
  );
}

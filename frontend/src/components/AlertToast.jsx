import React from "react";
import { useAlert } from "../context/AlertContext";

export default function AlertToast() {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="alert-toast-container">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`toast-item alert alert-${alert.type} alert-dismissible fade show d-flex align-items-center m-0`}
          role="alert"
        >
          <i
            className={`bi me-2 fs-5 ${
              alert.type === "success"
                ? "bi-check-circle-fill"
                : alert.type === "danger"
                ? "bi-exclamation-triangle-fill"
                : alert.type === "warning"
                ? "bi-exclamation-circle-fill"
                : "bi-info-circle-fill"
            }`}
          ></i>
          <span className="flex-grow-1 fw-medium">{alert.message}</span>
          <button
            type="button"
            className="btn-close ms-2"
            onClick={() => removeAlert(alert.id)}
            aria-label="Close"
          ></button>
        </div>
      ))}
    </div>
  );
}

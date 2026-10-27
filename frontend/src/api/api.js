import { useState } from "react";
const API_BASE_URL = "https://clothing-e-commerce-five.vercel.app/api";


export async function apiFetch(endpoint, options = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = localStorage.getItem("token");
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const config = {
    ...options,
    headers,
  };
  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json(); 
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Fetch Error on ${endpoint}:`, error.message);
    throw error;
  }
}


//products 

export const fetchProducts = async() =>{
    return await apiFetch("/products")
}

export const fetchProductById = async(productId) =>{
    return await apiFetch(`/products/${productId}`)
}

export const fetchCategories = async () => {
  return await apiFetch("/category");
};

// ==================== AUTHENTICATION ====================

export const loginUser = async (email, password) => {
  return await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
};

export const registerUser = async (userData) => {
  return await apiFetch("/auth/register", {
    method: "POST",
    body: userData,
  });
};

export const fetchUserProfile = async () => {
  return await apiFetch("/auth/me");
};

// ==================== WISHLIST ====================

export const getWishlist = async () => {
  return await apiFetch("/user/wishlist");
};

export const addToWishlistApi = async (productId) => {
  return await apiFetch("/user/wishlist", {
    method: "POST",
    body: { productId },
  });
};

export const removeFromWishlistApi = async (productId) => {
  return await apiFetch(`/user/wishlist/${productId}`, {
    method: "DELETE",
  });
};

// ==================== CART ====================

export const getCart = async () => {
  return await apiFetch("/user/cart");
};

export const addToCartApi = async (productId, quantity = 1, size = "M", color = "Standard") => {
  return await apiFetch("/user/cart", {
    method: "POST",
    body: { productId, quantity, size, color },
  });
};

export const updateCartQuantityApi = async (productId, action) => {
  return await apiFetch(`/user/cart/${productId}`, {
    method: "POST",
    body: { action }, // "increment" or "decrement"
  });
};

export const removeFromCartApi = async (productId) => {
  return await apiFetch(`/user/cart/${productId}`, {
    method: "DELETE",
  });
};

// ==================== ADDRESSES ====================

export const getAddresses = async () => {
  return await apiFetch("/user/addresses");
};

export const addAddressApi = async (addressData) => {
  return await apiFetch("/user/addresses", {
    method: "POST",
    body: addressData,
  });
};

export const updateAddressApi = async (addressId, addressData) => {
  return await apiFetch(`/user/addresses/${addressId}`, {
    method: "PUT",
    body: addressData,
  });
};

export const deleteAddressApi = async (addressId) => {
  return await apiFetch(`/user/addresses/${addressId}`, {
    method: "DELETE",
  });
};

// ==================== ORDERS ====================

export const getOrders = async () => {
  return await apiFetch("/user/orders");
};

export const createOrderApi = async (orderData) => {
  return await apiFetch("/user/orders", {
    method: "POST",
    body: orderData,
  });
};

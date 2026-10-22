import { useState } from "react";
const API_BASE_URL = "http://localhost:5000/api";


export async function apiFetch(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
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
import {createContext, useContext, useState, useEffect, useCallback} from "react";
import {
  addToWishlistApi,
  getWishlist,
  removeFromWishlistApi,
} from "../api/api";

import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, token } = useAuth();
  const { showAlert } = useAlert();

  // Load wishlist only for logged-in users
  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setWishlist([]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await getWishlist();

      if (res.success && res.data.wishlist) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Check if a product is already in wishlist
const isInWishlist = useCallback(
  (productId) => {
    return wishlist.some((item) => item._id === productId);
  },
  [wishlist]
);

  // Add product to wishlist
  const addToWishlist = async (product) => {
    if (!isAuthenticated || !token) {
      showAlert("Please login or register to use wishlist", "warning");
      return false;
    }

    const prodId = typeof product === "object" ? product._id : product;

    if (isInWishlist(prodId)) {
      showAlert("Product is already in your wishlist", "info");
      return false;
    }

    try {
      const res = await addToWishlistApi(prodId);

      if (res.success && res.data.wishlist) {
        setWishlist(res.data.wishlist);
        showAlert("Added item to wishlist", "success");
        return true;
      }

      return false;
    } catch (err) {
      showAlert(err.message || "Failed to add to wishlist", "danger");
      return false;
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated || !token) {
      showAlert("Please login or register to use wishlist", "warning");
      return false;
    }

    const prodId =
      typeof productId === "object" ? productId._id : productId;

    try {
      const res = await removeFromWishlistApi(prodId);

      if (res.success && res.data.wishlist) {
        setWishlist(res.data.wishlist);
        showAlert("Removed item from wishlist", "info");
        return true;
      }

      return false;
    } catch (err) {
      showAlert(err.message || "Failed to remove from wishlist", "danger");
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        reloadWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
};
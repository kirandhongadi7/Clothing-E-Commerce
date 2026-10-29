import React, {createContext,useContext,useState,useEffect,useCallback,useMemo} from "react";

import {getCart,addToCartApi,updateCartQuantityApi,removeFromCartApi} from "../api/api";

import { useAuth } from "./AuthContext";
import { useWishlist } from "./WishlistContext";

import { useAlert } from "./AlertContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, token } = useAuth();
  const { addToWishlist } = useWishlist();
  const { showAlert } = useAlert();

  // Load cart only for authenticated users
  const loadCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await getCart();

      if (res.success && res.data.cart) {
        setCartItems(res.data.cart);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Check if a product is already in the cart
  const isInCart = useCallback(
    (productId) => {
      const targetId =
        typeof productId === "object" ? productId?._id : productId;

      return cartItems.some((item) => {
        const itemId =
          typeof item.product === "object" ? item.product?._id : item.product;

        return String(itemId) === String(targetId);
      });
    },
    [cartItems],
  );

  // Add item to cart
  const addToCart = async (
    product,
    quantity = 1,
    size = "M",
    color = "Standard",
    options = {},
  ) => {
    if (!isAuthenticated || !token) {
      showAlert(
        "Please log in or register to add products to your cart.",
        "warning",
      );
      return;
    }

    const prodId = typeof product === "object" ? product._id : product;
    const isSilent = options.silent || false;

    try {
      const res = await addToCartApi(prodId, quantity, size, color);

      if (res.success && res.data.cart) {
        setCartItems(res.data.cart);

        if (!isSilent) {
          showAlert("Added item to the cart", "success");
        }
      }
    } catch (err) {
      showAlert(err.message || "Failed to add to cart", "danger");
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, action) => {
    if (!isAuthenticated || !token) {
      showAlert("Please log in or register to update your cart.", "warning");
      return;
    }

    const prodId = typeof productId === "object" ? productId._id : productId;

    try {
      const res = await updateCartQuantityApi(prodId, action);

      if (res.success && res.data.cart) {
        setCartItems(res.data.cart);

        const message =
          action === "increment"
            ? "Increased item in the cart"
            : "Decreased item in the cart";

        showAlert(message, "info");
      }
    } catch (err) {
      showAlert(err.message || "Failed to update quantity", "danger");
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, options = {}) => {
    if (!isAuthenticated || !token) {
      showAlert("Please log in or register to manage your cart.", "warning");
      return;
    }

    const prodId = typeof productId === "object" ? productId._id : productId;

    const isSilent = options.silent || false;

    try {
      const res = await removeFromCartApi(prodId);

      if (res.success && res.data.cart) {
        setCartItems(res.data.cart);

        if (!isSilent) {
          showAlert("Removed item from the cart", "info");
        }
      }
    } catch (err) {
      showAlert(err.message || "Failed to remove from cart", "danger");
    }
  };

  // Move item from cart to wishlist
  const moveToWishlist = async (item) => {
    if (!isAuthenticated || !token) {
      showAlert("Please log in or register to manage your cart.", "warning");
      return;
    }

    const product = item.product || item;

    try {
      await addToWishlist(product);

      await removeFromCart(product._id || product, {
        silent: true,
      });

      showAlert("Moved item from the cart to the wishlist", "success");
    } catch (err) {
      showAlert(err.message || "Failed to move item to wishlist", "danger");
    }
  };

  // Move item from wishlist to cart
  const moveWishlistToCart = async (product) => {
    if (!isAuthenticated || !token) {
      showAlert(
        "Please log in or register to add products to your cart.",
        "warning",
      );
      return;
    }

    await addToCart(product, 1, "M", "Standard", {
      silent: true,
    });

    showAlert("Moved item from wishlist to cart", "success");
  };

  // Clear cart after successful checkout
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart price details
  const cartSummary = useMemo(() => {
    let totalItems = 0;
    let originalTotal = 0;
    let finalTotal = 0;

    cartItems.forEach((item) => {
      const product = item.product || {};
      const quantity = item.quantity || 1;
      const price = product.price || 0;
      const discountPrice = product.discountPrice ?? price;

      totalItems += quantity;
      originalTotal += price * quantity;
      finalTotal += discountPrice * quantity;
    });

    const totalDiscount = originalTotal - finalTotal;
    const deliveryCharges = 0;

    return {
      totalItems,
      originalTotal,
      finalTotal,
      totalDiscount,
      deliveryCharges,
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartSummary.totalItems,
        cartSummary,
        isLoading,
        isInCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        moveToWishlist,
        moveWishlistToCart,
        clearCart,
        reloadCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

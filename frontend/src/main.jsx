import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import ProductListingPage from "./pages/ProductListingPage.jsx";
import "./index.css";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import { AlertProvider } from "./context/AlertContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import AlertToast from "./components/AlertToast.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/products",
    element: <ProductListingPage />,
  },
  {
    path: "/products/:productId",
    element: <ProductDetailsPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />
  },{
    path: "/login",
    element: <LoginPage />
  },{
    path: "/cart",
    element: <CartPage />
  },{
    path: "/wishlist",
    element: <WishlistPage />
  },{
    path: "/profile",
    element: <UserProfilePage />
  },{
    path: "/checkout",
    element: <CheckoutPage />
  }
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AlertProvider>
      <AuthProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <AlertToast />

           
              
          <RouterProvider router={router} />
          </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </AuthProvider>
    </AlertProvider>
  </StrictMode>,
);

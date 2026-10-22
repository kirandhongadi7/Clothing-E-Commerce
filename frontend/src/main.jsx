import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import App from './App.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import ProductListingPage from './pages/ProductListingPage.jsx'
import './index.css'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },{
     path: "/products",
     element: <ProductListingPage />
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductProvider>
    <RouterProvider router={router} />
    </ProductProvider>
  </StrictMode>,
)

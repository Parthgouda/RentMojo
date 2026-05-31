import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import WishlistProvider from "./context/WishlistContext";

import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <WishlistProvider>

      <CartProvider>

        <App />

      </CartProvider>

    </WishlistProvider>

  </React.StrictMode>

);
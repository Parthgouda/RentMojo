import {
  useEffect,
  useState,
  useContext,
} from "react";

import axios from "axios";

import {
  CartContext,
} from "../context/CartContext";

import {
  WishlistContext,
} from "../context/WishlistContext";

import {
  toast,
  ToastContainer,
} from "react-toastify";

import {
  Link,
} from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

function Home() {

  const [products, setProducts] =
    useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortOption, setSortOption] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const { addToCart } =
    useContext(CartContext);

  const { addToWishlist } =
    useContext(WishlistContext);

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(
            "https://rentmojo-snqg.onrender.com/products"
          );

        setProducts(
          response.data.products || []
        );

        setError("");

      } catch (error) {

        console.log(error);

        setError(
          "Failed To Load Products"
        );

      } finally {

        setLoading(false);

      }

    };

  /* ADD TO CART */

  const handleAddToCart =
    (product) => {

      addToCart(product);

      toast.success(
        "Product Added To Cart 🛒"
      );

    };

  /* ADD TO WISHLIST */

  const handleWishlist =
    (product) => {

      addToWishlist(product);

      toast.success(
        "Added To Wishlist ❤️"
      );

    };

  /* FILTER PRODUCTS */

  let filteredProducts =
    products.filter(
      (product) => {

        const matchesSearch =
          product.name
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesCategory =

          selectedCategory ===
          "All"

            ? true

            : product.category
                ?.toLowerCase() ===
              selectedCategory.toLowerCase();

        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );

  /* SORT PRODUCTS */

  if (
    sortOption ===
    "lowToHigh"
  ) {

    filteredProducts.sort(
      (a, b) =>
        a.price - b.price
    );

  }

  if (
    sortOption ===
    "highToLow"
  ) {

    filteredProducts.sort(
      (a, b) =>
        b.price - a.price
    );

  }

  return (

    <div
      className={`min-h-screen p-10 transition-all duration-300 ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      <ToastContainer />

      {/* HEADER */}

      <div className="flex justify-between items-center flex-wrap gap-5">

        <h1 className="text-5xl font-bold text-green-500">

          Rent Furniture & Appliances

        </h1>

        <button
          onClick={() =>
            setDarkMode(
              !darkMode
            )
          }
          className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-xl"
        >

          {darkMode
            ? "Light Mode ☀️"
            : "Dark Mode 🌙"}

        </button>

      </div>

      {/* SEARCH FILTER SORT */}

      <div className="flex flex-col lg:flex-row gap-5 mt-10">

        <input
          type="text"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          className="border p-4 rounded-xl w-full text-black shadow-lg outline-none"
        />

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
          className="border p-4 rounded-xl text-black shadow-lg"
        >

          <option value="All">
            All Categories
          </option>

          <option value="Furniture">
            Furniture
          </option>

          <option value="Appliances">
            Appliances
          </option>

          <option value="Electronics">
            Electronics
          </option>

        </select>

        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(
              e.target.value
            )
          }
          className="border p-4 rounded-xl text-black shadow-lg"
        >

          <option value="">
            Sort By
          </option>

          <option value="lowToHigh">
            Price Low To High
          </option>

          <option value="highToLow">
            Price High To Low
          </option>

        </select>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="text-center mt-16">

          <h2 className="text-3xl font-bold">

            Loading Products...

          </h2>

        </div>

      ) : error ? (

        <div className="text-center mt-16">

          <h2 className="text-3xl font-bold text-red-500">

            {error}

          </h2>

        </div>

      ) : filteredProducts.length ===
        0 ? (

        <div className="text-center mt-16">

          <h2 className="text-3xl font-bold">

            No Products Found

          </h2>

        </div>

      ) : (

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-10 mt-14">

          {filteredProducts.map(
            (product) => (

              <div
                key={
                  product._id
                }
                className={`rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-900"
                    : "bg-white"
                }`}
              >

                <Link
                  to={`/product/${product._id}`}
                >

                  <img
                    src={
                      product.image
                    }
                    alt={
                      product.name
                    }
                    className="h-56 w-full object-cover"
                  />

                </Link>

                <div className="p-5">

                  <h2 className="text-2xl font-bold">

                    {product.name}

                  </h2>

                  <p className="mt-2 text-gray-500">

                    {
                      product.category
                    }

                  </p>

                  <p className="mt-3 text-xl font-bold text-green-500">

                    ₹{product.price}

                  </p>

                  <button
                    onClick={() =>
                      handleAddToCart(
                        product
                      )
                    }
                    className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
                  >

                    Add To Cart

                  </button>

                  <button
                    onClick={() =>
                      handleWishlist(
                        product
                      )
                    }
                    className="mt-3 w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl"
                  >

                    Add To Wishlist ❤️

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}

export default Home;
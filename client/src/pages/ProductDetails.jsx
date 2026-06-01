import {
  useEffect,
  useState,
  useContext,
} from "react";

import axios from "axios";

import {
  useParams,
  Link,
} from "react-router-dom";

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

import "react-toastify/dist/ReactToastify.css";

function ProductDetails() {

  const { id } =
    useParams();

  const [product, setProduct] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [reviews, setReviews] =
    useState([]);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  const { addToCart } =
    useContext(CartContext);

  const { addToWishlist } =
    useContext(
      WishlistContext
    );

  useEffect(() => {

    fetchProduct();

    fetchProducts();

    fetchReviews();

  }, [id]);

  /* FETCH SINGLE PRODUCT */

  const fetchProduct =
    async () => {

      try {

        const response =
          await axios.get(
            `https://rentmojo-snqg.onrender.com/products/${id}`
          );

        setProduct(
          response.data.product
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  /* FETCH ALL PRODUCTS */

  const fetchProducts =
    async () => {

      try {

        const response =
          await axios.get(
            "https://rentmojo-snqg.onrender.com/products"
          );

        setProducts(
          response.data.products
        );

      } catch (error) {

        console.log(error);

      }

    };

  /* FETCH REVIEWS */

  const fetchReviews =
    async () => {

      try {

        const response =
          await axios.get(
            `https://rentmojo-snqg.onrender.com/reviews/${id}`
          );

        setReviews(
          response.data.reviews
        );

      } catch (error) {

        console.log(error);

      }

    };

  /* RELATED PRODUCTS */

  const relatedProducts =
    products.filter(

      (item) =>

        item.category ===
          product?.category &&

        item._id !==
          product?._id

    );

  /* ADD TO CART */

  const handleCart = () => {

    addToCart(product);

    toast.success(
      "Added To Cart"
    );

  };

  /* ADD TO WISHLIST */

  const handleWishlist =
    () => {

      addToWishlist(
        product
      );

      toast.success(
        "Added To Wishlist ❤️"
      );

    };

  /* SUBMIT REVIEW */

  const submitReview =
    async () => {

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      if (!user) {

        toast.error(
          "Please Login First"
        );

        return;

      }

      if (!comment) {

        toast.error(
          "Please Write Review"
        );

        return;

      }

      try {

        await axios.post(
          "https://rentmojo-snqg.onrender.com/reviews",
          {

            productId: id,

            userName:
              user.name,

            rating:
              Number(rating),

            comment,

          }
        );

        toast.success(
          "Review Added"
        );

        setComment("");

        setRating(5);

        fetchReviews();

      } catch (error) {

        console.log(error);

        toast.error(
          "Review Failed"
        );

      }

    };

  /* LOADING */

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center text-3xl font-bold">

        Loading...

      </div>

    );

  }

  /* PRODUCT NOT FOUND */

  if (!product) {

    return (

      <div className="min-h-screen flex justify-center items-center text-3xl font-bold">

        Product Not Found

      </div>

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

      <div className="flex justify-between items-center mb-10 flex-wrap gap-5">

        <h1 className="text-5xl font-bold text-green-500">

          Product Details

        </h1>

        <button
          onClick={() =>
            setDarkMode(
              !darkMode
            )
          }
          className="bg-gray-800 text-white px-5 py-2 rounded-xl"
        >

          {darkMode
            ? "Light Mode"
            : "Dark Mode"}

        </button>

      </div>

      {/* MAIN PRODUCT */}

      <div
        className={`grid lg:grid-cols-2 gap-10 rounded-2xl shadow-xl overflow-hidden ${
          darkMode
            ? "bg-gray-900"
            : "bg-white"
        }`}
      >

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        <div className="p-10">

          <h1 className="text-5xl font-bold">

            {product.name}

          </h1>

          <p className="mt-5 text-xl text-gray-500">

            {product.category}

          </p>

          <h2 className="mt-8 text-5xl font-bold text-green-500">

            ₹{product.price}

          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-500">

            Premium quality rental product
            for your modern lifestyle.
            Comfortable, stylish and durable.

          </p>

          <div className="flex flex-col md:flex-row gap-5 mt-10">

            <button
              onClick={
                handleCart
              }
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-xl"
            >

              Add To Cart

            </button>

            <button
              onClick={
                handleWishlist
              }
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-xl text-xl"
            >

              Wishlist ❤️

            </button>

          </div>

        </div>

      </div>

      {/* RELATED PRODUCTS */}

      <div className="mt-20">

        <h2 className="text-4xl font-bold mb-10">

          Related Products

        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {relatedProducts.map(
            (item) => (

              <Link
                to={`/product/${item._id}`}
                key={item._id}
              >

                <div
                  className={`rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-900"
                      : "bg-white"
                  }`}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-64 w-full object-cover"
                  />

                  <div className="p-6">

                    <h2 className="text-3xl font-bold">

                      {item.name}

                    </h2>

                    <p className="mt-3 text-gray-500">

                      {
                        item.category
                      }

                    </p>

                    <h3 className="mt-5 text-3xl font-bold text-green-500">

                      ₹{item.price}

                    </h3>

                  </div>

                </div>

              </Link>

            )
          )}

        </div>

      </div>

      {/* REVIEWS */}

      <div className="mt-20">

        <h2 className="text-4xl font-bold mb-10">

          Customer Reviews

        </h2>

        {/* ADD REVIEW */}

        <div
          className={`p-8 rounded-2xl shadow-xl ${
            darkMode
              ? "bg-gray-900"
              : "bg-white"
          }`}
        >

          <select
            value={rating}
            onChange={(e) =>
              setRating(
                e.target.value
              )
            }
            className="border p-4 rounded-xl w-full text-black"
          >

            <option value="5">
              ⭐⭐⭐⭐⭐
            </option>

            <option value="4">
              ⭐⭐⭐⭐
            </option>

            <option value="3">
              ⭐⭐⭐
            </option>

            <option value="2">
              ⭐⭐
            </option>

            <option value="1">
              ⭐
            </option>

          </select>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
            className="border p-4 rounded-xl w-full mt-5 text-black"
            rows="5"
          />

          <button
            onClick={
              submitReview
            }
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl mt-5"
          >

            Submit Review

          </button>

        </div>

        {/* REVIEW LIST */}

        <div className="flex flex-col gap-6 mt-10">

          {reviews.length === 0 ? (

            <div className="text-2xl font-bold">

              No Reviews Yet

            </div>

          ) : (

            reviews.map(
              (review) => (

                <div
                  key={review._id}
                  className={`p-6 rounded-2xl shadow-xl ${
                    darkMode
                      ? "bg-gray-900"
                      : "bg-white"
                  }`}
                >

                  <h2 className="text-2xl font-bold">

                    {
                      review.userName
                    }

                  </h2>

                  <p className="text-yellow-500 text-2xl mt-2">

                    {"⭐".repeat(
                      review.rating
                    )}

                  </p>

                  <p className="mt-4 text-gray-500">

                    {
                      review.comment
                    }

                  </p>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>

  );

}

export default ProductDetails;
import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function AdminProducts() {

  const navigate =
    useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/products"
          );

        setProducts(
          response.data.products
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  /* DELETE PRODUCT */

  const deleteProduct =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete This Product?"
        );

      if (!confirmDelete)
        return;

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(

          `http://localhost:5000/products/${id}`,

          {

            headers: {

              authorization:
                token,

            },

          }

        );

        toast.success(
          "Product Deleted"
        );

        fetchProducts();

      } catch (error) {

        console.log(error);

        toast.error(
          "Delete Failed"
        );

      }

    };

  /* FILTER PRODUCTS */

  const filteredProducts =
    products.filter(
      (product) =>

        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        product.category
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center text-4xl font-bold">

        Loading...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <ToastContainer />

      <div className="flex justify-between items-center flex-wrap gap-5 mb-10">

        <h1 className="text-5xl font-bold text-green-500">

          Admin Products

        </h1>

        <button
          onClick={() =>
            navigate(
              "/add-product"
            )
          }
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg"
        >

          + Add Product

        </button>

      </div>

      {/* SEARCH */}

      <div className="mb-10">

        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border p-4 rounded-2xl outline-none text-lg"
        />

      </div>

      {/* PRODUCTS */}

      {filteredProducts.length ===
      0 ? (

        <div className="text-3xl font-bold text-center mt-20">

          No Products Found

        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {filteredProducts.map(
            (product) => (

              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-all duration-300"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">

                  <h2 className="text-3xl font-bold">

                    {product.name}

                  </h2>

                  <p className="mt-3 text-gray-500 text-lg">

                    {
                      product.category
                    }

                  </p>

                  <h3 className="mt-5 text-3xl font-bold text-green-500">

                    ₹
                    {product.price}

                  </h3>

                  <div className="flex gap-4 mt-6 flex-wrap">

                    {/* EDIT */}

                    <button
                      onClick={() =>
                        navigate(

                          `/edit-product/${product._id}`

                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl"
                    >

                      Edit

                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        deleteProduct(
                          product._id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl"
                    >

                      Delete

                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}

export default AdminProducts;
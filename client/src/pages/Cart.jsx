import {
  useContext,
  useState,
} from "react";

import {
  CartContext,
} from "../context/CartContext";

import {
  Link,
} from "react-router-dom";

function Cart() {

  const {
    cart,
    setCart,
  } = useContext(CartContext);

  const [darkMode, setDarkMode] =
    useState(false);

  const increaseQuantity = (
    index
  ) => {

    const updatedCart =
      [...cart];

    updatedCart[index].quantity =
      (updatedCart[index]
        .quantity || 1) + 1;

    setCart(updatedCart);

  };

  const decreaseQuantity = (
    index
  ) => {

    const updatedCart =
      [...cart];

    if (
      updatedCart[index]
        .quantity > 1
    ) {

      updatedCart[index]
        .quantity -= 1;

      setCart(updatedCart);

    }

  };

  const removeItem = (
    index
  ) => {

    const updatedCart =
      cart.filter(
        (_, i) =>
          i !== index
      );

    setCart(updatedCart);

  };

  const totalPrice =
    cart.reduce(
      (total, item) =>

        total +
        item.price *
          (item.quantity || 1),

      0
    );

  return (

    <div
      className={`min-h-screen p-10 transition-all duration-300 ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      <div className="flex justify-between items-center flex-wrap gap-5">

        <h1 className="text-5xl font-bold text-green-500">

          Your Cart

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

      {cart.length === 0 ? (

        <div className="flex flex-col items-center justify-center mt-24">

          <h2 className="text-4xl font-bold">

            Cart Is Empty 🛒

          </h2>

          <Link to="/">

            <button className="mt-8 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg">

              Continue Shopping

            </button>

          </Link>

        </div>

      ) : (

        <div className="mt-12 grid lg:grid-cols-3 gap-10">

          {/* CART ITEMS */}

          <div className="lg:col-span-2 flex flex-col gap-8">

            {cart.map(
              (item, index) => (

                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-6 rounded-2xl shadow-xl overflow-hidden p-5 ${
                    darkMode
                      ? "bg-gray-900"
                      : "bg-white"
                  }`}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full md:w-52 h-52 object-cover rounded-xl"
                  />

                  <div className="flex-1">

                    <h2 className="text-3xl font-bold">

                      {item.name}

                    </h2>

                    <p className="mt-2 text-gray-500">

                      {item.category}

                    </p>

                    <h3 className="mt-4 text-2xl font-bold text-green-500">

                      ₹{item.price}

                    </h3>

                    {/* QUANTITY */}

                    <div className="flex items-center gap-5 mt-6">

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            index
                          )
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-xl"
                      >

                        -

                      </button>

                      <h2 className="text-2xl font-bold">

                        {item.quantity || 1}

                      </h2>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            index
                          )
                        }
                        className="bg-green-500 text-white px-4 py-2 rounded-xl"
                      >

                        +

                      </button>

                    </div>

                    <button
                      onClick={() =>
                        removeItem(
                          index
                        )
                      }
                      className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
                    >

                      Remove Item

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

          {/* ORDER SUMMARY */}

          <div
            className={`rounded-2xl shadow-xl p-8 h-fit ${
              darkMode
                ? "bg-gray-900"
                : "bg-white"
            }`}
          >

            <h2 className="text-4xl font-bold">

              Order Summary

            </h2>

            <div className="mt-8 flex justify-between text-2xl">

              <span>Total Items</span>

              <span>
                {cart.length}
              </span>

            </div>

            <div className="mt-6 flex justify-between text-3xl font-bold">

              <span>Total</span>

              <span className="text-green-500">

                ₹{totalPrice}

              </span>

            </div>

            <Link to="/checkout">

              <button className="mt-10 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-xl">

                Proceed To Checkout

              </button>

            </Link>

          </div>

        </div>

      )}

    </div>

  );

}

export default Cart;
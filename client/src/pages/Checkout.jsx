import {
  useContext,
  useState,
  useEffect,
} from "react";

import axios from "axios";

import {
  CartContext,
} from "../context/CartContext";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Checkout() {

  const {
    cart,
    setCart,
  } = useContext(CartContext);

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

 const [formData, setFormData] =
  useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    deliveryDate: "",
  });

  useEffect(() => {

    const user =
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      );

    if (user) {

      setFormData({

        customerName:
          user.name || "",

        email:
          user.email || "",

        phone: "",

        address: "",

      });

    }

  }, []);

  const handleChange = (
    e
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  const totalPrice =
    cart.reduce(

      (total, item) =>

        total +
        item.price *
          (item.quantity || 1),

      0

    );

  const placeOrder =
    async () => {

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        toast.error(
          "Please Login First"
        );

        navigate("/login");

        return;

      }

      try {

        setLoading(true);

       const orderData = {
  customerName: formData.customerName,
  email: formData.email,
  phone: formData.phone,
  address: formData.address,
  deliveryDate: formData.deliveryDate,
  products: cart,
  totalPrice,
};

        const response =
          await axios.post(

            "https://rentmojo-snqg.onrender.com/orders",

            orderData,

            {

              headers: {

                authorization:
                  token,

              },

            }

          );

        console.log(
          response.data
        );

        toast.success(
          "Order Placed Successfully"
        );

        setCart([]);

        localStorage.removeItem(
          "cart"
        );

        setTimeout(() => {

          navigate("/history");

        }, 2000);

      } catch (error) {

        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Order Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <ToastContainer />

      <h1 className="text-5xl font-bold text-green-500 mb-10">

        Checkout

      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        <div className="bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold mb-8">

            Customer Details

          </h2>

          <div className="flex flex-col gap-5">

            <input
              type="text"
              name="customerName"
              placeholder="Full Name"
              value={
                formData.customerName
              }
              onChange={
                handleChange
              }
              className="border p-4 rounded-xl"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              className="border p-4 rounded-xl"
            />

            <textarea
              name="address"
              placeholder="Address"
              rows="5"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              className="border p-4 rounded-xl"
            />

             

<input
  type="date"
  name="deliveryDate"
  value={formData.deliveryDate}
  onChange={handleChange}
  className="border p-4 rounded-xl"
/>



            <button
              onClick={
                placeOrder
              }
              disabled={loading}
              className="bg-green-500 text-white py-4 rounded-xl text-xl"
            >

             {loading
  ? "Booking Rental..."
  : "Confirm Rental Booking (COD)"}

            </button>

          </div>

        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold mb-8">

            Order Summary

          </h2>

          <div className="flex flex-col gap-5">

            {cart.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="flex justify-between border-b pb-4"
                >

                  <div>

                    <h2 className="font-bold text-xl">

                      {item.name}

                    </h2>

                    <p>

                      Qty:
                      {" "}
                      {item.quantity || 1}

                    </p>

                  </div>

                  <h2 className="font-bold text-green-500 text-xl">

                    ₹
                    {item.price *
                      (item.quantity || 1)}

                  </h2>

                </div>

              )
            )}

          </div>

       <div className="mt-10 flex justify-between text-3xl font-bold">

  <span>Total</span>

  <span className="text-green-500">
    ₹{totalPrice}
  </span>

</div>

<div className="mt-4">
  <h3 className="text-lg font-semibold">
    Payment Method:
    <span className="text-green-500">
      {" "}Cash On Delivery (COD)
    </span>
  </h3>
</div>
          </div>

        </div>

      </div>

    

  );

}

export default Checkout;
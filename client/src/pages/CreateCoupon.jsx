import {
  useState,
} from "react";

import axios from "axios";

import {
  toast,
  ToastContainer,
} from "react-toastify";

function CreateCoupon() {

  const [coupon, setCoupon] =
    useState({

      code: "",

      discount: "",

      expiryDate: "",

    });

  const handleChange = (e) => {

    setCoupon({

      ...coupon,

      [e.target.name]:
        e.target.value,

    });

  };

  const createCoupon =
    async (e) => {

      e.preventDefault();

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(

          "https://rentmojo-snqg.onrender.com/coupons",

          coupon,

          {

            headers: {

              authorization:
                token,

            },

          }

        );

        toast.success(
          "Coupon Created"
        );

        setCoupon({

          code: "",

          discount: "",

          expiryDate: "",

        });

      } catch (error) {

        console.log(error);

        toast.error(
          error.response.data.message
        );

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <ToastContainer />

      <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-xl">

        <h1 className="text-5xl font-bold text-green-500 mb-10">

          Create Coupon

        </h1>

        <form
          onSubmit={createCoupon}
          className="flex flex-col gap-5"
        >

          <input
            type="text"
            name="code"
            placeholder="Coupon Code"
            value={coupon.code}
            onChange={handleChange}
            className="border p-4 rounded-xl"
            required
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount %"
            value={coupon.discount}
            onChange={handleChange}
            className="border p-4 rounded-xl"
            required
          />

          <input
            type="date"
            name="expiryDate"
            value={coupon.expiryDate}
            onChange={handleChange}
            className="border p-4 rounded-xl"
            required
          />

          <button
            type="submit"
            className="bg-green-500 text-white py-4 rounded-xl"
          >

            Create Coupon

          </button>

        </form>

      </div>

    </div>

  );

}

export default CreateCoupon;
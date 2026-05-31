import { useState } from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Register() {

  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      password: "",

    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  const handleRegister =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const response =
          await axios.post(

            "http://localhost:5000/register",

            formData
          );

        toast.success(

          response.data.message
        );

        setTimeout(() => {

          navigate("/login");

        }, 1500);

      } catch (error) {

        toast.error(

          error.response?.data
            ?.message ||
            "Registration Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">

      <ToastContainer />

      <form
        onSubmit={
          handleRegister
        }
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md"
      >

        <h1 className="text-4xl font-bold text-center text-green-500 mb-10">

          Register

        </h1>

        <div className="flex flex-col gap-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
            className="border p-4 rounded-xl outline-none"
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
            className="border p-4 rounded-xl outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            className="border p-4 rounded-xl outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg"
          >

            {loading
              ? "Registering..."
              : "Register"}

          </button>

        </div>

      </form>

    </div>

  );

}

export default Register;
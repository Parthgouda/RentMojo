import { useState } from "react";

import axios from "axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  toast,
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Login() {

  const navigate =
    useNavigate();

  const [darkMode, setDarkMode] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      email: "",

      password: "",

    });

  const handleChange = (
    e
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  const handleLogin =
    async (e) => {

      e.preventDefault();

      if (
        !formData.email ||
        !formData.password
      ) {

        toast.error(
          "Please Fill All Fields"
        );

        return;

      }

      try {

        setLoading(true);

        const response =
          await axios.post(

            "https://rentmojo-snqg.onrender.com/login",

            formData

          );

        localStorage.setItem(

          "token",

          response.data.token

        );

        localStorage.setItem(

          "user",

          JSON.stringify(
            response.data.user
          )

        );

        toast.success(
          "Login Successful"
        );

        setTimeout(() => {

          navigate("/");

        }, 1500);

      } catch (error) {

        console.log(error);

        toast.error(

          error.response?.data
            ?.message ||
            "Login Failed"

        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      className={`min-h-screen flex justify-center items-center p-5 transition-all duration-300 ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      <ToastContainer />

      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl p-10 ${
          darkMode
            ? "bg-gray-900"
            : "bg-white"
        }`}
      >

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold text-green-500">

            Login

          </h1>

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm"
          >

            {darkMode
              ? "Light"
              : "Dark"}

          </button>

        </div>

        <form
          onSubmit={
            handleLogin
          }
          className="flex flex-col gap-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            className="border p-4 rounded-xl outline-none text-black"
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
            className="border p-4 rounded-xl outline-none text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg font-semibold"
          >

            {loading
              ? "Logging In..."
              : "Login"}

          </button>

        </form>

        <p className="text-center mt-8 text-gray-500">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-green-500 font-semibold hover:underline"
          >

            Register

          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;
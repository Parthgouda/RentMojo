import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const handleLogin = (e) => {

    e.preventDefault();

    if (
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {

      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      localStorage.setItem(
        "token",
        "admin-token"
      );

      alert(
        "Admin Login Successful ✅"
      );

      navigate("/admin");

    } else {

      alert(
        "Invalid Admin Credentials ❌"
      );

    }

  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md"
      >

        <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-4 rounded-xl mb-5 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-4 rounded-xl mb-5 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-xl"
        >
          Login
        </button>

      </form>

    </div>

  );

}

export default AdminLogin;
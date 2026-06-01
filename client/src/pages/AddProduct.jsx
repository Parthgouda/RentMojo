import {
  useState,
} from "react";

import axios from "axios";

import {
  toast,
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function AddProduct() {

  const [loading, setLoading] =
    useState(false);

  const [preview, setPreview] =
    useState("");

  const [formData, setFormData] =
    useState({

      name: "",

      price: "",

      category: "",

      image: null,

    });

  /* INPUT CHANGE */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  /* IMAGE CHANGE */

  const handleImageChange =
    (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      setFormData({

        ...formData,

        image: file,

      });

      setPreview(

        URL.createObjectURL(file)

      );

    };

  /* SUBMIT */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!formData.image) {

        toast.error(
          "Please Upload Image"
        );

        return;

      }

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const data =
          new FormData();

        data.append(
          "name",
          formData.name
        );

        data.append(
          "price",
          formData.price
        );

        data.append(
          "category",
          formData.category
        );

        data.append(
          "image",
          formData.image
        );

        const response =
          await axios.post(

            "https://rentmojo-snqg.onrender.com/products",

            data,

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
          "Product Added Successfully"
        );

        setFormData({

          name: "",

          price: "",

          category: "",

          image: null,

        });

        setPreview("");

      } catch (error) {

        console.log(error);

        toast.error(

          error.response?.data
            ?.message ||

          "Failed To Add Product"

        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <ToastContainer />

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-10">

        <h1 className="text-5xl font-bold text-green-500 mb-10">

          Add Product

        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-4 rounded-xl outline-none"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-4 rounded-xl outline-none"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-4 rounded-xl outline-none"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
            className="border p-4 rounded-xl"
            required
          />

          {/* IMAGE PREVIEW */}

          {preview && (

            <img
              src={preview}
              alt="Preview"
              className="w-60 rounded-2xl shadow-lg"
            />

          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-xl"
          >

            {loading
              ? "Adding Product..."
              : "Add Product"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default AddProduct;
import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  toast,
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function EditProduct() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [imageLoading, setImageLoading] =
    useState(false);

  const [imageFile, setImageFile] =
    useState(null);

  const [formData, setFormData] =
    useState({

      name: "",

      price: "",

      category: "",

      image: "",

    });

  useEffect(() => {

    fetchProduct();

  }, []);

  const fetchProduct =
    async () => {

      try {

        const response =
          await axios.get(

            `http://localhost:5000/products/${id}`

          );

        setFormData(
          response.data.product
        );

      } catch (error) {

        console.log(error);

      }

    };

  const handleChange = (
    e
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  const handleImageChange = (
    e
  ) => {

    setImageFile(
      e.target.files[0]
    );

  };

  const uploadImage =
    async () => {

      if (!imageFile)
        return formData.image;

      try {

        setImageLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const imageData =
          new FormData();

        imageData.append(
          "image",
          imageFile
        );

        const response =
          await axios.post(

            "http://localhost:5000/upload",

            imageData,

            {

              headers: {

                authorization:
                  token,

                "Content-Type":
                  "multipart/form-data",

              },

            }

          );

        return response.data.imageUrl;

      } catch (error) {

        console.log(error);

        toast.error(
          "Image Upload Failed"
        );

      } finally {

        setImageLoading(false);

      }

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const imageUrl =
          await uploadImage();

        const updatedData = {

          ...formData,

          image: imageUrl,

        };

        await axios.put(

          `http://localhost:5000/products/${id}`,

          updatedData,

          {

            headers: {

              authorization:
                token,

            },

          }

        );

        toast.success(
          "Product Updated"
        );

        setTimeout(() => {

          navigate(
            "/admin-products"
          );

        }, 1500);

      } catch (error) {

        console.log(error);

        toast.error(
          "Update Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <ToastContainer />

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10">

        <h1 className="text-5xl font-bold text-green-500 mb-10">

          Edit Product

        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="flex flex-col gap-5"
        >

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={
              handleChange
            }
            className="border p-4 rounded-xl"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={
              handleChange
            }
            className="border p-4 rounded-xl"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={
              formData.category
            }
            onChange={
              handleChange
            }
            className="border p-4 rounded-xl"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
            className="border p-4 rounded-xl bg-white"
          />

          {formData.image && (

            <img
              src={formData.image}
              alt="preview"
              className="h-60 object-cover rounded-xl"
            />

          )}

          <button
            type="submit"
            disabled={
              loading ||
              imageLoading
            }
            className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-xl"
          >

            {loading
              ? "Updating..."
              : imageLoading
              ? "Uploading..."
              : "Update Product"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default EditProduct;
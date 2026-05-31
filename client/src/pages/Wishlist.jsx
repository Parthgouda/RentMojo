import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify";

function Wishlist() {

  const {
    wishlist,
    removeFromWishlist,
  } = useContext(WishlistContext);

  const { addToCart } =
    useContext(CartContext);

  const handleAddToCart = (
    product
  ) => {

    addToCart(product);

    toast.success(
      "Added To Cart"
    );

  };

  return (

    <div className="p-10 min-h-screen bg-gray-100">

      <ToastContainer />

      <h1 className="text-5xl font-bold text-pink-500 text-center mb-10">
        My Wishlist ❤️
      </h1>

      {wishlist.length === 0 ? (

        <div className="text-center text-2xl font-bold mt-20">
          Wishlist is Empty
        </div>

      ) : (

        <div className="flex flex-wrap gap-10 justify-center">

          {wishlist.map((product) => (

            <div
              key={product._id}
              className="bg-white shadow-xl rounded-2xl p-5 w-72 hover:scale-105 transition"
            >

              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-xl"
              />

              <h2 className="text-2xl font-bold mt-4">
                {product.name}
              </h2>

              <p className="text-gray-500 mt-2">
                {product.category}
              </p>

              <h3 className="text-xl font-bold mt-3 text-green-600">
                ₹{product.price}
              </h3>

              <button
                onClick={() =>
                  handleAddToCart(
                    product
                  )
                }
                className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
              >
                Add To Cart
              </button>

              <button
                onClick={() =>
                  removeFromWishlist(
                    product._id
                  )
                }
                className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default Wishlist;
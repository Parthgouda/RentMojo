function ProductCard() {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 w-80">

      <img
        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
        alt="Sofa"
        className="rounded-xl h-52 w-full object-cover"
      />

      <h2 className="text-2xl font-bold mt-4">
        Modern Sofa
      </h2>

      <p className="text-gray-600 mt-2">
        ₹999 / month
      </p>

      <button className="mt-4 bg-green-500 text-white px-5 py-2 rounded-xl">
        Rent Now
      </button>

    </div>
  );
}

export default ProductCard;
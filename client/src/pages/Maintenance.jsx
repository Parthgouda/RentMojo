import { useState } from "react";

function Maintenance() {

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {

    e.preventDefault();

    setSubmitted(true);

  };

  return (

    <div className="p-10 min-h-screen bg-gray-100">

      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-4xl font-bold text-center mb-8">
          Maintenance Request
        </h1>

        {submitted ? (

          <div className="bg-green-100 text-green-700 p-5 rounded-xl text-center">

            <h2 className="text-2xl font-bold">
              Request Submitted ✅
            </h2>

            <p className="mt-2">
              Our support team will contact you soon.
            </p>

          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >

            <input
              type="text"
              placeholder="Product Name"
              required
              className="border p-3 rounded-xl"
            />

            <textarea
              placeholder="Describe the issue..."
              required
              className="border p-3 rounded-xl h-32"
            />

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
            >
              Submit Request
            </button>

          </form>

        )}

      </div>

    </div>

  );

}

export default Maintenance;
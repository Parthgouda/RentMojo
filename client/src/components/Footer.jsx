function Footer() {

  return (

    <footer className="bg-black text-white mt-10">

      <div className="max-w-7xl mx-auto px-8 py-10 grid md:grid-cols-3 gap-10">

        <div>

          <h1 className="text-3xl font-bold text-green-400">
            RentMojo
          </h1>

          <p className="mt-4 text-gray-400">
            Affordable furniture and appliance
            rentals for students and working
            professionals.
          </p>

        </div>

        <div>

          <h2 className="text-2xl font-bold mb-4">
            Quick Links
          </h2>

          <ul className="flex flex-col gap-3 text-gray-400">

            <li>Home</li>

            <li>Cart</li>

            <li>History</li>

            <li>Support</li>

          </ul>

        </div>

        <div>

          <h2 className="text-2xl font-bold mb-4">
            Contact
          </h2>

          <p className="text-gray-400">
            support@rentmojo.com
          </p>

          <p className="text-gray-400 mt-2">
            +91 9876543210
          </p>

        </div>

      </div>

      <div className="border-t border-gray-700 py-4 text-center text-gray-500">

        © 2026 RentMojo. All rights reserved.

      </div>

    </footer>

  );

}

export default Footer;
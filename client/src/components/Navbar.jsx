import { Link } from "react-router-dom";

import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Menu,
  X,
} from "lucide-react";

import { CartContext }
  from "../context/CartContext";

import { WishlistContext }
  from "../context/WishlistContext";

import logo
  from "../assets/logo.png";

function Navbar() {

  const { cart } =
    useContext(CartContext);

  const { wishlist } =
    useContext(WishlistContext);

  const [user, setUser] =
    useState(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {

    const loggedUser =
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      );

    if (loggedUser) {

      setUser(loggedUser);

    }

  }, []);

  const logoutUser = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.reload();

  };

  return (

    <nav className="bg-black text-white shadow-xl sticky top-0 z-50 border-b border-gray-800">

      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >

          <img
            src={logo}
            alt="RentMojo Logo"
            className="w-14 h-14 object-contain"
          />

          <div>

            <h1 className="text-3xl font-extrabold text-green-400 tracking-wide">

              RentMojo

            </h1>

            <p className="text-xs text-gray-400">

              Rent Smart • Live Better

            </p>

          </div>

        </Link>

        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        <button
          className="md:hidden"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >

          {
            menuOpen
              ? <X size={30} />
              : <Menu size={30} />
          }

        </button>

        {/* =========================
            DESKTOP MENU
        ========================= */}

        <div className="hidden md:flex items-center gap-5 text-[15px] font-medium">

          <Link
            to="/"
            className="hover:text-green-400 transition"
          >
            Home
          </Link>

          <Link
            to="/cart"
            className="hover:text-green-400 transition flex items-center gap-2"
          >

            Cart

            <span className="bg-green-500 text-black px-2 py-1 rounded-full text-xs font-bold">

              {cart.length}

            </span>

          </Link>

          <Link
            to="/wishlist"
            className="hover:text-pink-400 transition flex items-center gap-2"
          >

            Wishlist

            <span className="bg-pink-500 text-black px-2 py-1 rounded-full text-xs font-bold">

              {wishlist.length}

            </span>

          </Link>

          <Link
            to="/history"
            className="hover:text-green-400 transition"
          >
            Rentals
          </Link>

          <Link
            to="/maintenance"
            className="hover:text-green-400 transition"
          >
            Maintenance
          </Link>

<Link
  to="/profile"
  className="font-semibold"
>
  Profile
</Link>

          <Link
            to="/admin"
            className="hover:text-green-400 transition"
          >
            Admin
          </Link>

          <Link
            to="/admin-products"
            className="hover:text-green-400 transition"
          >
            Products
          </Link>

          <Link
            to="/admin-orders"
            className="hover:text-green-400 transition"
          >
            Orders
          </Link>

          {!user ? (

            <div className="flex gap-3">

              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl transition font-semibold"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl transition font-semibold"
              >
                Register
              </Link>

            </div>

          ) : (

            <div className="flex items-center gap-4">

              <div className="text-right">

                <h2 className="text-green-400 font-bold">

                  Hi,
                  {" "}
                  {user.name}

                </h2>

                <p className="text-xs text-gray-400">

                  Welcome Back 👋

                </p>

              </div>

              <button
                onClick={logoutUser}
                className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl transition font-semibold"
              >

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}

      {menuOpen && (

        <div className="md:hidden bg-black border-t border-gray-800 px-6 py-5 flex flex-col gap-5 text-lg font-medium">

          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Home
          </Link>

          <Link
            to="/cart"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Cart ({cart.length})
          </Link>

          <Link
            to="/wishlist"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Wishlist ({wishlist.length})
          </Link>

          <Link
            to="/history"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Rentals
          </Link>

          <Link
            to="/maintenance"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Maintenance
          </Link>

<Link
  to="/profile"
  className="font-semibold"
>
  Profile
</Link>

          <Link
            to="/admin"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Admin
          </Link>

          <Link
            to="/admin-products"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Products
          </Link>

          <Link
            to="/admin-orders"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Orders
          </Link>

          {!user ? (

            <div className="flex flex-col gap-3">

              <Link
                to="/login"
                className="bg-green-500 text-center py-3 rounded-xl"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-500 text-center py-3 rounded-xl"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Register
              </Link>

            </div>

          ) : (

            <button
              onClick={logoutUser}
              className="bg-red-500 py-3 rounded-xl"
            >

              Logout

            </button>

          )}

        </div>

      )}

    </nav>

  );

}

export default Navbar;
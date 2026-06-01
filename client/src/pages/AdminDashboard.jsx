import { useEffect, useState } from "react";

import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import {
  Link,
  useNavigate,
} from "react-router-dom";

function AdminDashboard() {

  const navigate =
    useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(false);

  /* =========================
     USE EFFECT
  ========================= */

  useEffect(() => {

  const isAdmin =
  localStorage.getItem(
    "adminLoggedIn"
  );
  if (!isAdmin) {

    navigate("/admin-login");
    return;

  }

  fetchOrders();
  fetchProducts();
  fetchAnalytics();

}, []);

  /* =========================
     FETCH ANALYTICS
  ========================= */

  const fetchAnalytics =
    async () => {

      try {

        const token =
  localStorage.getItem(
    "adminToken"
  );
        const res =
          await axios.get(

            "https://rentmojo-snqg.onrender.com/admin/analytics",

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

              },
            }

          );

        console.log(
          "ANALYTICS =>",
          res.data
        );

        setAnalytics(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  /* =========================
     FETCH ORDERS
  ========================= */

  const fetchOrders =
    async () => {

      try {

       const token =
  localStorage.getItem(
    "adminToken"
  );
        const response =
          await axios.get(

           "https://rentmojo-snqg.onrender.com/admin/orders",

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

              },
            }

          );

        setOrders(
          response.data.orders
        );

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

      }

    };

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts =
    async () => {

      try {

        const response =
          await axios.get(

            "https://rentmojo-snqg.onrender.com/products"

          );

        setProducts(
          response.data.products
        );

      } catch (error) {

        console.log(error);

      }

    };

  /* =========================
     FILTER ORDERS
  ========================= */

  const filteredOrders =
    orders.filter((order) =>

      order.customerName
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

    );

  /* =========================
     TOTALS
  ========================= */

  const totalRevenue =
    filteredOrders.reduce(

      (total, order) =>

        total +
        order.totalPrice,

      0

    );

  const totalCustomers =
    filteredOrders.length;

  /* =========================
     CHART DATA
  ========================= */

  const chartData =
    filteredOrders.map(
      (order, index) => ({

        name:
          `Order ${index + 1}`,

        revenue:
          order.totalPrice,

      })
    );

  const pieData = [

    {
      name: "Revenue",
      value: totalRevenue,
    },

    {
      name: "Customers",
      value: totalCustomers,
    },

  ];

  const COLORS = [
    "#22c55e",
    "#3b82f6",
  ];

  /* =========================
     DOWNLOAD PDF
  ========================= */

  const downloadPDF =
    () => {

      const doc =
        new jsPDF();

      doc.text(
        "RentMojo Orders Report",
        20,
        20
      );

      const tableColumn = [

        "Customer",
        "Price",

      ];

      const tableRows = [];

      filteredOrders.forEach(
        (order) => {

          tableRows.push([

            order.customerName,

            `₹${order.totalPrice}`,

          ]);

        }
      );

      autoTable(doc, {

        head: [tableColumn],

        body: tableRows,

        startY: 30,

      });

      doc.save(
        "orders.pdf"
      );

      toast.success(
        "PDF Downloaded"
      );

    };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const deleteProduct =
    async (id) => {

      try {

       const token =
  localStorage.getItem(
    "adminToken"
  );
        await axios.delete(

          `https://rentmojo-snqg.onrender.com/products/${id}`,

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

            },
          }

        );

        toast.success(
          "Product Deleted"
        );

        fetchProducts();

      } catch (error) {

        console.log(error);

      }

    };

const updateStatus = async (
  orderId,
  status
) => {

  try {

    await axios.put(

      `https://rentmojo-snqg.onrender.com/admin/orders/${orderId}`,

      { status }

    );

    toast.success(
      `Order ${status}`
    );

    fetchOrders();

  } catch (error) {

    console.log(error);

  }

};

  /* =========================
     LOGOUT
  ========================= */

  const logoutAdmin = () => {

 localStorage.removeItem(
  "adminLoggedIn"
);

localStorage.removeItem(
  "adminToken"
);

  navigate(
    "/admin-login"
  );

};
  return (

    <div
      className={`p-10 min-h-screen ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      <ToastContainer />

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold text-green-500">
          Admin Dashboard
        </h1>

        <div className="flex gap-4">

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            className="bg-gray-800 text-white px-5 py-3 rounded-xl"
          >

            {darkMode
              ? "Light Mode"
              : "Dark Mode"}

          </button>

          <button
            onClick={
              downloadPDF
            }
            className="bg-red-500 text-white px-5 py-3 rounded-xl"
          >

            Download PDF

          </button>

          <Link
            to="/add-product"
            className="bg-blue-500 text-white px-5 py-3 rounded-xl"
          >

            Add Product

          </Link>

          <button
            onClick={
              logoutAdmin
            }
            className="bg-black text-white px-5 py-3 rounded-xl"
          >

            Logout

          </button>

        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search Customer..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
        className="w-full md:w-96 p-4 rounded-xl border mb-10 text-black"
      />

      {/* LOADING */}

      {loading ? (

        <h1 className="text-3xl font-bold">
          Loading...
        </h1>

      ) : (

        <>

          {/* STATS */}

          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white p-8 rounded-2xl shadow-xl text-black">

              <h2 className="text-2xl font-bold">
                Orders
              </h2>

              <h1 className="text-5xl font-bold mt-4 text-green-600">
                {filteredOrders.length}
              </h1>

            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl text-black">

              <h2 className="text-2xl font-bold">
                Revenue
              </h2>

              <h1 className="text-5xl font-bold mt-4 text-blue-600">
                ₹{totalRevenue}
              </h1>

            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl text-black">

              <h2 className="text-2xl font-bold">
                Customers
              </h2>

              <h1 className="text-5xl font-bold mt-4 text-purple-600">
                {totalCustomers}
              </h1>

            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl text-black">

              <h2 className="text-2xl font-bold">
                Products
              </h2>

              <h1 className="text-5xl font-bold mt-4 text-orange-500">
                {products.length}
              </h1>

            </div>

          </div>


{/* =========================
    ORDER MANAGEMENT
========================= */}

<div className="mt-10 bg-white text-black p-8 rounded-2xl shadow-xl">

  <h1 className="text-3xl font-bold mb-5">
    Manage Orders
  </h1>

  <div className="overflow-x-auto">

    <table className="w-full border">

      <thead>

        <tr className="bg-gray-200">

          <th className="p-3">Customer</th>

          <th className="p-3">Amount</th>

          <th className="p-3">Status</th>

          <th className="p-3">Action</th>

        </tr>

      </thead>

      <tbody>

        {orders.map((order) => (

          <tr
            key={order._id}
            className="border-b text-center"
          >

            <td className="p-3">
              {order.customerName}
            </td>

            <td className="p-3">
              ₹{order.totalPrice}
            </td>

            <td className="p-3">

              <span className="font-bold text-blue-600">
                {order.status}
              </span>

            </td>

            <td className="p-3 flex gap-2 justify-center">

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "Confirmed"
                  )
                }
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Confirm
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "Shipped"
                  )
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Ship
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "Delivered"
                  )
                }
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Deliver
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>


          {/* ANALYTICS */}

          {analytics && (

            <div className="mt-10 bg-white text-black p-8 rounded-2xl shadow-xl">

              <h1 className="text-3xl font-bold mb-5">
                Analytics
              </h1>

              <p>Total Orders: {analytics.totalOrders}</p>

              <p>Total Products: {analytics.totalProducts}</p>

              <p>Total Users: {analytics.totalUsers}</p>

              <p>Total Revenue: ₹{analytics.totalRevenue}</p>

            </div>

          )}

          {/* CHARTS */}

          <div className="grid md:grid-cols-2 gap-10 mt-10">

            <div className="bg-white p-6 rounded-2xl shadow-xl">

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart data={chartData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="revenue"
                    fill="#22c55e"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl">

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >

                    {pieData.map(
                      (entry, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[index]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </>

      )}

    </div>

  );

}

export default AdminDashboard;
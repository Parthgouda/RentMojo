import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  toast,
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH ORDERS
  ========================= */

  const fetchOrders =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
         await axios.get(
  "http://localhost:5000/admin/orders",
            {
              headers: {
                authorization:
                  token,
              },
            }

          );

        setOrders(
          response.data.orders
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed To Load Orders"
        );

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchOrders();

  }, []);

  /* =========================
     UPDATE STATUS
  ========================= */

  const updateStatus =
    async (
      id,
      status
    ) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
  `http://localhost:5000/admin/orders/${id}`,
          { status },

          {
            headers: {
              authorization:
                token,
            },
          }

        );

        toast.success(
          "Order Status Updated ✅"
        );

        fetchOrders();

      } catch (error) {

        console.log(error);

        toast.error(
          "Status Update Failed"
        );

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <ToastContainer />

      <h1 className="text-5xl font-bold text-green-500 mb-10">

        Admin Orders

      </h1>

      {loading ? (

        <h2 className="text-2xl font-bold">

          Loading Orders...

        </h2>

      ) : orders.length === 0 ? (

        <h2 className="text-2xl font-bold text-red-500">

          No Orders Found

        </h2>

      ) : (

        <div className="grid gap-8">

          {orders.map(
            (order) => (

              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-xl p-8"
              >

                {/* HEADER */}

                <div className="flex justify-between items-center flex-wrap gap-5">

                  <div>

                    <h2 className="text-3xl font-bold">

                      {
                        order.customerName
                      }

                    </h2>

                    <p className="text-gray-500 mt-2">

                      {
                        order.email
                      }

                    </p>

                    <p className="text-gray-500">

                      {
                        order.phone
                      }

                    </p>

                  </div>

                  <div className="text-right">

                    <h2 className="text-4xl font-bold text-green-500">

                      ₹
                      {
                        order.totalPrice
                      }

                    </h2>

                    <p className="text-gray-500 mt-2">

                      {
                        new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      }

                    </p>

                  </div>

                </div>

                {/* ADDRESS */}

                <div className="mt-6 bg-gray-100 p-5 rounded-2xl">

                  <h2 className="text-xl font-bold mb-2">

                    Delivery Address

                  </h2>

                  <p className="text-gray-700">

                    {
                      order.address
                    }

                  </p>

                </div>

                {/* PRODUCTS */}

                <div className="mt-8">

                  <h2 className="text-2xl font-bold mb-5">

                    Ordered Products

                  </h2>

                  <div className="flex flex-col gap-5">

                    {order.products.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="flex items-center gap-5 border p-4 rounded-2xl"
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 rounded-xl object-cover"
                          />

                          <div className="flex-1">

                            <h2 className="text-2xl font-bold">

                              {
                                item.name
                              }

                            </h2>

                            <p className="text-gray-500 mt-1">

                              Category:
                              {" "}
                              {
                                item.category
                              }

                            </p>

                            <p className="text-gray-500">

                              Quantity:
                              {" "}
                              {
                                item.quantity || 1
                              }

                            </p>

                          </div>

                          <h2 className="text-2xl font-bold text-green-500">

                            ₹
                            {
                              item.price *
                              (item.quantity || 1)
                            }

                          </h2>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* STATUS */}

                <div className="mt-8 flex items-center gap-5 flex-wrap">

                  <h2 className="text-2xl font-bold">

                    Order Status:

                  </h2>

                  <select
                    value={
                      order.status
                    }
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                    className="border-2 border-green-500 p-3 rounded-xl outline-none text-lg"
                  >

                    <option>
                      Pending
                    </option>

                    <option>
                      Confirmed
                    </option>

                    <option>
                      Shipped
                    </option>

                    <option>
  Out For Delivery
</option>

                    <option>
                      Delivered
                    </option>

                    <option>
                      Cancelled
                    </option>

                  </select>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}

export default AdminOrders;
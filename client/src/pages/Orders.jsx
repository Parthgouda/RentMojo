import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function Orders() {

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(

            "https://rentmojo-snqg.onrender.com/orders",

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

      }

    };

  const getStepColor =
    (current, target) => {

      const steps = [

        "Pending",

        "Confirmed",

        "Shipped",

        "Delivered",

      ];

      return steps.indexOf(
        current
      ) >=
        steps.indexOf(target)

        ? "bg-green-500"

        : "bg-gray-300";

    };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-bold text-green-500 mb-10">

        My Orders

      </h1>

      <div className="flex flex-col gap-8">

        {orders.map(
          (order) => (

            <div
              key={order._id}
              className="bg-white p-8 rounded-3xl shadow-xl"
            >

              <h2 className="text-3xl font-bold">

                {
                  order.customerName
                }

              </h2>

              <p className="mt-2 text-gray-600">

                {order.email}

              </p>

              <h3 className="mt-5 text-2xl font-bold text-green-500">

                ₹
                {
                  order.totalPrice
                }

              </h3>

              <div className="mt-10 flex items-center justify-between">

                {/* Pending */}

                <div className="flex flex-col items-center">

                  <div
                    className={`w-12 h-12 rounded-full ${getStepColor(
                      order.status,
                      "Pending"
                    )}`}
                  ></div>

                  <p className="mt-2">
                    Pending
                  </p>

                </div>

                <div className="flex-1 h-2 bg-gray-300"></div>

                {/* Confirmed */}

                <div className="flex flex-col items-center">

                  <div
                    className={`w-12 h-12 rounded-full ${getStepColor(
                      order.status,
                      "Confirmed"
                    )}`}
                  ></div>

                  <p className="mt-2">
                    Confirmed
                  </p>

                </div>

                <div className="flex-1 h-2 bg-gray-300"></div>

                {/* Shipped */}

                <div className="flex flex-col items-center">

                  <div
                    className={`w-12 h-12 rounded-full ${getStepColor(
                      order.status,
                      "Shipped"
                    )}`}
                  ></div>

                  <p className="mt-2">
                    Shipped
                  </p>

                </div>

                <div className="flex-1 h-2 bg-gray-300"></div>

                {/* Delivered */}

                <div className="flex flex-col items-center">

                  <div
                    className={`w-12 h-12 rounded-full ${getStepColor(
                      order.status,
                      "Delivered"
                    )}`}
                  ></div>

                  <p className="mt-2">
                    Delivered
                  </p>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}

export default Orders;
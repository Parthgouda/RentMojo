import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function RentalHistory() {

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

            "http://localhost:5000/orders",

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

  const getStatusColor =
    (status) => {

      switch (status) {

        case "Pending":
          return "bg-yellow-500";

        case "Confirmed":
          return "bg-blue-500";

        case "Shipped":
          return "bg-purple-500";

        case "Out For Delivery":
          return "bg-orange-500";

        case "Delivered":
          return "bg-green-500";

        case "Cancelled":
          return "bg-red-500";

        default:
          return "bg-gray-500";

      }

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

              {/* TOP */}

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

                </div>

                <div>

                  <h2 className="text-3xl font-bold text-green-500">

                    ₹
                    {
                      order.totalPrice
                    }

                  </h2>

                </div>

              </div>

              {/* STATUS */}

              <div className="mt-8">

                <span className={`

                  px-5
                  py-2
                  rounded-full
                  text-white
                  font-bold

                  ${getStatusColor(
                    order.status
                  )}

                `}>

                  {
                    order.status
                  }

                </span>

              </div>

              <div className="mt-4">

  <h3 className="text-lg font-semibold">

    Delivery Date:

    <span className="text-green-500">

      {" "}
      {order.deliveryDate
        ? new Date(
            order.deliveryDate
          ).toLocaleDateString()
        : "Not Selected"}

    </span>

  </h3>

</div>

              {/* PRODUCTS */}

              <div className="mt-10">

                <h2 className="text-2xl font-bold mb-5">

                  Products

                </h2>

                <div className="grid md:grid-cols-2 gap-5">

                  {order.products.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="border p-4 rounded-2xl flex gap-5 items-center"
                      >

                        <img
                          src={
                            item.image
                          }
                          alt=""
                          className="w-24 h-24 object-cover rounded-xl"
                        />

                        <div>

                          <h2 className="text-xl font-bold">

                            {
                              item.name
                            }

                          </h2>

                          <p className="text-gray-500">

                            {
                              item.category
                            }

                          </p>

                          <h2 className="text-green-500 font-bold mt-2">

                            ₹
                            {
                              item.price
                            }

                          </h2>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* TRACKING TIMELINE */}

              <div className="mt-12">

                <h2 className="text-2xl font-bold mb-8">

                  Order Timeline

                </h2>

                <div className="flex flex-col gap-6">

                  {order.trackingTimeline?.map(
                    (
                      track,
                      index
                    ) => (

                      <div
                        key={index}
                        className="flex gap-5"
                      >

                        <div className="flex flex-col items-center">

                          <div className={`

                            w-5
                            h-5
                            rounded-full

                            ${getStatusColor(
                              track.status
                            )}

                          `}></div>

                          {index !==
                            order.trackingTimeline.length - 1 && (

                            <div className="w-1 h-16 bg-gray-300"></div>

                          )}

                        </div>

                        <div>

                          <h2 className="text-xl font-bold">

                            {
                              track.status
                            }

                          </h2>

                          <p className="text-gray-600">

                            {
                              track.message
                            }

                          </p>

                          <p className="text-sm text-gray-400 mt-1">

                            {
                              new Date(
                                track.time
                              ).toLocaleString()
                            }

                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}

export default RentalHistory;
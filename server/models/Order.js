const mongoose =
  require("mongoose");

const orderSchema =
  new mongoose.Schema(

    {

      /* =========================
         CUSTOMER DETAILS
      ========================= */

      customerName: {

        type: String,

        required: true,

      },

      email: {

        type: String,

        required: true,

      },

      phone: {

        type: String,

        required: true,

      },

      address: {

        type: String,

        required: true,

      },

      deliveryDate: {

  type: Date,

  required: true,

},

      /* =========================
         PRODUCTS
      ========================= */

      products: [

        {

          name: {

            type: String,

            required: true,

          },

          price: {

            type: Number,

            required: true,

          },

          quantity: {

            type: Number,

            default: 1,

          },

          image: {

            type: String,

          },

          category: {

            type: String,

          },

        },

      ],

      /* =========================
         PAYMENT
      ========================= */

     totalPrice: {

  type: Number,

  required: true,

},

paymentMethod: {

  type: String,

  default: "COD",

},

paymentStatus: {

  type: String,

  default: "Pending",

},

coupon: {

  type: String,

  default: null,

},
      /* =========================
         USER ID
      ========================= */

      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },

      /* =========================
         ORDER STATUS
      ========================= */

      status: {

        type: String,

        enum: [

          "Pending",

          "Confirmed",

          "Shipped",

          "Out For Delivery",

          "Delivered",

          "Cancelled",

        ],

        default: "Pending",

      },

      /* =========================
         TRACKING TIMELINE
      ========================= */

      trackingTimeline: [

        {

          status: {

            type: String,

          },

          message: {

            type: String,

          },

          time: {

            type: Date,

            default: Date.now,

          },

        },

      ],

    },

    {

      timestamps: true,

    }

  );

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );
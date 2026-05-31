const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const Order = require("./models/Order");
const Product = require("./models/Product");
const User = require("./models/User");
const sendInvoice =
  require("./utils/sendInvoice");
const upload =
  require("./middleware/upload");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

/* =========================
   CREATE INVOICE FOLDER
========================= */

const invoiceFolder = path.join(
  __dirname,
  "invoices"
);

if (
  !fs.existsSync(
    invoiceFolder
  )
) {

  fs.mkdirSync(
    invoiceFolder,
    {
      recursive: true,
    }
  );

  console.log(
    "Invoices Folder Created ✅"
  );

}

/* =========================
   MONGODB CONNECTION
========================= */

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {

    console.log(
      "MongoDB Connected ✅"
    );

  })
  .catch((error) => {

    console.log(
      "Mongo Error =>",
      error.message
    );

  });

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {

  res.send(
    "Backend Running 🚀"
  );

});

/* =========================
   VERIFY TOKEN
========================= */

const verifyToken = (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({

        success: false,

        message:
          "No Token Provided",

      });

    }

    const token =
      authHeader.startsWith(
        "Bearer "
      )
        ? authHeader.split(" ")[1]
        : authHeader;

    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET

      );

    req.user = decoded;

    next();

  } catch (error) {

    console.log(
      "FULL JWT ERROR =>",
      error
    );

    return res.status(401).json({

      success: false,

      message:
        "Invalid Token",

    });

  }

};

/* =========================
   REGISTER
========================= */

app.post(

  "/register",

  async (req, res) => {

    try {

      const {

        name,

        email,

        password,

      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please Fill All Fields",

        });

      }

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({

          success: false,

          message:
            "User Already Exists",

        });

      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const newUser =
        new User({

          name,

          email,

          password:
            hashedPassword,

        });

      await newUser.save();

      res.status(201).json({

        success: true,

        message:
          "Registration Successful ✅",

      });

    } catch (error) {

      console.log(
        "Register Error =>",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }

);

/* =========================
   LOGIN
========================= */

app.post(

  "/login",

  async (req, res) => {

    try {

      const {

        email,

        password,

      } = req.body;

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please Fill All Fields",

        });

      }

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Credentials",

        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Credentials",

        });

      }

      const token =
        jwt.sign(

          {

            id: user._id,

            email:
              user.email,

          },

          process.env.JWT_SECRET,

          {

            expiresIn:
              "7d",

          }

        );

      res.json({

        success: true,

        message:
          "Login Successful ✅",

        token,

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

        },

      });

    } catch (error) {

      console.log(
        "Login Error =>",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }

);

/* =========================
   GET PRODUCTS
========================= */

app.get(

  "/products",

  async (req, res) => {

    try {

      const products =
        await Product.find().sort({

          createdAt: -1,

        });

      res.json({

        success: true,

        products,

      });

    } catch (error) {

      console.log(
        "Products Error =>",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }

);

/* =========================
   ADD PRODUCT
========================= */

app.post(

  "/products",

  verifyToken,

  upload.single("image"),

  async (req, res) => {

    try {

      const {

        name,

        category,

        price,

      } = req.body;

      if (
        !name ||
        !category ||
        !price ||
        !req.file
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please Fill All Fields",

        });

      }

      const newProduct =
        new Product({

          name,

          category,

          price,

          image:
            req.file.path,

        });

      await newProduct.save();

      res.status(201).json({

        success: true,

        message:
          "Product Added Successfully ✅",

        product:
          newProduct,

      });

    } catch (error) {

      console.log(
        "Add Product Error =>",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }

);

/* =========================
   PLACE ORDER
========================= */

app.post(

  "/orders",

  verifyToken,

  async (req, res) => {

    try {

      console.log(
        "ORDER BODY =>",
        req.body
      );

      const {

        customerName,

        email,

        phone,

        address,

        products,

        totalPrice,

      } = req.body;

      const newOrder =
        new Order({

          customerName,

          email,

          phone,

          address,

          products,

          totalPrice,

          status:
            "Pending",

          trackingTimeline: [

            {

              status:
                "Pending",

              message:
                "Order Placed Successfully",

              time:
                new Date(),

            },

          ],

          userId:
            req.user.id,

        });

     await newOrder.save();

console.log(
  "Order Saved ✅"
);

await sendInvoice(
  newOrder
);

res.status(201).json({
  success: true,
  message:
    "Order Placed Successfully ✅",
  order: newOrder,
});

    } catch (error) {

      console.log(
        "FULL ORDER ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }

);

/* =========================
   GET USER ORDERS
========================= */

app.get(

  "/orders",

  verifyToken,

  async (req, res) => {

    try {

      const orders =
        await Order.find({

          userId:
            req.user.id,

        }).sort({

          createdAt: -1,

        });

      res.json({

        success: true,

        orders,

      });

    } catch (error) {

      console.log(
        "Fetch Orders Error =>",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }

);

/* =========================
   ADMIN GET ALL ORDERS
========================= */

app.get(
  "/admin/orders",
  async (req, res) => {

    try {

      const orders =
        await Order.find()
        .sort({
          createdAt: -1,
        });

      res.json({

        success: true,

        orders,

      });

    } catch (error) {

      console.log(
        "Admin Orders Error =>",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }
);

/* =========================
   UPDATE ORDER STATUS
========================= */

app.put(
  "/admin/orders/:id",
  async (req, res) => {

    try {

      const { status } =
        req.body;

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order Not Found",

        });

      }

      order.status = status;

      order.trackingTimeline.push({

        status,

        message:
          `Order ${status}`,

        time:
          new Date(),

      });

      await order.save();

      res.json({

        success: true,

        message:
          "Status Updated",

        order,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }
);


/* =========================
   ADMIN ANALYTICS
========================= */

app.get(

  "/admin/analytics",

  //verifyToken,

  async (req, res) => {

    try {

      const totalOrders =
        await Order.countDocuments();

      const totalProducts =
        await Product.countDocuments();

      const totalUsers =
        await User.countDocuments();

      const orders =
        await Order.find();

      const totalRevenue =
        orders.reduce(

          (total, order) =>

            total +
            order.totalPrice,

          0

        );

      res.json({

        success: true,

        totalOrders,

        totalProducts,

        totalUsers,

        totalRevenue,

      });

    } catch (error) {

      console.log(
        "Analytics Error =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }

);

/* =========================
   SERVER
========================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT} 🚀`
  );

});
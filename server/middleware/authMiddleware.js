const jwt =
  require("jsonwebtoken");

const verifyToken =
  (
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

      let token;

      if (
        authHeader.startsWith(
          "Bearer "
        )
      ) {

        token =
          authHeader.split(" ")[1];

      } else {

        token =
          authHeader;

      }

      const verified =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        );

      req.user =
        verified;

      next();

    } catch (error) {

      console.log(
        "JWT Error =>",
        error.message
      );

      return res.status(401).json({

        success: false,

        message:
          "Invalid Token",

      });

    }

  };

module.exports =
  verifyToken;
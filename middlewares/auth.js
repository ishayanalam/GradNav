const { response } = require("express");

const isAuthorized = async (req, res, next) => {
  try {
    // Check if Authorization header exists and starts with "Bearer"
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer") ||
      !req.headers.authorization.split(" ")[1]
    ) {
      return res.status(422).json({
        message: "Please provide token",
      });
    }

    // If the token is present, call next() to move on to the next middleware
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  isAuthorized,
};

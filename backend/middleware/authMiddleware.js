const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // decoding the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedToken.id).select("-password");
      // console.log(req.user);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("NOT AUTH0RIZED, TOKEN FAILED");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("NOT AUTH0RIZED, no TOKEN ");
  }
});
module.exports = { protect };

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authTokenVerify = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.includes("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findOne({ _id: decodedToken.id }).select(
        "-password"
      ); //  Excluding password
      next();
    } catch {
      res.status(401);
      throw new Error("Authorization failed");
    }
  } else {
    res.status(401);
    throw new Error("Authorization failed");
  }
};

module.exports = { authTokenVerify };

const express = require("express");
const userModel = require("../models/userModel");
const {
  resgisterUser,
  loginUser,
  getUser,
} = require("../controllers/userControllers");
const { authTokenVerify } = require("../controllers/authController");

const router = express.Router();

router.get("/", authTokenVerify, getUser);
router.post("/signup", resgisterUser);
router.post("/login", loginUser);

module.exports = router;

const express = require("express");
const userModel = require("../models/userModel");
const { resgisterUser, loginUser } = require("../controllers/userControllers");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await userModel.find();
  res.send(users);
});

router.post("/signup", resgisterUser);
router.post("/login", loginUser);

module.exports = router;

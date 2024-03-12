const express = require("express");
const { authTokenVerify } = require("../controllers/authController");

const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");

const router = express.Router();

router.get("/:chatId", authTokenVerify, allMessages);
router.post("/", authTokenVerify, sendMessage);

module.exports = router;

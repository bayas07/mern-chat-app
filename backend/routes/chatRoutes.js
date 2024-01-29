const express = require("express");
const { authTokenVerify } = require("../controllers/authController");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeUser,
} = require("../controllers/chatController");

const router = express.Router();

router
  .post("/", authTokenVerify, accessChat)
  .get("/", authTokenVerify, fetchChat)
  .post("/createGroup", authTokenVerify, createGroupChat)
  .put("/renameGroup", authTokenVerify, renameGroup)
  .put("/groupAdd", authTokenVerify, addToGroup)
  .put("/groupRemove", authTokenVerify, removeUser);

module.exports = router;

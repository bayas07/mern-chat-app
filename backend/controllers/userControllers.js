const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const resgisterUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw Error("Name, Email and, Password are required");
  }
  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("User already exists");
  }

  const newUser = await User.create({ name, email, password, picture });
  if (newUser) {
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      picture: newUser.picture,
      token: generateToken(newUser?._id),
    });
  } else {
    res.status(400);
    throw new Error("Unable to create user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw Error("Email and Password are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Email doesn't exists");
  }
  const isPasswordMatches = await user.comparePassword(password);
  if (!isPasswordMatches) {
    res.status(400);
    throw new Error("Wrong password! Please try again");
  }
  const { id, name, email: userEmail, password: userPassword, picture } = user;
  res.status(201).json({
    id,
    name,
    email: userEmail,
    password: userPassword,
    picture,
  });
});

module.exports = { resgisterUser, loginUser };

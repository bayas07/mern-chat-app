const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400);
    throw new Error("usedId param is missing");
  }
  let chatExist = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chatExist = await User.populate(chatExist, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (chatExist.length > 0) {
    res.send(chatExist[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    const results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then((chats) => {
        return User.populate(chats, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
      });
    res.status(200).send(results);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { name, users, groupChatPicture } = req.body;
  if (!name || !users) {
    res.status(400);
    throw new Error("Please fill all the required fields");
  }
  if (users.length < 2) {
    res.status(400);
    throw new Error("Atleast add two members to create a group chat");
  }
  users.push(req.user._id);
  try {
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      groupChatPicture,
      users: users,
      groupAdmin: req.user._id,
    });
    const AllGroupChats = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(AllGroupChats);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatName, chatGroupId } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatGroupId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (updatedChat) {
    res.status(200).send(updatedChat);
  } else {
    res.status(400);
    throw new Error("Chat not found");
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatGroupId, userId } = req.body;
  const updatedChatGroup = await Chat.findByIdAndUpdate(
    chatGroupId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChatGroup) {
    res.status(200).send(updatedChatGroup);
  } else {
    res.status(400);
    throw new Error("Chat not found");
  }
});

const removeUser = asyncHandler(async (req, res) => {
  const { chatGroupId, userId } = req.body;
  const AllGroupChats = await Chat.findOne({ _id: chatGroupId })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!AllGroupChats) {
    res.status(400);
    throw new Error("Chat not found");
  }

  if (AllGroupChats.users.length < 3) {
    const chatGroup = await Chat.deleteOne({ _id: chatGroupId });
    if (chatGroup) {
      res.status(200).send({ data: "Group has been deleted successfully" });
    } else {
      res.status(400);
      throw new Error("Something went wrong");
    }
    return;
  }

  const isAdmin = AllGroupChats.groupAdmin._id.toString() === userId;
  const users = AllGroupChats.users.filter(
    (user) => user._id.toString() !== userId
  );
  const updateObj = isAdmin ? { users, groupAdmin: users[0] } : { users };
  const updatedGroup = await Chat.findByIdAndUpdate(chatGroupId, updateObj, {
    new: true,
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedGroup) {
    res.status(200).send(updatedGroup);
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeUser,
};

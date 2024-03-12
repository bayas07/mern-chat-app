const express = require("express");
const dotEnv = require("dotenv");
const socket = require("socket.io");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const path = require("path");

const app = express();
app.use(express.json());

dotEnv.config();
connectDb();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

/** Deployment */
const __dirName = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirName, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirName, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running...");
  });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  console.log(`App is running on port - ${PORT}`)
);

const io = socket(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user.id);
  });

  socket.on("join-chat", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send-message", (message) => {
    if (!message.chat.users) return;

    message.chat.users.forEach((user) => {
      if (user._id !== message.sender._id) {
        socket.in(user._id).emit("receive-message", message);
      }
    });
  });

  socket.on("typing", (roomId) => {
    socket.in(roomId).emit("typing", roomId);
  });

  socket.on("stopped-typing", (roomId) => {
    socket.in(roomId).emit("stopped-typing", roomId);
  });
});

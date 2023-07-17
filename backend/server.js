const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const { chats } = require("./data/data");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

// Configure express-session middleware
app.use(
  session({
    secret: "your-secret-key", // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json()); //to accept json data
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(errorHandler);
app.use(notFound);
connectDb();
const Port = process.env.PORT || 5000;
const server = app.listen(Port, () => {
  console.log(`server started on http://localhost:${Port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room:" + room);
  });
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender.id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

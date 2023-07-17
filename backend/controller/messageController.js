const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("invalid request data");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name dp");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name dp email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name dp email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessage };

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { generateOTP } = require("../helpers/otp");
const { sendVerificationEmail } = require("../helpers/sendVerificationEmail");
const argon2 = require("argon2");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, dp } = req.body;
  req.session.email = email;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await argon2.hash(password); // Encrypt the password using Argon2

  const user = await User.create({
    name,
    email,
    password: hashedPassword, // Save the encrypted password to the database
    dp,
    otp: generateOTP(),
    isVerified: false,
  });
  // Send the OTP to the user's email (using your preferred email service)
  sendVerificationEmail(email, user.otp);
  if (user) {
    console.log("user created successfully");
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dp: user.dp,
      token: generateToken(user._id),
      isVerified: false, // Set initial verification status to false
    });
  } else {
    res.status(400);
    throw new Error("user not created");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Email not found");
  }

  const isPasswordMatched = await argon2.verify(user.password, password); // Match the encrypted password with the provided password

  if (!isPasswordMatched) {
    res.status(400);
    throw new Error("Incorrect password");
  }

  // Both email and password are correct
  console.log("User login successful");
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    dp: user.dp,
    token: generateToken(user._id),
    isVerified: user.isVerified,
  });
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword)
    .select("-password")
    .find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const email = req.session.email; // Assuming you stored the email in the session

  // Check if email and OTP are provided
  if (!email || !otp) {
    res.status(400);
    throw new Error("Please provide email and OTP");
  }

  // Find the user by email
  const user = await User.findOne({ email });

  // Check if the user exists
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if the provided OTP matches the user's OTP
  if (user.otp !== otp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // Mark the user as verified
  console.log(req.session.email);
  user.isVerified = true;
  user.otp = "";
  req.session.email = "";
  console.log(req.session.email);

  // user.token = generateToken(user._id);
  await user.save();

  // Return the verified user data
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    dp: user.dp,
    otp: user.otp,
    isVerified: user.isVerified,
    token: user.token,
    // You can include any additional data you want to return
  });
});
const setSessionEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  req.session.email = email; // Set the session email

  res.sendStatus(200); // Send a success status code
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  verifyEmail,
  setSessionEmail,
};

const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  verifyEmail,
  setSessionEmail,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/login").post(authUser);
router.route("/verifyemail").put(verifyEmail);
router.route("/set-session-email").post(setSessionEmail);

router.route("/").get(protect, allUsers).post(registerUser);

module.exports = router;

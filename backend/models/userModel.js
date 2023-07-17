const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    isVerified: { type: Boolean, required: true },
    dp: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);
// Assuming your User model has a 'password' field

// Compare the provided password with the hashed password stored in the user document
// userModel.methods.matchpassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
// userModel.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });
const User = mongoose.model("User", userModel);

module.exports = User;

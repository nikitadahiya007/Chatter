const nodemailer = require("nodemailer");

// Create a transport object using the SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mail.verifydiggle@gmail.com",
    pass: `fazehltpvymabtau`,
  },
});

// Function to send the verification email
const sendVerificationEmail = async (email, otp) => {
  try {
    // Define the email content
    const mailOptions = {
      from: "mail.verifydiggle@gmail.com",
      to: email,
      subject: "Account Verification",
      text: `Your verification OTP is: ${otp}. Please use this OTP to verify your account.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

module.exports = { sendVerificationEmail };

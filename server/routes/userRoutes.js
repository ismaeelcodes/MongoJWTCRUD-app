const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  googleLogin,
  verifyOTP,
  forgetPass,
  verifyResetPassOTP,
  setNewPass,
  googleVerifier
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verifyOTP", verifyOTP)

router.post("/forgetPass", forgetPass)

router.post("/verifyReset", verifyResetPassOTP)

router.post("/setPass", setNewPass)

router.get("/current", validateToken, currentUser);

router.post("/google-login", googleLogin);

router.post("/google-login-verify", googleVerifier)

module.exports = router;

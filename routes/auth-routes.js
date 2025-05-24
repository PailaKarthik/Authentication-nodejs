const express = require("express");
const {
  loginUser,
  registerUser,
  changePassword,
} = require("../controllers/auth-controller");

const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware");

//all routes are related to authentication and authorization
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;

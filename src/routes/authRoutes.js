const express = require("express");
const {
  getCurrentUser,
  login,
  logout,
  register
} = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", logout);

module.exports = router;

const express = require("express");
const {
  getCurrentUser,
  login,
  logout,
  register,
  loginwithgoogle,
} = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/loginwithgoogle", loginwithgoogle);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", logout);

module.exports = router;

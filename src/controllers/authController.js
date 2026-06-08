const { User } = require("../models");
const { comparePassword, hashPassword } = require("../utils/password");
const sanitizeUser = require("../utils/sanitizeUser");
const {
  clearAuthCookie,
  setAuthCookie,
  signAuthToken,
} = require("../utils/authToken");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.scope("withPassword").findOne({
      where: {
        email,
      },
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    setAuthCookie(res, signAuthToken(user));

    return res.json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const register = async (req, res) => {
  const { first_name, last_name, phone_number, email, password } = req.body;

  try {
    if (!first_name || !last_name || !phone_number || !email || !password) {
      return res.status(400).json({
        error:
          "First name, last name, phone number, email, and password are required",
      });
    }

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const user = await User.create({
      first_name,
      last_name,
      phone_number,
      email,
      password: await hashPassword(password),
      user_type_id: 3,
      is_verified: false,
    });

    return res.status(201).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  return res.json({
    user: req.user,
  });
};

const logout = async (_req, res) => {
  clearAuthCookie(res);
  return res.json({ message: "Logged out successfully" });
};

module.exports = {
  login,
  register,
  getCurrentUser,
  logout,
};

const { User } = require("../models");
const { AUTH_COOKIE_NAME, verifyAuthToken } = require("../utils/authToken");

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return req.cookies?.[AUTH_COOKIE_NAME];
};

const authenticate = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid authentication token" });
  }
};

module.exports = authenticate;

require("../config/env");

const jwt = require("jsonwebtoken");

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "park_auth_token";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_MAX_AGE =
  Number(process.env.COOKIE_MAX_AGE_DAYS || 7) * 24 * 60 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET || "park-dev-jwt-secret-change-me";
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: COOKIE_MAX_AGE,
  path: "/",
};

const signAuthToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      user_type_id: user.user_type_id,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN },
  );

const verifyAuthToken = (token) => jwt.verify(token, JWT_SECRET);

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
};

const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...cookieOptions,
    maxAge: undefined,
  });
};

module.exports = {
  AUTH_COOKIE_NAME,
  signAuthToken,
  verifyAuthToken,
  setAuthCookie,
  clearAuthCookie,
};

const { User } = require("../models");
const { comparePassword, hashPassword } = require("../utils/password");
const sanitizeUser = require("../utils/sanitizeUser");
const {
  clearAuthCookie,
  setAuthCookie,
  signAuthToken,
} = require("../utils/authToken");

const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

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
      provider_status: false,
      status: true,
      google_id: null,
    });

    return res.status(201).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginwithgoogle = async (req, res) => {
  try {
    // 1. Validate the popup request.
    if (req.get("X-Requested-With") !== "XmlHttpRequest") {
      return res.status(403).json({
        message: "Invalid authentication request",
      });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Authorization code is required",
      });
    }

    // 2. Exchange the authorization code for Google tokens.
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    if (!tokens.id_token) {
      return res.status(401).json({
        message: "Google did not return an ID token",
      });
    }

    // 3. Verify the Google ID token.
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const profile = ticket.getPayload();

    if (!profile?.sub || !profile.email || profile.email_verified !== true) {
      return res.status(401).json({
        message: "Google account could not be verified",
      });
    }

    const googleId = profile.sub;
    const email = profile.email;
    const name = profile.name || "";

    // 4. First, look for an account already linked to this Google ID.
    let user = await User.findOne({
      where: { google_id: googleId },
    });

    if (user) {
      // Existing Google account: continue to the response.
    } else {
      // 5. Look for an existing account with the same email.
      user = await User.findOne({
        where: { email },
      });

      if (user) {
        // Don't link an account already linked to another Google ID.
        if (user.google_id && user.google_id !== googleId) {
          return res.status(409).json({
            message: "This email is already linked to another Google account.",
          });
        }

        // Link the existing account to Google.
        // This also follows your requested Google-login protocol.
        await user.update({
          google_id: googleId,
          password: null,
        });

        // Reload to ensure we return the updated database record.
        await user.reload();
      } else {
        // 6. Create a new Google user.
        user = await User.create({
          first_name: name,
          last_name: "",
          phone_number: "",
          email,
          password: null,
          user_type_id: 3,
          is_verified: false,
          provider_status: false,
          status: true,
          google_id: googleId,
        });
      }
    }

    setAuthCookie(res, signAuthToken(user));

    // 7. Return the user data for every successful login.
    return res.status(200).json({
      message: "Google login successful",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Google authentication failed:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });

    return res.status(401).json({
      message: "Google authentication failed",
    });
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
  loginwithgoogle,
};

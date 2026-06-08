const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const routes = require("./routes");
const env = require("./config/env");
const errorHandler = require("./middlewares/errorHandler");
const notFoundHandler = require("./middlewares/notFoundHandler");

const app = express();
const defaultDevelopmentOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];
const configuredOrigins = env.clientUrls
  ? env.clientUrls
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];
const allowedOrigins =
  env.nodeEnv === "production"
    ? configuredOrigins
    : configuredOrigins.concat(defaultDevelopmentOrigins);
const isOriginAllowed = (origin) => {
  if (!origin || env.nodeEnv !== "production") {
    return true;
  }

  return allowedOrigins.includes(origin);
};

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

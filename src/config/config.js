require("dotenv").config();

const sslOptions = {
  require: true,
  rejectUnauthorized: false,
};

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: sslOptions,
    },
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: sslOptions,
    },
    logging: false,
  },
};

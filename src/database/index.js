const { Sequelize } = require("sequelize");
const env = require("../config/env");

const sequelize = new Sequelize(env.databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl:
      env.nodeEnv === "production" || env.nodeEnv === "development"
        ? {
            require: true,
            rejectUnauthorized: false
          }
        : false
  }
});

module.exports = {
  sequelize,
  Sequelize
};

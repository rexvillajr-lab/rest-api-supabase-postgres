require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./database");
const env = require("./config/env");

const startServer = async () => {
  try {
    await sequelize.authenticate();

    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();

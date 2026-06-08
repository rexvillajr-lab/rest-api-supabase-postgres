const { sequelize } = require("../database");

const checkDatabase = async () => {
  await sequelize.query("SELECT 1");
  return "connected";
};

module.exports = {
  checkDatabase
};

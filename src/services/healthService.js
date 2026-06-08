const healthRepository = require("../repositories/healthRepository");

const check = async () => {
  const database = await healthRepository.checkDatabase();

  return {
    status: "ok",
    database
  };
};

module.exports = {
  check
};

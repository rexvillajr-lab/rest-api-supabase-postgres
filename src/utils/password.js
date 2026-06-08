const argon2 = require("argon2");

const hashPassword = (password) => {
  return argon2.hash(password);
};

const verifyPassword = (hash, password) => {
  return argon2.verify(hash, password);
};

const comparePassword = (password, hash) => {
  return verifyPassword(hash, password);
};

module.exports = {
  hashPassword,
  verifyPassword,
  comparePassword
};

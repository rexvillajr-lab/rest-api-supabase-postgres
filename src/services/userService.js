const HttpError = require("../utils/httpError");
const { hashPassword } = require("../utils/password");
const userRepository = require("../repositories/userRepository");

const createUser = async (payload) => {
  const userPayload = { ...payload };

  if (userPayload.password) {
    userPayload.password = await hashPassword(userPayload.password);
  }

  if (!userPayload.user_type_id) {
    userPayload.user_type_id = 3;
  }

  if (userPayload.provider_status === undefined) {
    userPayload.provider_status = userPayload.user_type_id === 2;
  }

  return userRepository.create(userPayload);
};

const getUsers = () => {
  return userRepository.findAll();
};

const getUserById = async (id) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

const updateUser = async (id, payload) => {
  const userPayload = { ...payload };

  if (userPayload.password) {
    userPayload.password = await hashPassword(userPayload.password);
  }

  if (
    userPayload.provider_status === undefined &&
    userPayload.user_type_id === 2
  ) {
    userPayload.provider_status = true;
  }

  const user = await userRepository.updateById(id, userPayload);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

const deleteUser = async (id) => {
  const user = await userRepository.deleteById(id);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};

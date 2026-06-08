const { User } = require("../models");

const create = (payload) => {
  return User.create(payload);
};

const findAll = () => {
  return User.findAll({
    order: [["created_at", "DESC"]]
  });
};

const findById = (id) => {
  return User.findByPk(id);
};

const updateById = async (id, payload) => {
  const user = await findById(id);

  if (!user) {
    return null;
  }

  return user.update(payload);
};

const deleteById = async (id) => {
  const user = await findById(id);

  if (!user) {
    return null;
  }

  await user.destroy();
  return user;
};

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById
};

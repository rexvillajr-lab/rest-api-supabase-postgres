const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Request = sequelize.define(
  "Request",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    request_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "provider"
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    img_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    front_img_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    back_img_path: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "requests",
    underscored: true
  }
);

module.exports = Request;

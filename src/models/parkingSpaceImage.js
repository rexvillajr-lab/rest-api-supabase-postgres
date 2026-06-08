const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const ParkingSpaceImage = sequelize.define(
  "ParkingSpaceImage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    parking_space_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    img_path: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "parking_space_images",
    underscored: true
  }
);

module.exports = ParkingSpaceImage;

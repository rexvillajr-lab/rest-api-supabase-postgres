const { sequelize, Sequelize } = require("../database");
const User = require("./user");
const Request = require("./request");
const ParkingSpace = require("./parkingSpace");
const ParkingSpaceImage = require("./parkingSpaceImage");
const ParkingReservation = require("./parkingReservation");
const applyAssociations = require("./associations");

const db = {
  sequelize,
  Sequelize,
  User,
  Request,
  ParkingSpace,
  ParkingSpaceImage,
  ParkingReservation
};

applyAssociations(db);

module.exports = db;

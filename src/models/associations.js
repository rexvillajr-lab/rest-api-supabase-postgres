const applyAssociations = (db) => {
  const {
    User,
    Request,
    ParkingSpace,
    ParkingSpaceImage,
    ParkingReservation
  } = db;

  Request.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasMany(Request, { foreignKey: "user_id", as: "requests" });

  ParkingSpace.belongsTo(User, { foreignKey: "user_id", as: "owner" });
  User.hasMany(ParkingSpace, { foreignKey: "user_id", as: "parking_spaces" });

  ParkingSpace.hasMany(ParkingSpaceImage, {
    foreignKey: "parking_space_id",
    as: "images"
  });
  ParkingSpaceImage.belongsTo(ParkingSpace, {
    foreignKey: "parking_space_id",
    as: "parking_space"
  });

  ParkingSpace.hasMany(ParkingReservation, {
    foreignKey: "parking_space_id",
    as: "reservations"
  });
  ParkingReservation.belongsTo(ParkingSpace, {
    foreignKey: "parking_space_id",
    as: "parking_space"
  });

  User.hasMany(ParkingReservation, {
    foreignKey: "user_id",
    as: "parking_reservations"
  });
  ParkingReservation.belongsTo(User, { foreignKey: "user_id", as: "user" });
};

module.exports = applyAssociations;

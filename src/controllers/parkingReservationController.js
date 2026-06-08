const { ParkingReservation, ParkingSpace, User } = require("../models");

const getParkingReservations = async (req, res, next) => {
  const { user_id } = req.query;

  try {
    const where = user_id ? { user_id } : {};

    const reservations = await ParkingReservation.findAll({
      where,
      include: [
        {
          model: ParkingSpace,
          as: "parking_space",
          attributes: [
            "id",
            "space_name",
            "location",
            "latitude",
            "longitude",
            "price_per_hour"
          ]
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.json(reservations);
  } catch (error) {
    return next(error);
  }
};

const createParkingReservation = async (req, res, next) => {
  const {
    parking_space_id,
    user_id,
    payment_mode,
    plate_number,
    parking_time,
    duration_hours
  } = req.body;

  try {
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const parkingSpace = await ParkingSpace.findByPk(parking_space_id);

    if (!parkingSpace) {
      return res.status(404).json({ error: "Parking space not found" });
    }

    if (!plate_number?.trim()) {
      return res.status(400).json({ error: "Plate number is required" });
    }

    if (Number(parkingSpace.slots_available) <= 0) {
      return res.status(400).json({ error: "Parking space is already full" });
    }

    const reservation = await ParkingReservation.create({
      parking_space_id,
      user_id,
      payment_mode,
      plate_number: plate_number.trim(),
      parking_time,
      duration_hours,
      status: "booked"
    });

    await parkingSpace.update({
      slots_available: Number(parkingSpace.slots_available) - 1
    });

    return res.status(201).json(reservation);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getParkingReservations,
  createParkingReservation
};

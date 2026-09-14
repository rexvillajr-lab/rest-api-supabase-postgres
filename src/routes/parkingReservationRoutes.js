const express = require("express");
const {
  getParkingReservations,
  searchParkingReservationByPlateNumber,
  createParkingReservation
} = require("../controllers/parkingReservationController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.use(authenticate);

router.get("/", getParkingReservations);
router.get("/search/plate-number", searchParkingReservationByPlateNumber);
router.post("/", createParkingReservation);

module.exports = router;

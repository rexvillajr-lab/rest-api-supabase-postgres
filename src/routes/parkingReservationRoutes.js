const express = require("express");
const {
  getParkingReservations,
  createParkingReservation
} = require("../controllers/parkingReservationController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.use(authenticate);

router.get("/", getParkingReservations);
router.post("/", createParkingReservation);

module.exports = router;

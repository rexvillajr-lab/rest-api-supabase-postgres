const router = require("express").Router();

const authRoutes = require("./authRoutes");
const healthRoutes = require("./healthRoutes");
const parkingReservationRoutes = require("./parkingReservationRoutes");
const parkingSpaceRoutes = require("./parkingSpaceRoutes");
const requestRoutes = require("./requestRoutes");
const userRoutes = require("./userRoutes");

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/parking-reservations", parkingReservationRoutes);
router.use("/parking-spaces", parkingSpaceRoutes);
router.use("/requests", requestRoutes);
router.use("/users", userRoutes);

module.exports = router;

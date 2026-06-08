const express = require("express");
const {
  getParkingSpaces,
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace
} = require("../controllers/parkingSpaceController");
const authenticate = require("../middlewares/authenticate");
const uploadParkingSpaceImages = require("../middlewares/uploadParkingSpaceImages");

const router = express.Router();

router.get("/", getParkingSpaces);
router.post(
  "/",
  authenticate,
  uploadParkingSpaceImages.array("images", 6),
  createParkingSpace
);
router.put(
  "/:id",
  authenticate,
  uploadParkingSpaceImages.array("images", 6),
  updateParkingSpace
);
router.delete("/:id", authenticate, deleteParkingSpace);

module.exports = router;

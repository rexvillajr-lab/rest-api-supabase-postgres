const express = require("express");
const {
  getRequests,
  updateRequestStatus
} = require("../controllers/requestController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.use(authenticate);

router.get("/", getRequests);
router.put("/:id", updateRequestStatus);

module.exports = router;

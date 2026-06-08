const router = require("express").Router();
const userController = require("../controllers/userController");
const {
  createUserVerificationRequest
} = require("../controllers/requestController");
const uploadRequestImages = require("../middlewares/uploadRequestImages");

router.post("/", userController.create);
router.get("/", userController.findAll);
router.get("/:id", userController.findOne);
router.patch("/:id", userController.update);
router.delete("/:id", userController.remove);
router.post(
  "/:userId/provider-request",
  uploadRequestImages.single("image"),
  userController.createProviderRequest
);
router.post(
  "/:userId/verification-request",
  uploadRequestImages.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 }
  ]),
  createUserVerificationRequest
);

module.exports = router;

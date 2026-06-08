const { ParkingSpace, ParkingSpaceImage, User } = require("../models");

const parkingSpaceInclude = [
  {
    model: User,
    as: "owner",
    attributes: ["id", "first_name", "last_name", "email", "user_type_id"]
  },
  {
    model: ParkingSpaceImage,
    as: "images",
    attributes: ["id", "img_path"]
  }
];

const getParkingSpaces = async (_req, res, next) => {
  try {
    const parkingSpaces = await ParkingSpace.findAll({
      include: parkingSpaceInclude,
      order: [["createdAt", "DESC"]]
    });

    res.json(parkingSpaces);
  } catch (error) {
    next(error);
  }
};

const createParkingSpace = async (req, res, next) => {
  const {
    user_id,
    space_name,
    location,
    latitude,
    longitude,
    price_per_hour,
    slots_available,
    description
  } = req.body;
  const imageFiles = req.files || [];

  try {
    const provider = await User.findByPk(user_id);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    if (provider.user_type_id !== 2) {
      return res.status(400).json({
        error: "Only approved providers can create parking spaces"
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Map location is required"
      });
    }

    const parkingSpace = await ParkingSpace.create({
      user_id,
      space_name,
      location,
      latitude,
      longitude,
      price_per_hour,
      slots_available,
      description
    });

    if (imageFiles.length) {
      await ParkingSpaceImage.bulkCreate(
        imageFiles.map((file) => ({
          parking_space_id: parkingSpace.id,
          img_path: `/uploads/parking-spaces/${file.filename}`
        }))
      );
    }

    const createdParkingSpace = await ParkingSpace.findByPk(parkingSpace.id, {
      include: parkingSpaceInclude
    });

    return res.status(201).json(createdParkingSpace);
  } catch (error) {
    return next(error);
  }
};

const updateParkingSpace = async (req, res, next) => {
  const { id } = req.params;
  const {
    user_id,
    space_name,
    location,
    latitude,
    longitude,
    price_per_hour,
    slots_available,
    description
  } = req.body;
  const imageFiles = req.files || [];

  try {
    const parkingSpace = await ParkingSpace.findByPk(id);

    if (!parkingSpace) {
      return res.status(404).json({ error: "Parking space not found" });
    }

    if (parkingSpace.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: "You can only edit your own parking spaces" });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Map location is required"
      });
    }

    await parkingSpace.update({
      space_name,
      location,
      latitude,
      longitude,
      price_per_hour,
      slots_available,
      description
    });

    if (imageFiles.length) {
      await ParkingSpaceImage.destroy({
        where: {
          parking_space_id: parkingSpace.id
        }
      });

      await ParkingSpaceImage.bulkCreate(
        imageFiles.map((file) => ({
          parking_space_id: parkingSpace.id,
          img_path: `/uploads/parking-spaces/${file.filename}`
        }))
      );
    }

    const updatedParkingSpace = await ParkingSpace.findByPk(parkingSpace.id, {
      include: parkingSpaceInclude
    });

    return res.json(updatedParkingSpace);
  } catch (error) {
    return next(error);
  }
};

const deleteParkingSpace = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const parkingSpace = await ParkingSpace.findByPk(id);

    if (!parkingSpace) {
      return res.status(404).json({ error: "Parking space not found" });
    }

    if (parkingSpace.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own parking spaces" });
    }

    await ParkingSpaceImage.destroy({
      where: {
        parking_space_id: parkingSpace.id
      }
    });

    await parkingSpace.destroy();

    return res.json({ message: "Parking space deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getParkingSpaces,
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace
};

const { Request, User } = require("../models");

const REQUEST_TYPES = {
  provider: "provider",
  userVerification: "user_verification"
};

const getRequests = async (_req, res, next) => {
  try {
    const requests = await Request.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["first_name", "last_name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

const createProviderRequest = async (req, res, next) => {
  const { userId } = req.params;
  const { location } = req.body;
  const imagePath = req.file ? `/uploads/requests/${req.file.filename}` : null;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.user_type_id !== 3) {
      return res.status(400).json({
        error: "Only normal users can apply as provider"
      });
    }

    if (!user.is_verified) {
      return res.status(400).json({
        error: "Only verified accounts can request as provider"
      });
    }

    if (!location || !imagePath) {
      return res.status(400).json({
        error: "Location and place image are required"
      });
    }

    const existingPendingRequest = await Request.findOne({
      where: {
        user_id: userId,
        status: 1,
        request_type: REQUEST_TYPES.provider
      }
    });

    if (existingPendingRequest) {
      return res
        .status(400)
        .json({ error: "Provider request is already pending" });
    }

    const request = await Request.create({
      user_id: userId,
      status: 1,
      request_type: REQUEST_TYPES.provider,
      location,
      img_path: imagePath
    });

    return res.status(201).json(request);
  } catch (error) {
    return next(error);
  }
};

const createUserVerificationRequest = async (req, res, next) => {
  const { userId } = req.params;
  const { location } = req.body;
  const frontImagePath = req.files?.frontImage?.[0]
    ? `/uploads/requests/${req.files.frontImage[0].filename}`
    : null;
  const backImagePath = req.files?.backImage?.[0]
    ? `/uploads/requests/${req.files.backImage[0].filename}`
    : null;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    if (!location || !frontImagePath || !backImagePath) {
      return res.status(400).json({
        error: "Location, front ID image, and back ID image are required"
      });
    }

    const existingPendingRequest = await Request.findOne({
      where: {
        user_id: userId,
        status: 1,
        request_type: REQUEST_TYPES.userVerification
      }
    });

    if (existingPendingRequest) {
      return res
        .status(400)
        .json({ error: "User verification request is already pending" });
    }

    const request = await Request.create({
      user_id: userId,
      status: 1,
      request_type: REQUEST_TYPES.userVerification,
      location,
      front_img_path: frontImagePath,
      back_img_path: backImagePath
    });

    return res.status(201).json(request);
  } catch (error) {
    return next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    request.status = status;
    await request.save();

    if (Number(status) === 2) {
      if (request.request_type === REQUEST_TYPES.provider) {
        await User.update({ user_type_id: 2 }, { where: { id: request.user_id } });
      }

      if (request.request_type === REQUEST_TYPES.userVerification) {
        await User.update({ is_verified: true }, { where: { id: request.user_id } });
      }
    }

    return res.json({ message: "Updated successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getRequests,
  createProviderRequest,
  createUserVerificationRequest,
  updateRequestStatus,
  REQUEST_TYPES
};

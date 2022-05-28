const FriendService = require("../services/friendService");

const cloudinary = require("../utils/cloundinary");
const fs = require("fs");
const createError = require("../utils/createError");
const cropImage = require("../utils/cropImage");

const { User, Friend } = require("../models");
const { Op } = require("sequelize");

exports.getMe = async (req, res) => {
  const user = JSON.parse(JSON.stringify(req.user));
  const friends = await FriendService.findAcceptedFriend(req.user.id);

  user.friends = friends;

  res.json({ user });

  // res.json({ user: req.user, friends });
};

exports.updateProfile = async (req, res, next) => {
  try {
    // console.log(req.files);
    const updateValue = {};
    if (!req.files) {
      createError("profilePic or coverPhoto is require", 400);
    }
    if (req.files.profilePic) {
      const result = await cloudinary.upload(req.files.profilePic[0].path);
      if (req.user.profilePic) {
        const splited = req.user.profilePic.split("/");
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      updateValue.profilePic = cropImage(result.secure_url, 800, 800);
    }
    if (req.files.coverPhoto) {
      const result = await cloudinary.upload(req.files.coverPhoto[0].path);
      if (req.user.coverPhoto) {
        const splited = req.user.coverPhoto.split("/");
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      updateValue.coverPhoto = cropImage(result.secure_url, 1000, 563);
    }
    await User.update(updateValue, { where: { id: req.user.id } });
    res.json({ ...updateValue });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profilePic) {
      fs.unlinkSync(req.files.profilePic[0].path);
    }
    if (req.files.coverPhoto) {
      fs.unlinkSync(req.files.coverPhoto[0].path);
    }
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      createError("user not found", 400);
    }
    const result = JSON.parse(JSON.stringify(user));
    const friends = await FriendService.findAcceptedFriend(user.id);
    result.friends = friends;

    // SELECT * FROM friends WHERE (requestToId = userId AND requestFromId = req.user.id) OR (requestToId = req.user.id AND requestFromId = userId)
    const friend = await Friend.findOne({
      where: {
        [Op.or]: [
          { requestToId: user.id, requestFromId: req.user.id },
          { requestToId: req.user.id, requestFromId: user.id },
        ],
      },
    });
    result.friendStatus = friend;
    res.json({ user: result });
  } catch (err) {
    next(err);
  }
};

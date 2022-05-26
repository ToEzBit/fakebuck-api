const FriendService = require("../services/friendService");

const cloudinary = require("../utils/cloundinary");
const fs = require("fs");
const createError = require("../utils/createError");

const { User } = require("../models");

exports.getMe = async (req, res) => {
  console.log(req.file);
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
      updateValue.profilePic = result.secure_url;
    }
    if (req.files.coverPhoto) {
      const result = await cloudinary.upload(req.files.coverPhoto[0].path);
      if (req.user.coverPhoto) {
        const splited = req.user.coverPhoto.split("/");
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      updateValue.coverPhoto = result.secure_url;
    }
    await User.update(updateValue, { where: { id: req.user.id } });
    res.json({ ...updateValue });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profilePic) {
      fs.unlinkSync(req.files.profilePic[0].path);
    }
    if (req.files.profilePic) {
      fs.unlinkSync(req.files.coverPhoto[0].path);
    }
  }
};

const FriendService = require("../services/friendService");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const { User } = require("../models");

exports.getMe = async (req, res) => {
  console.log(req.file);
  const user = JSON.parse(JSON.stringify(req.user));
  const friends = await FriendService.findAcceptedFriend(req.user.id);

  user.friends = friends;

  res.json(user);

  // res.json({ user: req.user, friends });
};

exports.updateProfile = async (req, res, next) => {
  try {
    // console.log(req.file);

    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      if (error) {
        return next(error);
      }

      await User.update(
        { profilePic: result.secure_url },
        { where: { id: req.user.id } }
      );
      fs.unlinkSync(req.file.path);
      res.json({ profilePic: result.secure_url });
    });
  } catch (err) {
    next(err);
  }
};

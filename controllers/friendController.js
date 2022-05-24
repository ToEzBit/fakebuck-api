const { Op } = require("sequelize");

const createError = require("../utils/createError");
const { FRIEND_ACCEPTED, FRIEND_PENDING } = require("../config/constant");
const FriendService = require("../services/friendService");
const { Friend, User } = require("../models/");

exports.getAllFriend = async (req, res, next) => {
  try {
    const { status } = req.query;
    let users = [];
    if (status?.toUpperCase() === "UNKNOWN") {
      // ------------- find unknown friend   -------------
      users = await FriendService.findUnknown(req.user.id);
    } else if (status?.toUpperCase() === "PENDING") {
      // ------------- find Pending friend  Receiver -------------
      users = await FriendService.findPendingFriend(req.user.id);
    } else if (status?.toUpperCase() === "REQUESTED") {
      // ------------- find request friend   -------------
      users = await FriendService.findRequestFriend(req.user.id);
    } else {
      // ------------- find Accepted friend -------------
      users = await FriendService.findAcceptedFriend(req.user.id);
    }

    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.requestFriend = async (req, res, next) => {
  try {
    const { requestToId } = req.body;
    if (req.user.id === +requestToId) {
      createError("Cannot request yourself", 400);
    }

    // req.user.id John ,requestToId.Jane
    // requestFromId = John AND requestToId = Jane OR requestToId John AND requestFromId Jane
    const existFriend = await Friend.findOne({
      where: {
        [Op.or]: [
          { requestFromId: req.user.id, requestToId: requestToId },
          { requestFromId: requestToId, requestToId: req.user.id },
        ],
      },
    });

    if (existFriend) {
      createError("This user has already been requested");
    }

    const friend = await Friend.create({
      requestToId,
      requestFromId: req.user.id,
      status: FRIEND_PENDING,
    });
    res.json({ friend });
  } catch (err) {
    next(err);
  }
};

exports.updateFriend = async (req, res, next) => {
  try {
    const { requestFromId } = req.params;

    const friend = await Friend.findOne({
      where: {
        requestFromId,
        status: FRIEND_PENDING,
        requestToId: req.user.id, //user was executed request friend
      },
    });

    if (!friend) {
      createError("friend request not found", 400);
    }
    friend.status = FRIEND_ACCEPTED;
    // await Friend.update({status:FRIEND_ACCEPTED},{where:{id:friend.id}})     //static method
    await friend.save(); // instance method
    res.json({ message: "friend request accepted" });
  } catch (err) {
    next(err);
  }
};

exports.deleteFriend = async (req, res, next) => {
  try {
    const { id } = req.params;
    const friend = await Friend.findOne({ where: { id } });

    if (!friend) {
      createError("friend request not found", 400);
    }

    if (
      friend.requestFromId !== req.user.id &&
      friend.requestToId !== req.user.id
    ) {
      createError("you have no permission", 403);
    }
    await friend.destroy(); //instance method
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

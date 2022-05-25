const createError = require("../utils/createError");

const { Comment } = require("../models");
exports.creatComment = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { postId } = req.params;

    const comment = await Comment.create({
      title,
      postId,
      userId: req.user.id,
    });
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id, postId } = req.params;
    const comment = await Comment.findOne({ where: { id, postId } });
    if (!comment) {
      createError("comment not found", 400);
    }

    if (comment.userId !== req.user.id) {
      createError("you have no permission", 403);
    }

    comment.title = title;
    await comment.save();
    res.json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id, postId } = req.params;
    const comment = await Comment.findOne({ where: { id, postId } });
    if (!comment) {
      createError("comment not found", 400);
    }
    if (comment.userId !== req.user.id) {
      createError("you have no permission", 403);
    }
    await comment.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

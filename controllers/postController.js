const fs = require("fs");

const creatError = require("../utils/createError");
const cloundinary = require("../utils/cloundinary");
const FriendService = require("../services/friendService.js");

const { Post, Like, Comment, sequelize, User } = require("../models");

exports.createPost = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title && !req.file) {
      creatError("title or image is require", 400);
    }
    let image;
    if (req.file) {
      const result = await cloundinary.upload(req.file.path);
      image = result.secure_url;
    }
    const post = await Post.create({ title, image, userId: req.user.id });
    res.json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.createLike = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { postId } = req.params;

    const existLike = await Like.findOne({
      where: {
        postId,
        userId: req.user.id,
      },
    });

    if (existLike) {
      creatError("you have already like this post", 400);
    }

    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      creatError("post not found", 400);
    }

    const like = await Like.create(
      { postId, userId: req.user.id },
      { transaction: t }
    );

    await post.increment({ like: 1 }, { transaction: t });

    await t.commit();

    res.json({ like });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { postId } = req.params;
    const like = await Like.findOne({
      where: {
        postId,
        userId: req.user.id,
      },
    });
    if (!like) {
      creatError("you never like this post", 400);
    }
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      creatError("post not found", 400);
    }
    await like.destroy({ transaction: t });
    await post.decrement({ like: 1 }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      creatError("post not found", 400);
    }

    if (post.userId !== req.user.id) {
      creatError("you have no permission", 400);
    }

    await Comment.destroy({ where: { postId: id } }, { transaction: t });
    await Like.destroy({ where: { postId: id } }, { transaction: t });

    if (post.image) {
      const splited = post.image.split("/");
      const publicId = splited[splited.length - 1].split(".")[0];
      await cloundinary.destroy(publicId);
    }

    await Post.destroy({ where: { id } }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title && !req.file) {
      creatError("title or image is require", 400);
    }
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      creatError("post not found", 400);
    }
    if (post.userId !== req.user.id) {
      creatError("you have no permission", 403);
    }

    if (req.file) {
      if (post.image) {
        const splited = post.image.split("/");
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloundinary.destroy(publicId);
      }
      const result = await cloundinary.upload(req.file.path);
      post.image = result.secure_url;
    }
    if (title) {
      post.title = title;
    }
    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.getUserPost = async (req, res, next) => {
  try {
    const userId = await FriendService.findFriendId(req.user.id);
    userId.push(req.user.id);
    const posts = await Post.findAll({
      where: { userId },
      attributes: {
        exclude: ["createdAt", "userId"],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              "password",
              "email",
              "phoneNumber",
              "coverPhoto",
              "createdAt",
            ],
          },
        },
        {
          model: Comment,
          attributes: {
            exclude: ["createdAt", "userId"],
          },
          include: {
            model: User,
            attributes: {
              exclude: [
                "password",
                "email",
                "phoneNumber",
                "coverPhoto",
                "createdAt",
              ],
            },
          },
        },
      ],
    });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

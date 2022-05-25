const fs = require("fs");

const creatError = require("../utils/createError");
const cloundinary = require("../utils/cloundinary");
const { Post, Like, sequelize } = require("../models");

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
  const t = await sequelize.transaction(); //start transaction
  try {
    const { postId } = req.params;

    const exitLike = Like.findOne({
      where: {
        userId: req.user.id,
        postId,
      },
    });

    if (!exitLike) {
      creatError("you have already like this post", 400);
    }

    const post = await Post.findOne({ id: postId });

    if (!post) {
      creatError("post not found", 400);
    }

    const like = await Like.create(
      { postId, userId: req.user.id },
      { transaction: t }
    );

    await post.increment("like", { by: 1 }, { transaction: t });

    await t.commit();

    res.json({ like });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const t = await sequelize.transaction(); //start transaction
    try {
      const { postId } = req.params;

      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          postId,
        },
      });

      if (!like) {
        creatError("you never like this post", 400);
      }

      const post = await Post.findOne({ id: postId });

      if (!post) {
        creatError("post not found", 400);
      }

      await like.destroy({ transaction: t });

      await post.decrement("like", { by: 1 }, { transaction: t });

      await t.commit();
      res.status(204).json();
    } catch (err) {
      await t.rollback();
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

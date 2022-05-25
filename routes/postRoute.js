const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

router.post("/", upload.single("image"), postController.createPost);
router.patch("/:id", upload.single("image"), postController.updatePost);
router.delete("/:id", postController.deletePost);
router.post("/:postId/like", postController.createLike);
router.delete("/:postId/like", postController.deleteLike);
router.post("/:postId/comments", commentController.creatComment);
router.patch("/:postId/comments/:id", commentController.updateComment);
router.delete("/:postId/comments/:id", commentController.deleteComment);

module.exports = router;

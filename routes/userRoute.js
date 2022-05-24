const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/me", userController.getMe);

module.exports = router;

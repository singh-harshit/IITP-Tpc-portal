const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roles-auth");
const authController = require("../controllers/auth-controllers");

router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword", authController.resetPassword);

module.exports = router;

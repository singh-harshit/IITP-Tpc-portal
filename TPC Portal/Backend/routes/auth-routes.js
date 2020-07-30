const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/auth-controllers");

router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword", authController.resetPassword);

// Tested
router.get("/guideLines", authController.guideLines);

// Tested
router.get("/checkRegStatus", authController.checkRegistrationStatus);

// Tested
router.get("/allDetails", authController.getAllDetails);

module.exports = router;

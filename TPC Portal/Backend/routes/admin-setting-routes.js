const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminSettingController = require("../controllers/admin-setting-controllers");
const fileUpload = require("../middleware/file-upload");

module.exports = router;

const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminBackupController = require("../controllers/admin-backup-controllers");
const auth = require("../middleware/auth");

router.get("/backup", adminBackupController.backupDatabase);

router.get("/backupDates", adminBackupController.getAllBackupDates);

router.post("/restore", adminBackupController.restoreDatabase);

router.patch("/startNewSession", adminBackupController.startNewSession);

module.exports = router;

const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminBackupController = require("../controllers/admin-backup-controllers");

router.get("/backup", adminBackupController.backupDatabase);

router.get("/backupDates", adminBackupController.getAllBackupDates);

router.post(
  "/restore",
  check("restorationDate").not().isEmpty(),
  adminBackupController.restoreDatabase
);

router.patch("/startNewSession", adminBackupController.startNewSession);

module.exports = router;

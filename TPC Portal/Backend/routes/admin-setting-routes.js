const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminSettingController = require("../controllers/admin-setting-controllers");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roles-auth");

// Tested
router.post("/classifications", adminSettingController.setJobClassifications);

// Tested
router.post("/steps", adminSettingController.setJobSteps);

// Tested
router.post("/status", adminSettingController.setJobStatus);

// Tested
router.post("/programs", adminSettingController.setStudentPrograms);

// Tested
router.post(
  "/programAndCourses",
  adminSettingController.setStudentProgramsAndCourses
);

// Tested
router.get("/coordinators", adminSettingController.getAllCoordinators);

// Tested
router.post(
  "/newCoordinator",
  [
    check("name").not().isEmpty(),
    check("emailId").normalizeEmail().isEmail(),
    check("rollNo").not().isEmpty(),
    check("password").isLength({ min: 8 }),
  ],
  adminSettingController.assignNewCoordinator
);

// Tested
router.patch("/deleteCoordinator", adminSettingController.deleteCoordinator);

// Tested
router.post("/guideLines", adminSettingController.setGuideLines);

// Tested
router.patch(
  "/resetPassword",
  [check("newPassword").isLength({ min: 8 })],
  adminSettingController.resetPassword
);

// Tested
router.patch(
  "/resetCodPassword/:codId",
  [check("newPassword").isLength({ min: 8 })],
  adminSettingController.resetCodPassword
);

// Tested
router.patch(
  "/changeRegStatus",
  adminSettingController.changeRegistrationStatus
);

module.exports = router;

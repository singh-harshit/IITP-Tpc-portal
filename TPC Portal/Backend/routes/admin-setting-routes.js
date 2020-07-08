const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminSettingController = require("../controllers/admin-setting-controllers");
const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");

//router.use(auth);

router.post("/classifications", adminSettingController.setJobClassifications);

router.post("/steps", adminSettingController.setJobSteps);

router.post("/status", adminSettingController.setJobStatus);

router.post("/programs", adminSettingController.setStudentPrograms);

router.post("/departments", adminSettingController.setStudentDepartments);

router.post("/courses", adminSettingController.setStudentCourses);

router.get("/coordinators", adminSettingController.getAllCoordinators);

router.post("/newCoordinator", adminSettingController.assignNewCoordinator);

router.patch("/deleteCoordinator", adminSettingController.deleteCoordinator);

// router.post("/newRule", adminSettingController.setNewRule);

// router.get("/rules", adminSettingController.getAllRules);

router.post("/guideLines", adminSettingController.setGuideLines);

router.patch("/resetPassword", adminSettingController.resetPassword);

router.patch(
  "/resetCodPassword/:codId",
  adminSettingController.resetCodPassword
);

router.get("/allDetails", adminSettingController.getAllDetails);

router.patch(
  "/changeRegStatus",
  adminSettingController.changeRegistrationStatus
);

router.get("/checkRegStatus", adminSettingController.checkRegistrationStatus);

module.exports = router;

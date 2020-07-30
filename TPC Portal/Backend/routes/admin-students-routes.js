const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminStudentsController = require("../controllers/admin-students-controllers");
const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");

// Tested
router.get("/students", adminStudentsController.getAllStudents);

router.post("/students", adminStudentsController.getAllStudentsWithFilter);

// Tested
router.get("/student/:sid", adminStudentsController.getStudentById);

// Tested
router.patch("/student/:sid", adminStudentsController.updateStudentById);

// Tested
router.patch(
  "/student/resetPassword/:sid",
  adminStudentsController.resetPassword
);

// Tested
router.patch(
  "/student/changeStatus/:sid",
  adminStudentsController.changeStatus
);

// Tested
router.patch(
  "/students/setStatusCpiUpdate",
  adminStudentsController.statusOfCpiUpdate
);
module.exports = router;

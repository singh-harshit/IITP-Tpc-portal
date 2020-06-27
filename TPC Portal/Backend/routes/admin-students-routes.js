const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminStudentsController = require("../controllers/admin-students-controllers");
const fileUpload = require("../middleware/file-upload");

router.get("/students", adminStudentsController.getAllStudents);

router.post("/students", adminStudentsController.getAllStudentsWithFilter);

router.post("/students/export", adminStudentsController.exportFilteredStudents);

router.get("/student/:sid", adminStudentsController.getStudentById);

router.patch("/student/:sid", adminStudentsController.updateStudentById);

router.patch(
  "/student/resetPassword/:sid",
  adminStudentsController.resetPassword
);

router.patch(
  "/student/changeStatus/:sid",
  adminStudentsController.changeStatus
);

router.patch(
  "/students/setStatusCpiUpdate",
  adminStudentsController.statusOfCpiUpdate
);
module.exports = router;

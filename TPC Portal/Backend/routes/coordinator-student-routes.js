const express = require("express");
const router = express.Router();
const adminStudentsController = require("../controllers/admin-students-controllers");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roles-auth");

router.use(auth);

router.use(authorize("Coordinator"));

router.get("/students", adminStudentsController.getAllStudents);

router.post("/students", adminStudentsController.getAllStudentsWithFilter);

router.get("/student/:sid", adminStudentsController.getStudentById);

module.exports = router;

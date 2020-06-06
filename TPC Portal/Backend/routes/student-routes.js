const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const studentControllers = require("../controllers/student-controllers");
const fileUpload = require("../middleware/file-upload");

router.post("/login", studentControllers.login);

router.post(
  "/registration",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("instituteEmail").normalizeEmail().isEmail(),
    check("personalEmail").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  studentControllers.registration
);

router.get("/profile/:sid", studentControllers.profile);

router.get("/applied/jobs/:sid", studentControllers.appliedJobs);

router.get("/eligible/jobs/:sid", studentControllers.eligibleJobs);

router.get("/requests/:sid", studentControllers.requests);

router.post(
  "/new-request/:sid",
  [check("subject").not().isEmpty(), check("message").not().isEmpty()],
  studentControllers.newRequest
);

router.post(
  "/resume/:sid",
  fileUpload.single("resumeFile"),
  [check("resumeLink").not().isEmpty()],
  studentControllers.resumeUpload
);

router.patch(
  "/reset-password/:sid",
  [check("newPassword").isLength({ min: 6 })],
  studentControllers.resetPassword
);

module.exports = router;

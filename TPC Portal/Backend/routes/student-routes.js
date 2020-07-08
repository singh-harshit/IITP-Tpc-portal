const express = require("express");
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const studentControllers = require("../controllers/student-controllers");
const fileUpload = require("../middleware/file-upload");
const authorize = require("../middleware/roles-auth");
const router = express.Router();

router.post(
  "/login",
  [
    check("password").isLength({ min: 6 }),
  ],
  studentControllers.login
);

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

// router.use(auth);

// router.use(authorize("Student"));

router.get("/profile/:sid", studentControllers.profile);

router.patch("/profile/:sid", studentControllers.editProfile);

router.post("/apply/:sid", studentControllers.applyForJob);

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
  [
    check("oldPassword").isLength({ min: 6 }),
    check("newPassword").isLength({ min: 6 }),
  ],
  studentControllers.resetPassword
);

router.patch("/updateCpiOnly/:sid", studentControllers.updateCpiOnly);

module.exports = router;

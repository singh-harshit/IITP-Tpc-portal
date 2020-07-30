const express = require("express");
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const studentControllers = require("../controllers/student-controllers");
const fileUpload = require("../middleware/file-upload");
const authorize = require("../middleware/roles-auth");
const router = express.Router();

// Tested
router.post(
  "/login",
  [check("userName").not().isEmpty(), check("password").isLength({ min: 8 })],
  studentControllers.login
);

// Tested
router.post(
  "/registration",
  // fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("instituteEmail").normalizeEmail().isEmail(),
    check("personalEmail").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  studentControllers.registration
);

router.use(auth);

router.use(authorize("Student"));

// Tested
router.get("/home/:sid", studentControllers.home);

// Tested
router.get("/profile/:sid", studentControllers.profile);

// Tested
router.patch(
  "/profile/:sid",
  //fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("instituteEmail").normalizeEmail().isEmail(),
    check("personalEmail").normalizeEmail().isEmail(),
  ],
  studentControllers.editProfile
);

router.patch(
  "/profile/pic/:sid",
  fileUpload.single("image"),
  studentControllers.setProfilePicture
);

// Tested
router.post("/apply/:sid", studentControllers.applyForJob);

// Tested
router.get("/applied/jobs/:sid", studentControllers.appliedJobs);

// Tested
router.get("/eligible/jobs/:sid", studentControllers.eligibleJobs);

// Tested
router.get("/requests/:sid", studentControllers.requests);

// Tested
router.post(
  "/new-request/:sid",
  [check("subject").not().isEmpty(), check("message").not().isEmpty()],
  studentControllers.newRequest
);

// Tested
router.post(
  "/resume/:sid",
  fileUpload.single("resumeFile"),
  [check("resumeLink").not().isEmpty()],
  studentControllers.resumeUpload
);

// Tested
router.patch(
  "/reset-password/:sid",
  [
    check("oldPassword").isLength({ min: 8 }),
    check("newPassword").isLength({ min: 8 }),
  ],
  studentControllers.resetPassword
);

// Tested
router.patch("/updateCpiOnly/:sid", studentControllers.updateCpiOnly);

module.exports = router;

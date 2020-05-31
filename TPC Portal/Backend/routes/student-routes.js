const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const studentControllers = require("../controllers/student-controllers");

router.post("/login", studentControllers.login);

router.post(
  "/registration",
  [
    check("name").not().isEmpty(),
    check("instituteEmail").normalizeEmail().isEmail(),
    check("personalEmail").normalizeEmail().isEmail(),
  ],
  studentControllers.registration
);

router.get("/profile/:sid", studentControllers.profile);

router.get("/applied/jobs/:sid", studentControllers.appliedJobs);

router.get("/eligible/jobs/:sid", studentControllers.eligibleJobs);

router.get("/requests/:sid", studentControllers.requests);

router.post("/new-request/:sid", studentControllers.newRequest);

router.post("/resume/:sid", studentControllers.resumeUpload);

router.patch("/reset-password/:sid", studentControllers.resetPassword);

module.exports = router;

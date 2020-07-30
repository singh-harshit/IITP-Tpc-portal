const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminJobsController = require("../controllers/admin-jobs-controllers");
const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");

// Tested
router.get("/jobs", adminJobsController.getAllJobs);

// Tested
router.post(
  "/jobs/addJob",
  //fileUpload.array("resumeFiles", 3),
  [
    check("companyName").not().isEmpty(),
    check("companyId").not().isEmpty(),
    check("jobTitle").not().isEmpty(),
    check("jobType").not().isEmpty(),
    check("jobCategory").not().isEmpty(),
  ],
  adminJobsController.addJob
);
// Tested
router.patch(
  "/jobs/jafFiles/:jid",
  fileUpload.array("resumeFiles", 3),
  adminJobsController.setJafFiles
);
// Tested
router.patch("/jobs/openRegistration", adminJobsController.openRegistration);

// Tested
router.patch("/jobs/closeRegistration", adminJobsController.closeRegistration);

// Tested
router.delete("/jobs/deleteJob", adminJobsController.deleteJob);

// Tested
router.get("/approvedCompanies", adminJobsController.approvedCompanies);

// Tested
router.get("/jobs/:jid", adminJobsController.getJobById);

// Tested
router.patch(
  "/jobs/:jid",
  [
    check("jobTitle").not().isEmpty(),
    check("jobType").not().isEmpty(),
    check("jobCategory").not().isEmpty(),
  ],
  adminJobsController.updateJobById
);

router.patch(
  "/jobs/updateEligibilityCriteria/:jid",
  adminJobsController.updateEligibilityCriteria
);

// Tested
router.get("/jobs/markProgress/:jid", adminJobsController.markProgress);

// Tested
router.patch("/jobs/addStep/:jid", adminJobsController.addNewStep);

// Tested
router.patch("/jobs/removeStep/:jid", adminJobsController.removeStep);

// Tested
router.get(
  "/jobs/stepsWithStatus/:jid",
  adminJobsController.getAllStepsWithStatus
);

// Tested
router.patch("/jobs/markCompleted/:jid", adminJobsController.markStepCompleted);

// Tested
router.patch("/jobs/saveJobStatus/:jid", adminJobsController.saveJobStatus);

// Tested
router.patch("/jobs/saveProgress/:jid", adminJobsController.saveJobProgress);

// Tested
router.patch("/jobs/addStudent/:jid", adminJobsController.addStudent);

// Tested
router.patch("/jobs/removeStudent/:jid", adminJobsController.removeStudent);

// Tested
router.get(
  "/jobs/:jid/activeApplicants",
  adminJobsController.activeApplicantsByJobId
);

module.exports = router;

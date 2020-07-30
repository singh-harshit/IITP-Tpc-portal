const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");
const adminJobsController = require("../controllers/admin-jobs-controllers");
const adminController = require("../controllers/admin-controllers");
const coordinatorJobsController = require("../controllers/coordinator-job-controllers");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roles-auth");

// Tested
router.post("/login", coordinatorJobsController.coordinatorLogin);

router.use(auth);

router.use(authorize("Coordinator"));

// Tested
router.patch("/resetPassword/:cid", coordinatorJobsController.resetPassword);

// Tested
router.get("/jobs", adminJobsController.getAllJobs);


router.get("/home", adminController.home);
// Tested
router.post(
  "/jobs/addJob",
  fileUpload.array("resumeFiles", 3),
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
router.patch("/jobs/:jid", coordinatorJobsController.updateJobId);

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

router.patch("/jobs/markCompleted/:jid", adminJobsController.markStepCompleted);

router.patch("/jobs/saveProgress/:jid", adminJobsController.saveJobProgress);

router.patch("/jobs/saveJobStatus/:jid", adminJobsController.saveJobStatus);

router.get(
  "/jobs/:jid/activeApplicants",
  adminJobsController.activeApplicantsByJobId
);

router.post("/add-job-and-company", coordinatorJobsController.addJobAndCompany);

module.exports = router;

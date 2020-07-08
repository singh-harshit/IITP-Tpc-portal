const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");
const adminJobsController = require("../controllers/admin-jobs-controllers");
const coordinatorJobsController = require("../controllers/coordinator-job-controllers");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roles-auth");

router.post("/login", coordinatorJobsController.coordinatorLogin);

router.use(auth);

router.use(authorize("Coordinator"));

router.patch("/resetPassword", coordinatorJobsController.resetPassword);

router.get("/jobs", adminJobsController.getAllJobs);

router.post("/jobs", adminJobsController.getAllJobsWithFilter);

router.post("/jobs/export", adminJobsController.exportFilterJobs);

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

router.patch("/jobs/openRegistration", adminJobsController.openRegistration);

router.patch("/jobs/closeRegistration", adminJobsController.closeRegistration);

router.delete("/jobs/deleteJob", adminJobsController.deleteJob);

router.get("/approvedCompanies", adminJobsController.approvedCompanies);

router.get("/jobs/:jid", adminJobsController.getJobById);

router.patch("/jobs/:jid", coordinatorJobsController.updateJobId);

router.get("/jobs/markProgress/:jid", adminJobsController.markProgress);

router.patch("/jobs/addStep/:jid", adminJobsController.addNewStep);

router.patch("/jobs/markCompleted/:jid", adminJobsController.markStepCompleted);

router.patch("/jobs/saveProgress/:jid", adminJobsController.saveJobProgress);

router.get(
  "/jobs/:jid/activeApplicants",
  adminJobsController.activeApplicantsByJobId
);

router.post("/add-job-and-company", coordinatorJobsController.addJobAndCompany);

module.exports = router;

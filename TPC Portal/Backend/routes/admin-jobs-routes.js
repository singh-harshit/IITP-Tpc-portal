const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminJobsController = require("../controllers/admin-jobs-controller");
const fileUpload = require("../middleware/file-upload");

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

router.patch("/jobs/:jid", adminJobsController.updateJobById);

router.get("/jobs/markProgress/:jid", adminJobsController.markProgress);

router.patch("/jobs/addStep/:jid", adminJobsController.addNewStep);

router.patch("/jobs/markCompleted/:jid", adminJobsController.markStepCompleted);

router.patch("/jobs/saveProgress/:jid", adminJobsController.saveJobProgress);

router.patch("/jobs/addStudent/:jid", adminJobsController.addStudent);

router.patch("/jobs/removeStudent/:jid", adminJobsController.removeStudent);

router.post(
  "/jobs/:jid/activeApplicants",
  adminJobsController.activeApplicantsByJobId
);

module.exports = router;

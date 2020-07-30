const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminRequestsController = require("../controllers/admin-requests-controller");
const auth = require("../middleware/auth");

// Tested
router.get("/requests", adminRequestsController.getAllRequests);

// Tested
router.patch("/approve/request/:id", adminRequestsController.approveRequest);

// Tested
router.delete("/delete/request/:id", adminRequestsController.deleteRequest);

// Tested
router.get(
  "/student/sortByProgram/request",
  adminRequestsController.sortStudentRequestsByProgram
);

// Tested
router.get(
  "/student/sortByCourse/request",
  adminRequestsController.sortStudentRequestsByCourse
);

// Tested
router.patch(
  "/student/bulkApprove/request",
  adminRequestsController.approveStudentRequestsInBulk
);

// Tested
router.patch(
  "/studentRequest/markRead/:rid",
  adminRequestsController.markReadStudentRequests
);

// Tested
router.patch(
  "/companyRequest/markRead/:rid",
  adminRequestsController.markReadCompanyRequests
);
module.exports = router;

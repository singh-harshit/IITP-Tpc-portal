const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminRequestsController = require("../controllers/admin-requests-controller");
const auth = require("../middleware/auth");

//router.use(auth);

router.get("/requests", adminRequestsController.getAllRequests);

router.patch("/approve/request/:id", adminRequestsController.approveRequest);

router.delete("/delete/request/:id", adminRequestsController.deleteRequest);

router.get(
  "/student/sortByProgram/request",
  adminRequestsController.sortStudentRequestsByProgram
);

router.get(
  "/student/sortByCourse/request",
  adminRequestsController.sortStudentRequestsByCourse
);

router.patch(
  "/student/bulkApprove/request",
  adminRequestsController.approveStudentRequestsInBulk
);

router.patch(
  "/studentRequest/markRead/:rid",
  adminRequestsController.markReadStudentRequests
);

router.patch(
  "/companyRequest/markRead/:rid",
  adminRequestsController.markReadCompanyRequests
);
module.exports = router;

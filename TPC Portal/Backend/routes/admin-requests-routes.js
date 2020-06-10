const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminRequestsController = require("../controllers/admin-requests-controller");

router.get("/requests", adminRequestsController.getAllRequests);

router.patch("/approve/request/:id", adminRequestsController.approveRequest);

router.delete("/delete/request/:id", adminRequestsController.deleteRequest);

router.post(
  "/student/sort/request",
  adminRequestsController.sortStudentRequests
);

router.patch(
  "/student/bulkApprove/request",
  adminRequestsController.approveStudetnRequestsInBulk
);

module.exports = router;

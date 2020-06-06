const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminRequestsController = require("../controllers/admin-requests-controller");

router.get("/requests", adminRequestsController.getAllRequests);

router.patch("/approve/request/:id", adminRequestsController.approveRequest);

router.delete("/delete/request/:id", adminRequestsController.deleteRequest);

module.exports = router;

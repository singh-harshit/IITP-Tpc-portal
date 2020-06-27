const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const companyController = require("../controllers/company-controllers");

router.post("/login", companyController.companyLogin);

router.post(
  "/registration",
  [
    check("companyName").not().isEmpty(),
    check("userName").not().isEmpty(),
    check("password").isLength({ min: 8 }),
    check("contact1.mailId").normalizeEmail().isEmail(),
  ],
  companyController.companyRegistration
);

router.get("/requests/:cid", companyController.companyRequests);

router.post(
  "/new-request/:cid",
  [check("title").not().isEmpty(), check("message").not().isEmpty()],
  companyController.companyNewRequest
);

router.get("/jobs/:cid", companyController.getAllJobs);

module.exports = router;

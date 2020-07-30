const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/roles-auth");

const companyController = require("../controllers/company-controllers");

// Tested
router.post(
  "/login",
  [check("userName").not().isEmpty(), check("password").isLength({ min: 8 })],
  companyController.companyLogin
);

// Tested
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

router.use(auth);

router.use(authorize("Company"));

router.get("/profile/:cid", companyController.companyProfile);
// Tested
router.get("/requests/:cid", companyController.companyRequests);

// Tested
router.post(
  "/new-request/:cid",
  [check("subject").not().isEmpty(), check("message").not().isEmpty()],
  companyController.companyNewRequest
);

// Tested
router.get("/jobs/:cid", companyController.getAllJobs);

module.exports = router;

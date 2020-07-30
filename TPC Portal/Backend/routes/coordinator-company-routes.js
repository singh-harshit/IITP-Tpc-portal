const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");
const adminController = require("../controllers/admin-controllers");
const coordinatorController = require("../controllers/coordinator-job-controllers");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roles-auth");

router.use(auth);

router.use(authorize("Coordinator"));

//Admin Companies Routes

router.get("/companies", adminController.getAllCompanies);

//Expecting Company Details ... adding one company
router.post(
  "/companies/addCompany",
  [
    check("companyName").not().isEmpty(),
    check("userName").not().isEmpty(),
    check("password").isLength({ min: 8 }),
    check("contact1.mailId").normalizeEmail().isEmail(),
  ],
  coordinatorController.addCompany
);

// Adding many companies from csv files
router.post(
  "/companies/addBulkCompany",
  fileUpload.single("companyDetails"),
  adminController.addBulkCompany
);

//ROUTE for individual company display ... Expecting companyId in URL (/admin/companies/:cid)
router.get("/companies/:cid", adminController.getCompanyById);

//Updating details of a Particular company .... Expecting [companyId , other details for the update]
router.patch(
  "/companies/:cid",
  [
    check("companyName").not().isEmpty(),
    check("userName").not().isEmpty(),
    check("contact1.mailId").normalizeEmail().isEmail(),
  ],
  adminController.updateCompanyById
);

//Reset Password By the Admin
router.patch(
  "/companies/:cid/reset-password",
  [check("userName").not().isEmpty(), check("password").isLength({ min: 8 })],
  adminController.companyPasswordReset
);

module.exports = router;

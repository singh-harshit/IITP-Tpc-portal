const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminController = require("../controllers/admin-controllers");
const fileUpload = require("../middleware/file-upload");
const auth = require("../middleware/auth");
const authorize = require("../middleware/roles-auth");

// Tested
router.post("/login", adminController.adminLogin);

router.use(auth);

router.use(authorize("Admin"));

router.get("/home", adminController.home);

//Admin Companies Routes

// Tested
router.get("/companies", adminController.getAllCompanies);

// Tested
router.patch("/companies/deactivateCompany", adminController.deactivateCompany);

// Tested
router.delete("/companies/deleteCompany", adminController.deleteCompany);

// Tested
router.post(
  "/companies/addCompany",
  [
    check("companyName").not().isEmpty(),
    check("userName").not().isEmpty(),
    check("password").isLength({ min: 8 }),
    check("contact1.mailId").normalizeEmail().isEmail(),
  ],
  adminController.addCompany
);

// Tested
router.post(
  "/companies/addBulkCompany",
  fileUpload.single("companyDetails"),
  adminController.addBulkCompany
);

// Tested
router.get("/companies/:cid", adminController.getCompanyById);

// Tested
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

// Tested
router.patch(
  "/companies/:cid/reset-password",
  [check("password").isLength({ min: 8 })],
  adminController.companyPasswordReset
);

module.exports = router;

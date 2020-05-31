const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminController = require("../controllers/admin-controllers");

router.post("/login", adminController.adminLogin);

router.get("/companies", adminController.getAllCompanies);

// Expecting "array of Companies Id or may be One id but in inside array"  for the deletion
router.patch("/companies/deactivateCompany", adminController.deactivateCompany);

// Expecting "array of Companies Id or may be One id but in inside array"  for the deletion
router.delete("/companies/deleteCompany", adminController.deleteCompany);

//Expecting Company Details
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

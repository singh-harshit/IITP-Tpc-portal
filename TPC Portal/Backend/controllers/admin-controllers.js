const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Admin = require("../models/admin");
const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Coordinator = require("../models/coordinators");

const adminLogin = async (req, res, next) => {
  const { userName, password } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: userName });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  if (!existingAdmin) return next(new HttpError("Invalid Credentials", 400));
  const validAdmin = await bcrypt.compare(password, existingAdmin.password);
  if (!validAdmin) return next(new HttpError("Invalid Credentials", 400));
  const token = jwt.sign({ _id: existingAdmin._id }, "We_think_too_much_and_feel_too_little ");
  res.json({ loginStatus: true, token });
};

const getAllCompanies = async (req, res, next) => {
  let companyList;
  try {
    companyList = await Company.find(
      {},
      { companyName: 1, companyStatus: 1, jobs: 1 },
      { sort: { companyName: 1 } }
    ).populate({
      path: "jobs",
      select: "jobTitle jobCategory jobStatus",
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  console.log(companyList);
  res.json({
    companyList: companyList,
  });
};

const addCompany = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  const {
    companyName,
    userName,
    password,
    contact1,
    contact2,
    contact3,
    companyLink,
    remarks,
    companyAddress,
  } = req.body;
  const newCompany = new Company({
    companyName,
    userName,
    password,
    companyAddress,
    contact1,
    contact2,
    contact3,
    companyLink,
    remarks,
    companyStatus: "Active",
    approvalStatus: true,
  });

  // Saving to Database
  try {
    await newCompany.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ newCompany: newCompany.toObject({ getters: true }) });
};

const addBulkCompany = async (req, res, next) => {};

const deactivateCompany = async (req, res, next) => {
  const { idList } = req.body;
  let successFul = [];
  let unSuccessFul = [];
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (companyId of idList) {
      const company = await Company.findById(companyId).session(sess);
      let allJobStatus = true;
      for (job of company.jobs) {
        if (job.jobStatus !== "Dropped") {
          allJobStatus = false;
          break;
        }
      }
      if (allJobStatus) {
        company.companyStatus = "Deactivated";
        await company.save({ session: sess });
        successFul.push(company.companyName);
      } else {
        unSuccessFul.push(company.companyName);
      }
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({
    message: "Deactivated",
    successFul: successFul,
    unSuccessFul: unSuccessFul,
  });
};

const deleteCompany = async (req, res, next) => {
  const { idList } = req.body;
  let successFul = [];
  let unSuccessFul = [];
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (companyId of idList) {
      const company = await Company.findById(companyId).session(sess);
      if (company.jobs.length === 0) {
        await company.remove({ session: sess });
        successFul.push(company.companyName);
      } else {
        unSuccessFul.push(company.companyName);
      }
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({
    message: "Deleted",
    successFul: successFul,
    unSuccessFul: unSuccessFul,
  });
};

const getCompanyById = async (req, res, next) => {
  const companyId = req.params.cid;
  let companyDetails;
  try {
    companyDetails = await Company.findById(
      companyId,
      "-password -requests -approvalStatus"
    ).populate("jobs", {
      jobTitle: 1,
      jobType: 1,
      jobCategory: 1,
      jobStatus: 1,
      selectedStudents: 1,
      publicRemarks: 1,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }

  console.log(companyDetails);
  console.log(companyDetails.jobs);

  res.json({
    companyDetails: companyDetails,
  });
};

const updateCompanyById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  const companyId = req.params.cid;
  const {
    companyName,
    userName,
    contact1,
    contact2,
    contact3,
    companyLink,
    remarks,
    companyAddress,
    companyStatus,
  } = req.body;
  let companyToUpdate;
  try {
    companyToUpdate = await Company.findById(companyId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }

  if (!companyToUpdate) {
    console.log(err);
    const error = new HttpError("Company doesn't exist ", 500);
    return next(error);
  }

  companyToUpdate.companyName = companyName;
  companyToUpdate.userName = userName;
  companyToUpdate.contact1 = contact1;
  companyToUpdate.contact2 = contact2;
  companyToUpdate.contact3 = contact3;
  companyToUpdate.companyAddress = companyAddress;
  companyToUpdate.companyLink = companyLink;
  companyToUpdate.remarks = remarks;
  companyToUpdate.companyStatus = companyStatus;

  try {
    await companyToUpdate.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ companyToUpdate: companyToUpdate.toObject({ getters: true }) });
};

const companyPasswordReset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  const companyId = req.params.cid;
  const { userName, password } = req.body;
  let company;
  try {
    company = await Company.findOne({ userName: userName, _id: companyId });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  if (!company) return next(new HttpError("Company doesn't exist", 404));

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  company.password = await bcrypt.hash(password, salt);
  try {
    await company.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ updatedCompany: company.toObject({ getters: true }) });
};

exports.adminLogin = adminLogin;

//exports.getStudents = getStudents;
//exports.exportStudents = exportStudents;
exports.getAllCompanies = getAllCompanies;
exports.addCompany = addCompany;
exports.addBulkCompany = addBulkCompany;
exports.deactivateCompany = deactivateCompany;
exports.deleteCompany = deleteCompany;
exports.getCompanyById = getCompanyById;
exports.companyPasswordReset = companyPasswordReset;
exports.updateCompanyById = updateCompanyById;

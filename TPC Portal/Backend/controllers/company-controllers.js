const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Admin = require("../models/admin");
const Role = require("../models/Role");
const companyLogin = async (req, res, next) => {
  const { userName, password } = req.body;
  let existingCompany;
  try {
    existingCompany = await Company.findOne({ userName: userName });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  if (!existingCompany) return next(new HttpError("Invalid Credentials!", 400));

  const validCompany = await bcrypt.compare(password, existingCompany.password);
  if (!validCompany) return next(new HttpError("Invalid Credentials", 400));
  const token = existingCompany.generateAuthToken();
  const refreshToken = existingCompany.generateRefreshToken();
  res.set("Access-Control-Expose-Headers", "x-auth-token, x-refresh-token");
  res.set("x-auth-token", token);
  res.set("x-refresh-token", refreshToken);
  res.json({
    loginStatus: true,
    _id: existingCompany._id,
    approvalStatus: existingCompany.approvalStatus,
  });
};

const companyRegistration = async (req, res, next) => {
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
    companyAddress,
  } = req.body;
  const newCompany = new Company({
    companyName,
    userName,
    password,
    companyAddress,
    contact1,
    contact2: contact2 || null,
    contact3: contact3 || null,
    companyLink,
    companyStatus: "Registered",
    approvalStatus: "Pending Approval",
    role: Role.Company,
  });

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  newCompany.password = await bcrypt.hash(newCompany.password, salt);

  // Saving to Database
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newCompany.save({ session: sess });
    await Admin.updateOne(
      {},
      { $addToSet: { companyApproval: newCompany._id } }
    );
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  console.log("Registration Complete and sent for approval");
  const token = newCompany.generateAuthToken();
  const refreshToken = newCompany.generateRefreshToken();
  res.set("Access-Control-Expose-Headers", "x-auth-token, x-refresh-token");
  res.set("x-auth-token", token);
  res.set("x-refresh-token", refreshToken);
  res.json({ newCompany: newCompany.toObject({ getters: true }) });
};

const companyProfile = async (req, res, next) => {
  const companyId = req.params.cid;
  try {
    company = await Company.findById(companyId, {
      companyName: 1,
      userName: 1,
      contact1: 1,
      contact2: 1,
      contact3: 1,
      companyLink: 1,
      companyAddress: 1,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ companyInfo: company });
};

const companyRequests = async (req, res, next) => {
  const companyId = req.params.cid;
  let oldRequests;
  try {
    oldRequests = await Company.findById(companyId, { requests: 1 });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ oldRequests: oldRequests.toObject() });
};

const companyNewRequest = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  const companyId = req.params.cid;
  const { subject, message } = req.body;
  let companyInfo;
  try {
    companyInfo = await Company.findById(companyId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  const newRequest = {
    rid: companyInfo.requests.length + 1,
    subject,
    message,
    status: "Unread",
  };
  companyInfo.requests.push(newRequest);
  let rid = newRequest.rid - 1;
  console.log(rid);
  let Id;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await companyInfo.save({ session: sess });
    Id = companyInfo.requests[rid]._id;
    console.log(Id);
    await Admin.updateOne(
      {},
      {
        $addToSet: {
          companyRequests: {
            _id: Id,
            companyId: companyId,
            subject: subject,
            content: message,
          },
        },
      }
    ).session(sess);
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ companyInfo: companyInfo.toObject({ getters: true }) });
};

const getAllJobs = async (req, res, next) => {
  const companyId = req.params.cid;
  let allJobs;
  const populateObj = {
    path: "jobs",
    populate: {
      path: "progressSteps.qualifiedStudents",
      select: "name rollNo resumeLink",
    },
    select:
      "jobTitle jobType jobStatus eligibilityCriteria schedule jafFiles registeredStudents selectedStudents progressSteps",
  };
  try {
    allJobs = await Company.findById(companyId, { companyName: 1 }).populate(
      populateObj
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ allJobs: allJobs });
};

exports.companyLogin = companyLogin;
exports.companyRegistration = companyRegistration;
exports.companyProfile = companyProfile;
exports.companyRequests = companyRequests;
exports.companyNewRequest = companyNewRequest;
exports.getAllJobs = getAllJobs;

const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Admin = require("../models/admin");

const companyLogin = (req, res, next) => {};

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
    approvalStatus: "PENDING APPROVAL",
  });
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
  res.json({ newCompany: newCompany.toObject({ getters: true }) });
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
    companyInfo = await Company.findOne({ _id: companyId });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  const newRequest = {
    rid: companyInfo.requests.length + 1,
    subject,
    message,
  };
  companyInfo.requests.push(newRequest);
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await companyInfo.save({ session: sess });
    await Admin.updateOne(
      {},
      {
        $addToSet: {
          companyRequests: {
            companyId: studId,
            requestStatus: "unread",
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
      path: "registeredStudents",
      select: "name rollNo resumeLink",
    },
    select:
      "jobTitle jobType jobStatus eligibilityCriteria schedule jafFiles registeredStudents selectedStudents",
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
exports.companyRequests = companyRequests;
exports.companyNewRequest = companyNewRequest;
exports.getAllJobs = getAllJobs;

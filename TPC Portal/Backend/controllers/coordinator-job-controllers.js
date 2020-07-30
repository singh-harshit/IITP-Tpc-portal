const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Admin = require("../models/admin");
const Coordinator = require("../models/coordinators");
const Job = require("../models/jobs");

const coordinatorLogin = async (req, res, next) => {
  const { userName, password } = req.body;
  let existingCoordinator;
  try {
    existingCoordinator = await Coordinator.findOne({
      rollNo: userName,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (!existingCoordinator) {
    return next(new HttpError("Invalid credentials", 400));
  }
  const validCoordinator = await bcrypt.compare(
    password,
    existingCoordinator.password
  );
  if (!validCoordinator) return next(new HttpError("Invalid credentials", 400));
  const token = existingCoordinator.generateAuthToken();
  const refreshToken = existingCoordinator.generateRefreshToken();
  res.set("Access-Control-Expose-Headers", "x-auth-token, x-refresh-token");
  res.set("x-auth-token", token);
  res.set("x-refresh-token", refreshToken);
  res.json({ loginStatus: true, _id: existingCoordinator._id });
};

const updateJobId = async (req, res, next) => {
  const jobId = req.params.jid;
  let job;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (!job) {
    return next(new HttpError("Job doesn't exist", 404));
  }
  if (job.jobStatus !== "Pending Approval") {
    return next(
      new HttpError(
        "It is a approved job.You don't have permission to update it",
        403
      )
    );
  }

  const {
    jobTitle,
    jobCategory,
    jobType,
    selectionProcess,
    modeOfInterview,
    schedule,
    eligibilityCriteria,
    publicRemarks,
  } = req.body;
  job.jobTitle = jobTitle;
  job.jobCategory = jobCategory;
  job.modeOfInterview = modeOfInterview;
  job.selectionProcess = selectionProcess;
  job.schedule = schedule;
  job.eligibilityCriteria = eligibilityCriteria;
  job.jobType = jobType;
  job.publicRemarks = publicRemarks;
  try {
    await job.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ updatedJobDetails: job });
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
    companyAddress,
    contact1,
    contact2,
    contact3,
    companyLink,
    remarks,
    companyStatus: "Registered",
    approvalStatus: "Pending Approval",
  });

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  newCompany.password = await bcrypt.hash(password, salt);
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
  res.json({ newCompany: newCompany.toObject({ getters: true }) });
};

const addJobAndCompany = async (req, res, next) => {
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
    jobTitle,
    jobType,
    jobCategory,
    ctc,
    selectionProcess,
    modeOfInterview,
    schedule,
    eligibilityCriteria,
    publicRemarks,
    privateRemarks,
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
  let companyId = newCompany._id;
  const newJob = new Job({
    companyName,
    companyId,
    jobTitle,
    jobType,
    jobCategory,
    selectionProcess,
    modeOfInterview,
    schedule,
    ctc,
    eligibilityCriteria,
    publicRemarks,
    privateRemarks,
    jobStatus: "PENDING APPROVAL",
    //jafFiles: fileLinks,
  });
  newCompany.jobs.push(newJob._id);
  let admin;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newCompany.save({ session: sess });
    await newJob.save({ session: sess });
    admin = await Admin.findOne({}).session(sess);
    admin.jobApproval.push(newJob._id);
    admin.companyApproval.push(newCompany._id);
    await admin.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json("Both added and sent for approval");
};

const resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  const codId = req.params.cid;
  let existingCoordinator;
  const { oldPassword, newPassword } = req.body;
  try {
    existingCoordinator = await Coordinator.findById(codId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (!existingCoordinator) {
    console.log(err);
    const error = new HttpError("You are not allowed", 404);
    return next(error);
  }
  const validOldPassword = await bcrypt.compare(
    oldPassword,
    existingCoordinator.password
  );
  if (validOldPassword) {
    const salt = await bcrypt.genSalt(10);
    existingCoordinator.password = await bcrypt.hash(newPassword, salt);
  } else {
    const error = new HttpError("Invalid Credentials", 404);
    return next(error);
  }
  try {
    await existingCoordinator.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Password Reset", newPassword: newPassword });
};

exports.coordinatorLogin = coordinatorLogin;
exports.addCompany = addCompany;
exports.addJobAndCompany = addJobAndCompany;
exports.updateJobId = updateJobId;
exports.resetPassword = resetPassword;

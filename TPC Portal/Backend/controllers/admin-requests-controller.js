const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Admin = require("../models/admin");

const getAllRequests = async (req, res, next) => {
  let allRequests;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    allRequests = await Admin.findOne(
      {},
      "-_id -name -email -password"
    ).session(sess);
    allRequests = await allRequests
      .populate({
        path: "studentApproval",
        select: "name rollNo program course department",
      })
      .populate({ path: "companyApproval", select: "companyName" })
      .populate({
        path: "jobApproval",
        select: "jobTitle jobCategory jafFiles",
      })
      .populate({ path: "studentRequests.studId", select: "name rollNo" })
      .populate({
        path: "companyRequests.companyId",
        select: "companyName",
      })
      .execPopulate();

    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  let jobApprovals = allRequests.jobApproval;
  let studentApprovals = allRequests.studentApprovals;
  let companyApprovals = allRequests.companyApprovals;
  let studentRequests = allRequests.studentRequests;
  studentRequests = studentRequests.filter(
    (request) => request.requestStatus === "unread"
  );
  companyRequests = allRequests.companyRequests;
  companyRequests = companyRequests.filter(
    (request) => request.requestStatus === "unread"
  );
  res.json({
    studentApprovals: studentApprovals,
    jobApprovals: jobApprovals,
    companyApprovals: companyApprovals,
    studentRequests: studentRequests,
    companyRequests: companyRequests,
  });
};

const approveRequest = async (req, res, next) => {};

const deleteRequest = async (req, res, next) => {};

exports.getAllRequests = getAllRequests;
exports.approveRequest = approveRequest;
exports.deleteRequest = deleteRequest;

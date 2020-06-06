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
    allRequests = await Admin.find({}).populate("studentApproval");
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ allRequests: allRequests });
};

const approveRequest = async (req, res, next) => {};

const deleteRequest = async (req, res, next) => {};

exports.getAllRequests = getAllRequests;
exports.approveRequest = approveRequest;
exports.deleteRequest = deleteRequest;

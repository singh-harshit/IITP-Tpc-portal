const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Admin = require("../models/admin");
const names = require("../models/names-export");
const StudentJob = require("../models/studentjobs");
const Student = require("../models/students");
const Job = require("../models/jobs");
const { exportFilterJobs } = require("./admin-jobs-controllers");

const adminHomeStats = async (req, res, next) => {
  let companiesRegistered, jobsRegistered;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    //companiesRegistered = await Company.count({}).session(sess);
    jobsRegistered = await Job.aggregate([
      { $sort: { jobType: 1 } },
      {
        $group: {
          _id: "$jobType",
          registered: { $sum: 1 },
          offersProvided: { $sum: { $size: "$selectedStudents" } },
        },
      },
    ]);
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something Went wrong! Try again later", 500);
    return next(error);
  }
  console.log(companiesRegistered, jobsRegistered);
  res.json(jobsRegistered);
};

exports.adminHomeStats = adminHomeStats;

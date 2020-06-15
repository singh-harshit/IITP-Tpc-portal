const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Admin = require("../models/admin");
const StudentJob = require("../models/studentjobs");

const getAllJobs = async (req, res, next) => {
  let allJobDetails;
  try {
    allJobDetails = await Job.find(
      { jobType: "FTE" },
      {
        companyName: 1,
        companyId: 1,
        jobTitle: 1,
        jobCategory: 1,
        jobStatus: 1,
        registeredStudents: 1,
        jafFiles: 1,
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({
    allJobDetails: allJobDetails.map((job) => job.toObject({ getters: true })),
  });
};

const getAllJobsWithFilter = async (req, res, next) => {
  const { jobType, program, department, cpiCutOff, jobStatus } = req.body;
  console.log(jobStatus, jobType, program, department, cpiCutOff);
  let filteredJobs;
  try {
    filteredJobs = await Job.aggregate([
      {
        $project: {
          companyName: 1,
          companyId: 1,
          jobTitle: 1,
          jobType: 1,
          jobCategory: 1,
          jobStatus: 1,
          eligibilityCriteria: 1,
          matchedPrograms: {
            $setIntersection: ["$eligibilityCriteria.program", program],
          },
          matchedDepartments: {
            $setIntersection: ["$eligibilityCriteria.department", department],
          },
          registeredStudents: 1,
          jafFiles: 1,
        },
      },
      {
        $match: {
          $and: [
            { jobType: jobType },
            { jobStatus: jobStatus },
            { "eligibilityCriteria.cpiCutOff": { $lte: cpiCutOff } },
            { "matchedPrograms.0": { $exists: true } },
            { "matchedDepartments.0": { $exists: true } },
          ],
        },
      },
      {
        $project: {
          companyName: 1,
          companyId: 1,
          jobTitle: 1,
          jobCategory: 1,
          jobStatus: 1,
          registeredStudents: 1,
          jafFiles: 1,
        },
      },
    ]);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (filteredJobs.Length === 0) {
    const error = new HttpError("No job for this Specifications found", 404);
    return next(error);
  }
  res.json({
    filterdJobs: filteredJobs,
  });
};

const addJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  // const files = req.files;
  // if (!files) {
  //   const error = new HttpError("Please choose at least one Jaf File", 400);
  //   return next(error);
  // }
  // const fileLinks = [];
  // for (file of files) {
  //   fileLinks.push("http://localhost:5000/" + file.path);
  // }
  const {
    companyName,
    companyId,
    jobTitle,
    jobType,
    jobCategory,
    ctc,
    stipend,
    selectionProcess,
    modeOfInterview,
    schedule,
    eligibilityCriteria,
    publicRemarks,
    privateRemarks,
  } = req.body;
  console.log(eligibilityCriteria);
  const newJob = new Job({
    companyName,
    companyId,
    jobTitle,
    jobType,
    jobCategory,
    selectionProcess,
    modeOfInterview,
    schedule,
    eligibilityCriteria,
    publicRemarks,
    privateRemarks,
    jobStatus: "PENDING APPROVAL",
    //jafFiles: fileLinks,
  });
  if (jobType === "FTE") newJob.ctc = ctc;
  else newJob.stipend = stipend;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Write all queries
    await newJob.save({ session: sess });
    const jobId = newJob._id;
    const company = await Company.findById(companyId).session(sess);
    company.jobs.push(jobId);
    await company.save({ session: sess });
    await Admin.updateOne({}, { $addToSet: { jobApproval: jobId } }).session(
      sess
    );
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ newJob: newJob });
};

const exportFilterJobs = (req, res, next) => {};

const openRegistration = async (req, res, next) => {
  const { jobId } = req.body;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const job = await Job.findById(jobId).session(sess);
    job.jobStatus = "OPEN";
    await job.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Status Updated" });
};

const closeRegistration = async (req, res, next) => {
  const jobId = req.body;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const job = await Job.findById(jobId).session(sess);
    job.jobStatus = "CLOSE";
    await job.save({ session: sess });
    // for (eachStudentId of job.eligibleStudents) {
    //   await StudentJob.updateOne(
    //     { studId: eachStudentId },
    //     { $pull: { eligibleJobs: { $in: [jobId] } } }
    //   ).session(sess);
    // }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Registration Closed" });
};

const deleteJob = async (req, res, next) => {
  const jobId = req.body;
  let message;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const job = await Job.findById(jobId).session(sess);
    console.log(job);
    if (!job) {
      return next(new HttpError("Job not found", 404));
    }
    console.log(job.registeredStudents.length);
    if (job.registeredStudents.length === 0) {
      await job.remove({ session: sess });
      message = "Deleted";
    } else {
      // Drop
      job.jobStatus = "DROPPED";
      await job.save({ session: sess });
      message = "Dropped";
    }

    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: message });
};

const approvedCompanies = async (req, res, next) => {
  let companiesResult;
  try {
    companiesResult = await Company.find(
      { approvalStatus: true },
      { companyName: 1 }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (companiesResult.length === 0) {
    const error = new HttpError("No company is Approved till now!", 404);
    return next(error);
  }
  console.log(companiesResult);
  res.json({ approvedCompanies: companiesResult });
};

const getJobById = async (req, res, next) => {
  const jobId = req.params.jid;
  let jobDetails;
  try {
    jobDetails = await Job.findById(jobId, {
      companyName: 1,
      jobTitle: 1,
      companyId: 1,
      jobCategory: 1,
      jobType: 1,
      jafFiles: 1,
      selectionProcess: 1,
      schedule: 1,
      publicRemarks: 1,
      privateRemarks: 1,
    }).populate("registeredStudents", {
      name: 1,
      studId: 1,
      rollNo: 1,
      cpi: 1,
      course: 1,
      program: 1,
      department: 1,
      instituteEmail: 1,
      mobileNumber: 1,
      resumeFile: 1,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ jobDetails: jobDetails });
};

const updateJobById = async (req, res, next) => {
  const jobId = req.params.jid;
  let job;
  const {
    jobTitle,
    jobCategory,
    ctc,
    stipend,
    selectionProcess,
    modeOfInterview,
    schedule,
    eligibilityCriteria,
    publicRemarks,
  } = req.body;
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
  job.jobTitle = jobTitle;
  job.jobCategory = jobCategory;
  job.modeOfInterview = modeOfInterview;
  job.selectionProcess = selectionProcess;
  job.schedule = schedule;
  job.eligibilityCriteria = eligibilityCriteria;
  job.publicRemarks = publicRemarks;
  if (job.jobType === "FTE") job.ctc = ctc;
  else job.stipend = stipend;
  try {
    await job.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ updatedJobDetails: job });
};

const activeApplicantsByJobId = async (req, res, next) => {
  const jobId = req.params.jid;
  let activeStudents;
  try {
    activeStudents = await Job.findById(jobId, { activeStudents: 1 }).populate(
      "activeStudents",
      {
        name: 1,
        studId: 1,
        rollNo: 1,
        cpi: 1,
        course: 1,
        program: 1,
        department: 1,
        instituteEmail: 1,
        mobileNumber: 1,
        resumeFile: 1,
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ activeStudents: activeStudents });
};

exports.getAllJobs = getAllJobs;
exports.getAllJobsWithFilter = getAllJobsWithFilter;
exports.addJob = addJob;
exports.exportFilterJobs = exportFilterJobs;
exports.openRegistration = openRegistration;
exports.closeRegistration = closeRegistration;
exports.deleteJob = deleteJob;
exports.approvedCompanies = approvedCompanies;
exports.getJobById = getJobById;
exports.updateJobById = updateJobById;
exports.activeApplicantsByJobId = activeApplicantsByJobId;

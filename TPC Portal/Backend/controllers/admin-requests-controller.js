const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Admin = require("../models/admin");
const StudentJob = require("../models/studentjobs");

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
      .populate({ path: "companyApproval", select: "companyName" })
      .populate({
        path: "jobApproval",
        select: "jobTitle jobCategory jafFiles",
      })
      .populate({
        path: "studentApproval",
        select: "name rollNo program course department",
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
  let studentApprovals = allRequests.studentApproval;
  let companyApprovals = allRequests.companyApproval;
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

const approveRequest = async (req, res, next) => {
  //approvalType :- [Student,Company,Job]
  const Id = req.params.id;
  const { approvalType } = req.body;
  if (approvalType === "S") {
    let student;
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      student = await Student.findById(Id).session(sess);
      if (!student) {
        return next(new HttpError("Student doesn't exist", 404));
      }
      student.approvalStatus = "ACTIVE";
      await student.save({ session: sess });
      await Admin.updateOne(
        {},
        { $pull: { studentApproval: { $in: [Id] } } }
      ).session(sess);
      const newStudentJob = new StudentJob({
        studId: Id,
      });
      await newStudentJob.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong ! try again later",
        500
      );
      return next(error);
    }
    res.json({ message: "Student Approved", approvedStudentId: Id });
  } else if (approvalType === "C") {
    let company;
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      company = await Company.findById(id).session(sess);
      if (!company) {
        return next(new HttpError("Company doesn't exist", 404));
      }
      company.approvalStatus = "ACTIVE";
      await company.save();
      await Admin.updateOne(
        {},
        { $pull: { companyApproval: { $in: [Id] } } }
      ).session(sess);
      await sess.commitTransaction();
      res.json({ message: "Company Approved", approvedComapanyId: Id });
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong ! try again later",
        500
      );
      return next(error);
    }
  } else if (approvalType === "J") {
    let job;
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      job = await Job.findById(Id).session(sess);
      if (!job) {
        return next(new HttpError("Job doesn't exist", 404));
      }
      job.jobStatus = "OPEN";
      await job.save({ session: sess });
      await Admin.updateOne(
        {},
        { $pull: { jobApproval: { $in: [Id] } } }
      ).session(sess);
      // Code for filtering for eligible student and displaying in their eligible section
      const jobType = job.jobType;
      const program = job.eligibilityCriteria.program;
      const department = job.eligibilityCriteria.department;
      const course = job.eligibilityCriteria.course;
      const cpiCutOff = job.eligibilityCriteria.cpiCutOff || 0.0;
      const tenthMarks = job.eligibilityCriteria.tenthMarks || 0.0;
      const twelthMarks = job.eligibilityCriteria.twelthMarks || 0.0;
      // External filtering for the Companies
      const students = await Student.find(
        {
          $and: [
            { approvalStatus: "ACTIVE" },
            { registrationFor: jobType },
            { program: program },
            { department: department },
            { cpi: { $gte: cpiCutOff } },
            { tenthMarks: { $gte: tenthMarks } },
            { twelthMarks: { $gte: twelthMarks } },
            { $or: [{ course: { $exists: false } }, { course: course }] },
          ],
        },
        { studId: 1, placement: 1, course: 1 }
      ).session(sess);
      console.log(students);
      // Internal Filtering
      for (eachStudent of students) {
        let eligible = false;
        if (eachStudent.placement.status === "unplaced") {
          eligible = true;
        } else {
          const A1count = eachStudent.placement.applicationCount.A1count;
          const PSUcount = eachStudent.placement.applicationCount.PSUcount;
          const A2count = eachStudent.placement.applicationCount.A2count;
          const B1count = eachStudent.placement.applicationCount.B1count;
          if (eachStudent.placement.category === "A1") eligible = false;
          else if (eachStudent.placement.category === "A2") {
            if (job.jobCategory === "A1" && A1count < 2) eligible = true;
            else if (job.jobCategory === "PSU" && PSUcount < 2) eligible = true;
          } else if (eachStudent.placement.category === "PSU") {
            if (job.jobCategory === "A1" && A1count < 2) eligible = true;
          } else if (eachStudent.placement.category === "B1") {
            if (job.jobCategory === "A1" && A1count < 2) eligible = true;
            else if (job.jobCategory === "PSU" && PSUcount < 2) eligible = true;
            else if (job.jobCategory === "A2" && A2count < 2) eligible = true;
          } else if (eachStudent.placement.category === "B2") {
            if (job.jobCategory === "A1" && A1count < 2) eligible = true;
            else if (job.jobCategory === "PSU" && PSUcount < 2) eligible = true;
            else if (job.jobCategory === "A2" && A2count < 2) eligible = true;
            else if (job.jobCategory === "B1" && B1count < 2) eligible = true;
          }
        }
        if (eligible === true) {
          await StudentJob.updateOne(
            { studId: eachStudent._id },
            { $addToSet: { eligibleJobs: Id } }
          ).session(sess);
        }
      }
      await sess.commitTransaction();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong ! try again later",
        500
      );
      return next(error);
    }
    res.json({ message: "Job Approved and Distributed to Eligible students" });
  } else {
    const error = new HttpError("Enter a valid approvalType", 500);
    return next(error);
  }
};

const deleteRequest = async (req, res, next) => {
  // const { deletionType, Id } = req.body;
  const { approvalType, Id } = req.body;
  if (deletionType === "S") {
    let student;
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      student = await Student.findById(Id).session(sess);
      student.approvalStatus = "DROPPED";
      await student.save({ session: sess });
      await Admin.updateOne(
        {},
        { $pull: { studentApproval: { $in: [Id] } } }
      ).session(sess);
      await sess.commitTransaction();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong ! try again later",
        500
      );
      return next(error);
    }
    res.json({ message: "Request Deleted" });
  } else if (deletionType === "C") {
    let company;
    const sess = await mongoose.startSession();
    sess.startTransaction();
    company = await Company.findById(Id).session(sess);
    company.approvalStatus = "DROPPED";
    await company.save({ session: sess });
    await Admin.updateOne(
      {},
      { $pull: { companyApproval: { $in: [Id] } } }
    ).session(sess);
    await sess.commitTransaction();
    res.json({ message: "Request Deleted" });
  } else if (deletionType === "J") {
    let job;
    const sess = await mongoose.startSession();
    sess.startTransaction();
    job = await job.findById(Id).session(sess);
    job.jobStatus = "DROPPED";
    await job.save({ session: sess });
    await Admin.updateOne(
      {},
      { $pull: { jobApproval: { $in: [Id] } } }
    ).session(sess);
    await sess.commitTransaction();
    res.json({ message: "Request Deleted" });
  } else {
    return next(
      new HttpError(
        "Enter a valid deletion Type[S - Student,C - Company, J - Job]",
        500
      )
    );
  }
};

const sortStudentRequests = async (req, res, next) => {};
const approveStudetnRequestsInBulk = async (req, res, next) => {
  //studIds :- list of student ids which we want to approve altogether (can be selected from checkboxes)
  const { studIds } = req.body;
};

exports.getAllRequests = getAllRequests;
exports.approveRequest = approveRequest;
exports.deleteRequest = deleteRequest;
exports.sortStudentRequests = sortStudentRequests;
exports.approveStudetnRequestsInBulk = approveStudetnRequestsInBulk;

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
        options: { sort: "name" },
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
  let companyRequests = allRequests.companyRequests;
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
        if (eachStudent.placement.status === "ACTIVE") {
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
          job.eligibleStudents.push(eachStudent._id);
          await StudentJob.updateOne(
            { studId: eachStudent._id },
            { $addToSet: { eligibleJobs: Id } }
          ).session(sess);
        }
      }
      // Adding our first step in progress steps of this job
      const newStep = {
        name: "Registration",
        status: "OPEN",
      };
      job.progressSteps.push(newStep);
      await job.save({ session: sess });
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
  const Id = req.params.id;
  const { deletionType } = req.body;
  if (deletionType === "S") {
    let student;
    try {
      student = await Student.findById(Id);
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong ! try again later",
        500
      );
    }
    if (!student) {
      const error = new HttpError("Student Not Found", 404);
      return next(error);
    }
    student.approvalStatus = "DROPPED";
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
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

const sortStudentRequestsByCourse = async (req, res, next) => {
  let sortedByCourse;
  try {
    sortedByCourse = await Admin.findOne({}).populate({
      path: "studentApproval",
      select: "name rollNo program course department",
      options: { sort: "course" },
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ studentApprovals: sortedByCourse });
};

const sortStudentRequestsByProgram = async (req, res, next) => {
  let sortedByProgram;
  try {
    sortedByProgram = await Admin.findOne({}).populate({
      path: "studentApproval",
      select: "name rollNo program course department",
      options: { sort: "program" },
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ studentApprovals: sortedByProgram });
};

const approveStudetnRequestsInBulk = async (req, res, next) => {
  //studIds :- list of student ids which we want to approve altogether (can be selected from checkboxes)
  const { studIds } = req.body;
  if (studIds.length === 0) {
    return next(new HttpError("At least select one student for approval", 404));
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (eachId of studIds) {
      let student;
      student = await Student.findById(eachId).session(sess);
      if (student) {
        student.approvalStatus = "ACTIVE";
        await student.save({ session: sess });
        const newStudentJob = new StudentJob({
          studId: eachId,
        });
        await newStudentJob.save({ session: sess });
      }
      await Admin.updateOne(
        {},
        { $pull: { studentApproval: { $in: [eachId] } } }
      ).session(sess);
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "All possible approval done" });
};

const markReadStudentRequests = async (req, res, next) => {
  const requestId = req.params.rid;
  const { studId } = req.body;
  let student;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    student = await Student.aggregate([
      {
        $project: {
          idString: { $toString: "$_id" },
          _id: 1,
        },
      },
      { $match: { idString: studId } },
    ]);
    //console.log(student);
    let Id = student[0]._id;
    await Student.updateOne(
      { _id: Id, "requests._id": requestId },
      { $set: { "requests.$.status": "read" } }
    ).session(sess);
    await Admin.updateOne(
      {},
      { $pull: { studentRequests: { _id: requestId } } }
    ).session(sess);
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "Marked Read" });
};

const markReadCompanyRequests = async (req, res, next) => {
  const requestId = req.params.rid;
  const { companyId } = req.body;
  let company;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    company = await Company.aggregate([
      {
        $project: {
          idString: { $toString: "$_id" },
          _id: 1,
        },
      },
      { $match: { idString: companyId } },
    ]);
    let Id = company[0]._id;
    await Company.updateOne(
      { _id: Id, "requests._id": requestId },
      { $set: { "requests.$.status": "read" } }
    ).session(sess);
    await Admin.updateOne(
      {},
      { $pull: { companyRequests: { _id: requestId } } }
    ).session(sess);
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "Marked Read" });
};
exports.getAllRequests = getAllRequests;
exports.approveRequest = approveRequest;
exports.deleteRequest = deleteRequest;
exports.sortStudentRequestsByCourse = sortStudentRequestsByCourse;
exports.sortStudentRequestsByProgram = sortStudentRequestsByProgram;
exports.approveStudetnRequestsInBulk = approveStudetnRequestsInBulk;
exports.markReadStudentRequests = markReadStudentRequests;
exports.markReadCompanyRequests = markReadCompanyRequests;

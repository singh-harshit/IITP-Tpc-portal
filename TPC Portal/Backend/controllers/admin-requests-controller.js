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
        select: "jobTitle jobCategory jafFiles companyName",
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
  let updateResult;
  if (approvalType === "S") {
    let student;
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      student = await Student.findById(Id).session(sess);
      if (!student) {
        return next(new HttpError("Student doesn't exist", 404));
      }
      student.approvalStatus = "Active";
      await student.save({ session: sess });
      updateResult = await Admin.updateOne(
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
      company = await Company.findById(Id).session(sess);
      if (!company) {
        return next(new HttpError("Company doesn't exist", 404));
      }
      company.approvalStatus = "Active";
      company.companyStatus = "Active";
      await company.save({ session: sess });
      await Admin.updateOne(
        {},
        { $pull: { companyApproval: { $in: [Id] } } }
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
    res.json({ message: "Company Approved", approvedCompanyId: Id });
  } else if (approvalType === "J") {
    let job;
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      job = await Job.findById(Id).session(sess);
      if (!job) {
        return next(new HttpError("Job doesn't exist", 404));
      }
      job.jobStatus = "Open";
      eligibilityCriteria = job.eligibilityCriteria;
      let students = await Student.find(
        {
          approvalStatus: "Active",
          registrationFor: job.jobType,
        },
        {
          program: 1,
          course: 1,
          cpi: 1,
          tenthMarks: 1,
          twelthMarks: 1,
          bachelorsMarks: 1,
          mastersMarks: 1,
          placement: 1,
        }
      );
      await Admin.updateOne(
        {},
        { $pull: { jobApproval: { $in: [Id] } } }
      ).session(sess);
      let filteredStudents = [];
      for (eachStudent of students) {
        console.log(eachStudent);
        for (each of eligibilityCriteria) {
          if (
            each.program == eachStudent.program &&
            each.course.indexOf(eachStudent.course) != -1 &&
            eachStudent.cpi >= each.cpiCutOff &&
            eachStudent.tenthMarks >= each.tenthMarks &&
            eachStudent.twelthMarks >= each.twelthMarks &&
            eachStudent.bachelorsMarks >= each.bachelorsMarks &&
            eachStudent.mastersMarks >= each.mastersMarks
          ) {
            filteredStudents.push(eachStudent);
            break;
          }
        }
      }
      console.log("Filtered Students");
      console.log(filteredStudents);
      // Internal Filtering
      for (eachStudent of filteredStudents) {
        let eligible = false;
        if (eachStudent.placement.status === "Unplaced") {
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
        status: "Not Completed",
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
    student.approvalStatus = "Dropped";
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
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      company = await Company.findById(Id).session(sess);
      company.approvalStatus = "Dropped";
      await company.save({ session: sess });
      await Admin.updateOne(
        {},
        { $pull: { companyApproval: { $in: [Id] } } }
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
  } else if (deletionType === "J") {
    let job, companyId;
    try {
      job = await Job.findById(Id);
    } catch (err) {
      return next(
        new HttpError(
          "Enter a valid deletion Type[S - Student,C - Company, J - Job]",
          500
        )
      );
    }
    companyId = job.companyId;
    console.log(job);
    console.log(companyId);
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await Job.deleteOne({ _id: Id }).session(sess);
      await Company.updateOne(
        { _id: companyId },
        { $pull: { jobs: { $in: [Id] } } }
      ).session(sess);
      await Admin.updateOne(
        {},
        { $pull: { jobApproval: { $in: [Id] } } }
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

const approveStudentRequestsInBulk = async (req, res, next) => {
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
        student.approvalStatus = "Active";
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
    if (!student[0]) return next(new HttpError("Student Not Found", 404));
    let Id = student[0]._id;
    student = await Student.findOne({
      _id: Id,
      "requests._id": requestId,
    }).session(sess);
    if (!student) {
      return next(new HttpError("Request Not Found", 404));
    }
    console.log(student);
    await Student.updateOne(
      { _id: Id, "requests._id": requestId },
      { $set: { "requests.$.status": "Read" } }
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
    if (!company[0]) return next(new HttpError("Company Not Found", 404));

    let Id = company[0]._id;
    company = await Company.findOne({
      _id: Id,
      "requests._id": requestId,
    }).session(sess);
    if (!company) {
      return next(new HttpError("Request Not Found", 404));
    }
    console.log(company);

    await Company.updateOne(
      { _id: Id, "requests._id": requestId },
      { $set: { "requests.$.status": "Read" } }
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
exports.approveStudentRequestsInBulk = approveStudentRequestsInBulk;
exports.markReadStudentRequests = markReadStudentRequests;
exports.markReadCompanyRequests = markReadCompanyRequests;

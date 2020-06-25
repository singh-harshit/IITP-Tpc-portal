const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Admin = require("../models/admin");
const StudentJob = require("../models/studentjobs");

const getAllStudents = async (req, res, next) => {
  let studentsInfo;
  try {
    studentsInfo = await Student.aggregate([
      { $match: { registrationFor: "FTE" } },
      {
        $project: {
          name: 1,
          rollNo: 1,
          program: 1,
          department: 1,
          course: 1,
          cpi: 1,
          instituteEmail: 1,
          mobileNumber: 1,
          resumeLink: 1,
          resumeFile: 1,
          status: {
            $cond: {
              if: { $eq: ["$placement.status", "placed"] },
              then: {
                $concat: ["$placement.status", " in ", "$placement.category"],
              },
              else: "$placement.status",
            },
          },
        },
      },
    ]);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ studentsInfo: studentsInfo });
};

const getAllStudentsWithFilter = async (req, res, next) => {
  const { registrationFor, program, department, cpi, status } = req.body;
  let studentsInfo;
  try {
    studentsInfo = await Student.aggregate([
      {
        $project: {
          name: 1,
          rollNo: 1,
          program: 1,
          department: 1,
          course: 1,
          cpi: 1,
          registrationFor: 1,
          instituteEmail: 1,
          mobileNumber: 1,
          resumeLink: 1,
          resumeFile: 1,
          matchedProgram: { $in: ["$program", program] },
          matchedDepartment: { $in: ["$department", department] },
          status: {
            $cond: {
              if: { $eq: ["$placement.status", "placed"] },
              then: {
                $concat: ["$placement.status", " in ", "$placement.category"],
              },
              else: "$placement.status",
            },
          },
        },
      },
      {
        $match: {
          $and: [
            { registrationFor: registrationFor },
            { status: status },
            { cpi: { $gte: cpi } },
            { matchedDepartment: true },
            { matchedProgram: true },
          ],
        },
      },
    ]);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ studentsInfo: studentsInfo });
};

const exportFilteredStudents = async (req, res, next) => {
  const { registrationFor, program, department, cpi, status } = req.body;
  let studentsInfo;
  try {
    studentsInfo = await Student.aggregate([
      {
        $project: {
          name: 1,
          rollNo: 1,
          program: 1,
          department: 1,
          course: 1,
          cpi: 1,
          registrationFor: 1,
          instituteEmail: 1,
          mobileNumber: 1,
          resumeLink: 1,
          resumeFile: 1,
          matchedProgram: { $in: ["$program", program] },
          matchedDepartment: { $in: ["$department", department] },
          status: {
            $cond: {
              if: { $eq: ["$placement.status", "placed"] },
              then: {
                $concat: ["$placement.status", " in ", "$placement.category"],
              },
              else: "$placement.status",
            },
          },
        },
      },
      {
        $match: {
          $and: [
            { registrationFor: registrationFor },
            { status: status },
            { cpi: { $gte: cpi } },
            { matchedDepartment: true },
            { matchedProgram: true },
          ],
        },
      },
    ]);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  var info = JSON.stringify(studentsInfo);
      var info1 = JSON.parse(info);
      res.xls("data.xlsx", info1);
};

const getStudentById = async (req, res, next) => {
  const studId = req.params.sid;
  let studentInfo, studentAppliedJobs, studentEligibleJobs;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    studentInfo = await Student.findById(studId, {
      name: 1,
      rollNo: 1,
      program: 1,
      department: 1,
      course: 1,
      instituteEmail: 1,
      mobileNumber: 1,
      gender: 1,
      currentSemester: 1,
      spi: 1,
      cpi: 1,
      personalEmail: 1,
    }).session(sess);
    studentAppliedJobs = await StudentJob.findOne(
      { studId: studId },
      { studId: 1, appliedJobs: 1, _id: 0 }
    ).populate("appliedJobs.jobId", {
      companyName: 1,
      jobTitle: 1,
      jobCategory: 1,
    });
    studentEligibleJobs = await StudentJob.findOne(
      { studId: studId },
      { studId: 1, eligibleJobs: 1, _id: 0 }
    ).populate("eligibleJobs", {
      companyName: 1,
      jobTitle: 1,
      jobCategory: 1,
      jobStatus: 1,
    });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({
    studentInfo: studentInfo,
    studentAppliedJobs: studentAppliedJobs,
    studentEligibleJobs: studentEligibleJobs,
  });
};

const updateStudentById = async (req, res, next) => {
  const studId = req.params.sid;
  const {
    name,
    rollNo,
    program,
    department,
    course,
    instituteEmail,
    mobileNumber,
    gender,
    currentSemester,
    spi,
    cpi,
    personalEmail,
  } = req.body;
  try {
    await Student.updateById(studId, {
      $set: {
        name: name,
        rollNo: rollNo,
        gender: gender,
        program: program,
        department: department,
        currentSemester: currentSemester,
        cpi: cpi,
        spi: spi,
        course: course,
        instituteEmail: instituteEmail,
        personalEmail: personalEmail,
        mobileNumber: mobileNumber,
      },
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Student Profile Updated" });
};

const resetPassword = async (req, res, next) => {
  const studId = req.params.sid;
  const { newPassword } = req.body;
  let student;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    student = await Student.findById(studId).session(sess);
    if (!student) {
      return next(new HttpError("Student not Found", 404));
    }
    student.password = newPassword;
    await student.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Password updated for" + student.rollNo });
};

const changeStatus = async (req, res, next) => {
  const studId = req.params.sid;
  const { status } = req.body;
  let student;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    student = await Student.findById(studId).session(sess);
    student.placement.status = status;
    await student.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Status Updated" });
};

const statusOfCpiUpdate = async (req, res, next) => {
  const { status } = req.body;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    admin = await Admin.findOne({}).session(sess);
    admin.onlyCpiUpdate = status;
    await admin.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (status === true) res.json({ message: "Unlocked" });
  else res.json({ message: "Locked" });
};

exports.getAllStudents = getAllStudents;
exports.getAllStudentsWithFilter = getAllStudentsWithFilter;
exports.exportFilteredStudents = exportFilteredStudents;
exports.getStudentById = getStudentById;
exports.updateStudentById = updateStudentById;
exports.resetPassword = resetPassword;
exports.changeStatus = changeStatus;
exports.statusOfCpiUpdate = statusOfCpiUpdate;

const bcrypt = require("bcrypt");
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
      {
        $project: {
          name: 1,
          rollNo: 1,
          program: 1,
          registrationFor: 1,
          course: 1,
          cpi: 1,
          instituteEmail: 1,
          mobileNumber: 1,
          resumeLink: 1,
          resumeFile: 1,
          approvalStatus: 1,
          status: {
            $cond: {
              if: { $eq: ["$placement.status", "Placed"] },
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
      course: 1,
      instituteEmail: 1,
      mobileNumber: 1,
      gender: 1,
      currentSemester: 1,
      spi: 1,
      cpi: 1,
      personalEmail: 1,
      approvalStatus: 1,
      tenthMarks: 1,
      twelthMarks: 1,
      bachelorsMarks: 1,
      mastersMarks: 1,
      image: 1,
    }).session(sess);
    studentAppliedJobs = await StudentJob.findOne(
      { studId: studId },
      { appliedJobs: 1, _id: 0 }
    ).populate("appliedJobs.jobId", {
      companyName: 1,
      jobTitle: 1,
      jobCategory: 1,
    });
    studentEligibleJobs = await StudentJob.findOne(
      { studId: studId },
      { eligibleJobs: 1, _id: 0 }
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
    tenthMarks,
    twelthMarks,
    bachelorsMarks,
    mastersMarks,
  } = req.body;
  try {
    await Student.updateOne(
      { _id: studId },
      {
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
          tenthMarks: tenthMarks,
          twelthMarks: twelthMarks,
          bachelorsMarks: bachelorsMarks,
          mastersMarks: mastersMarks,
        },
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Student Profile Updated" });
};

const resetPassword = async (req, res, next) => {
  const studId = req.params.sid;
  let { newPassword } = req.body;
  let student;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    student = await Student.findById(studId).session(sess);
    if (!student) {
      return next(new HttpError("Student not Found", 404));
    }
    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    await student.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Password updated for " + student.rollNo });
};

const changeStatus = async (req, res, next) => {
  const studId = req.params.sid;
  const { status } = req.body;
  let student;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    student = await Student.findById(studId).session(sess);
    student.approvalStatus = status;
    if (status == "Active") {
      studJob = await StudentJob.findOne({ studId: studId }).session(sess);
      if (!studJob) {
        const newStudentJob = new StudentJob({
          studId: studId,
        });
        await newStudentJob.save({ session: sess });
      }
    }
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
exports.getStudentById = getStudentById;
exports.updateStudentById = updateStudentById;
exports.resetPassword = resetPassword;
exports.changeStatus = changeStatus;
exports.statusOfCpiUpdate = statusOfCpiUpdate;

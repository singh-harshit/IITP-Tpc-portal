const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Student = require("../models/students");

const login = async (req, res, next) => {};

const registration = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  const {
    name,
    rollNo,
    gender,
    instituteEmail,
    personalEmail,
    mobileNumber,
    registrationFor,
    program,
    department,
    course,
    currentSemester,
    spi,
    cpi,
    tenthMarks,
    twelthMarks,
    bachelorsMarks,
    mastersMarks,
    password,
  } = req.body;

  let existingStudent;
  try {
    existingStudent = await Student.findOne({ rollNo: rollNo });
  } catch (err) {
    console.log(err);
    const error = new HttpError("SignUp Failed! try again later", 500);
    return next(error);
  }
  console.log(existingStudent);
  if (existingStudent) {
    const error = new HttpError("User already exist! login Instead", 422);
    return next(error);
  }

  const newStudent = new Student({
    studId: rollNo,
    name,
    rollNo,
    gender,
    instituteEmail,
    personalEmail,
    mobileNumber,
    registrationFor,
    program,
    department,
    course,
    currentSemester,
    spi,
    cpi,
    tenthMarks,
    twelthMarks,
    bachelorsMarks,
    mastersMarks,
    password,
    placement: {
      placementStatus: "unplaced",
      placedCategory: "",
    },
    approvalStatus: false,
  });

  // Saving to Database
  try {
    await newStudent.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ newStudent: newStudent.toObject({ getters: true }) });
};

const profile = async (req, res, next) => {
  const studId = req.params.sid;
  let studentInfo;
  console.log(studId);
  try {
    studentInfo = await Student.aggregate([
      { $match: { studId: studId } },
      {
        $project: {
          _id: 0,
          name: 1,
          rollNo: 1,
          instituteEmail: 1,
          personalEmail: 1,
          gender: 1,
          mobileNumber: 1,
          registrationFor: 1,
          program: 1,
          department: 1,
          course: 1,
          currentSemester: 1,
          spi: 1,
          cpi: 1,
          tenthMarks: 1,
          twelthMarks: 1,
          bachelorsMarks: 1,
          mastersMarks: 1,
          approvalStatus: 1,
        },
      },
    ]);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ studentInfo: studentInfo });
};

const appliedJobs = async (req, res, next) => {};

const eligibleJobs = async (req, res, next) => {};

const requests = async (req, res, next) => {
  const studId = req.params.sid;
  let oldRequests;
  try {
    oldRequests = await Student.findOne(
      { studId: studId },
      { _id: 0, studId: 1, requests: 1 }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ oldRequests: oldRequests });
};

const newRequest = async (req, res, next) => {
  const studId = req.params.sid;
  const { subject, message } = req.body;
  let studentInfo;
  try {
    studentInfo = await Student.findOne({ studId: studId });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  const newRequest = {
    rid: studentInfo.requests.length + 1,
    subject,
    message,
  };
  studentInfo.requests.push(newRequest);
  try {
    await studentInfo.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ studentInfo: studentInfo.toObject() });
};

const resumeUpload = async (req, res, next) => {};

const resetPassword = async (req, res, next) => {};

exports.login = login;
exports.registration = registration;
exports.profile = profile;
exports.appliedJobs = appliedJobs;
exports.eligibleJobs = eligibleJobs;
exports.requests = requests;
exports.newRequest = newRequest;
exports.resumeUpload = resumeUpload;
exports.resetPassword = resetPassword;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Admin = require("../models/admin");
const StudentJob = require("../models/studentjobs");
const Coordinator = require("../models/coordinators");
const Role = require("../models/Role");

const setJobClassifications = async (req, res, next) => {
  const { classifications } = req.body;
  try {
    await Admin.updateOne(
      {},
      { $set: { allJobClassifications: classifications } }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "New job classification added" });
};

const setJobSteps = async (req, res, next) => {
  const { steps } = req.body;
  try {
    await Admin.updateOne({}, { $set: { allJobSteps: steps } });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "New job step added" });
};

const setJobStatus = async (req, res, next) => {
  const { status } = req.body;
  try {
    await Admin.updateOne({}, { $set: { allJobStatus: status } });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "New job status added" });
};

const setStudentPrograms = async (req, res, next) => {
  const { programs } = req.body;
  try {
    await Admin.updateOne({}, { $set: { allStudentPrograms: programs } });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "New student program added" });
};

const setStudentDepartments = async (req, res, next) => {
  const { departments } = req.body;
  try {
    await Admin.updateOne({}, { $set: { allStudentDepartments: departments } });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "New student department added" });
};

const setStudentCourses = async (req, res, next) => {
  const { courses } = req.body;
  try {
    await Admin.updateOne({}, { $set: { allStudentCourses: courses } });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "New student course added" });
};

const getAllDetails = async (req, res, next) => {
  let classifications,
    steps,
    status,
    programs,
    courses,
    departments,
    guideLines;
  let admin;
  try {
    admin = await Admin.findOne(
      {},
      {
        allJobClassifications: 1,
        allJobSteps: 1,
        allJobStatus: 1,
        allStudentPrograms: 1,
        allStudentCourses: 1,
        allStudentDepartments: 1,
        guideLines: 1,
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  classifications = admin.allJobClassifications;
  steps = admin.allJobSteps;
  status = admin.allJobStatus;
  programs = admin.allStudentPrograms;
  courses = admin.allStudentCourses;
  departments = admin.allStudentDepartments;
  guideLines = admin.guideLines;
  res.json({
    classifications: classifications,
    steps: steps,
    status: status,
    programs: programs,
    courses: courses,
    departments: departments,
    guideLines: guideLines,
  });
};

// const getAllRules = async (req, res, next) => {
//   let allRules, admin;
//   try {
//     admin = await Admin.findOne({}, { allRules: 1 });
//     allRules = admin.allRules;
//   } catch (err) {
//     console.log(err);
//     const error = new HttpError("Something went wrong ! try again later", 500);
//     return next(error);
//   }
//   res.json({ allRules: allRules });
// };

// const setNewRule = async (req, res, next) => {
//   const { category, subject, body } = req.body;
//   let allRules, newRule, admin;
//   newRule = { subject, body };
//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     admin = await Admin.findOne({ "allRules.category": category }).session(
//       sess
//     );
//     if (admin) {
//       await Admin.updateOne(
//         { "allRules.category": category },
//         { $addToSet: { "allRules.$.rules": newRule } }
//       ).session(sess);
//     } else {
//       await Admin.updateOne(
//         {},
//         { $addToSet: { allRules: { category: category, rules: newRule } } }
//       ).session(sess);
//     }
//     admin = await Admin.findOne({}, { allRules: 1 }).session(sess);
//     allRules = admin.allRules;
//     await sess.commitTransaction();
//   } catch (err) {
//     console.log(err);
//     const error = new HttpError("Something went wrong ! try again later", 500);
//     return next(error);
//   }
//   res.json({ allRules: allRules });
// };

const setGuideLines = async (req, res, next) => {
  const { guideLines } = req.body;
  try {
    await Admin.updateOne({}, { $set: { guideLines: guideLines } });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong ! try again later", 500));
  }
  res.json({ newGuideLines: guideLines });
};

const assignNewCoordinator = async (req, res, next) => {
  const {
    name,
    rollNo,
    emailId,
    password,
    mobileNumber1,
    mobileNumber2,
  } = req.body;
  let coordinator;
  try {
    coordinator = await Coordinator.findOne({ emailId: emailId });
  } catch (err) {
    return next(new HttpError("Something went wrong ! try again later", 500));
  }
  if (coordinator)
    return next(
      new HttpError("Coordinator with this emailId already Exist", 403)
    );

  const newCoordinator = new Coordinator({
    name,
    rollNo,
    emailId,
    password,
    mobileNumber1,
    mobileNumber2,
    role: Role.Coordinator,
  });

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  newCoordinator.password = await bcrypt.hash(password, salt);

  try {
    await newCoordinator.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong ! try again later", 500));
  }
  res.json({ message: "New Coordinator assigned" });
};

const getAllCoordinators = async (req, res, next) => {
  let coordinators;
  try {
    coordinators = await Coordinator.find(
      {},
      { name: 1, emailId: 1, mobileNumber1: 1, mobileNumber2: 1 }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ allCoordinators: coordinators });
};

const deleteCoordinator = async (req, res, next) => {
  const { coordinatorsId } = req.body;
  try {
    await Coordinator.deleteMany({ _id: coordinatorsId });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json("Coordinators Deleted");
};

const resetPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  let admin;
  try {
    admin = await Admin.findOne({}, { password: 1 });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  const validAdmin = await bcrypt.compare(oldPassword, admin.password);
  if (!validAdmin) return next(new HttpError("Invalid Credentials", 400));
  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(newPassword, salt);
  await admin.save();
  res.json({ message: "Password Updated" });
};

const resetCodPassword = async (req, res, next) => {
  const codId = req.params.codId;
  const { newPassword } = req.body;
  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  newPassword = await bcrypt.hash(newPassword, salt);
  try {
    await Coordinator.updateOne(
      { _id: codId },
      { $set: { password: newPassword } }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "Coordinator Password Updated" });
};

const changeRegistrationStatus = async (req, res, next) => {
  let admin;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    admin = await Admin.findOne({}, { registrationStatus: 1 }).session(sess);
    if (admin.registrationStatus == false) admin.registrationStatus = true;
    else admin.registrationStatus = false;
    await admin.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  if (admin.registrationStatus) res.json({ message: "Registration Open" });
  else res.json({ message: "Registration Closed" });
};

const checkRegistrationStatus = async (req, res, next) => {
  let RegStatus, admin;
  try {
    admin = await Admin.findOne({}, { registrationStatus: 1 });
    RegStatus = admin.registrationStatus;
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ RegStatus: RegStatus });
};

exports.setJobClassifications = setJobClassifications;
exports.setJobStatus = setJobStatus;
exports.setJobSteps = setJobSteps;
exports.setStudentCourses = setStudentCourses;
exports.setStudentDepartments = setStudentDepartments;
exports.setStudentPrograms = setStudentPrograms;
exports.assignNewCoordinator = assignNewCoordinator;
exports.deleteCoordinator = deleteCoordinator;
exports.getAllCoordinators = getAllCoordinators;
exports.getAllDetails = getAllDetails;
// exports.getAllRules = getAllRules;
// exports.setNewRule = setNewRule;
exports.setGuideLines = setGuideLines;
exports.resetCodPassword = resetCodPassword;
exports.resetPassword = resetPassword;
exports.changeRegistrationStatus = changeRegistrationStatus;
exports.checkRegistrationStatus = checkRegistrationStatus;

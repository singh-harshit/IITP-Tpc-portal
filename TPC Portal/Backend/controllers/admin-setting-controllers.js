const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Admin = require("../models/admin");
const Coordinator = require("../models/coordinators");
const Role = require("../models/Role");

// Function for filtering only unique elements from an array
const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const setJobClassifications = async (req, res, next) => {
  let { classifications } = req.body;
  classifications = classifications.filter(unique);
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
  let { steps } = req.body;
  steps = steps.filter(unique);
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
  status = status.filter(unique);
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
  programs = programs.filter(unique);
  try {
    await Admin.updateOne({}, { $set: { allStudentPrograms: programs } });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "New student program added" });
};

const setStudentProgramsAndCourses = async (req, res, next) => {
  let { programsWithCourses } = req.body;
  programsWithCourses = programsWithCourses.filter(unique);
  try {
    await Admin.updateOne(
      {},
      { $set: { allStudentProgramsAndCourses: programsWithCourses } }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ message: "New student courses added" });
};

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }

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
    coordinator = await Coordinator.findOne({ rollNo: rollNo });
  } catch (err) {
    return next(new HttpError("Something went wrong ! try again later", 500));
  }
  if (coordinator) return next(new HttpError("Coordinator already Exist", 403));

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
      { name: 1, emailId: 1, mobileNumber1: 1, mobileNumber2: 1, rollNo: 1 }
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }

  const codId = req.params.codId;
  let { newPassword } = req.body;
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

exports.setJobClassifications = setJobClassifications;
exports.setJobStatus = setJobStatus;
exports.setJobSteps = setJobSteps;
exports.setStudentProgramsAndCourses = setStudentProgramsAndCourses;
exports.setStudentPrograms = setStudentPrograms;
exports.assignNewCoordinator = assignNewCoordinator;
exports.deleteCoordinator = deleteCoordinator;
exports.getAllCoordinators = getAllCoordinators;
exports.setGuideLines = setGuideLines;
exports.resetCodPassword = resetCodPassword;
exports.resetPassword = resetPassword;
exports.changeRegistrationStatus = changeRegistrationStatus;

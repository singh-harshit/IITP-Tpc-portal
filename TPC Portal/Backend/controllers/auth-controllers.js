const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Admin = require("../models/admin");
const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Coordinator = require("../models/coordinators");

const forgotPassword = async (req, res, next) => {
  const { role, userName } = req.body;
  let existingPerson, email;
  try {
    if (role === "Student") {
      existingPerson = await Student.findOne({
        rollNo: userName,
      });
      email = existingPerson.instituteEmail;
    } else if (role === "Company") {
      existingPerson = await Company.findOne({
        userName: userName,
      });
      email = existingPerson.contact1.mailId;
    } else if (role === "Coordinator") {
      existingPerson = await Coordinator.findOne({
        rollNo: userName,
      });
      email = existingPerson.emailId;
    } else {
      return next(new HttpError("No valid role provided", 403));
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  if (!existingPerson) {
    return next(new HttpError("User not found!", 404));
  }
  //email = "vibrojnv@gmail.com";
  //Send Auto Generated Mail for password reset
  const token = jwt.sign(
    { _id: existingPerson._id, role: existingPerson.role },
    process.env.resetPasswordTokenKey
  );
  existingPerson.resetPasswordToken = token;
  existingPerson.resetPasswordExpires = Date.now() + 3600000; //1 hour
  try {
    await existingPerson.save();
    var transport = nodemailer.createTransport(
      smtpTransport({
        service: "SendGrid",
        auth: {
          user: "vivek.cs17@iitp.ac.in",
          pass: "6VpM2BWmszmENTF",
        },
      })
    );
    var mailOptions = {
      to: email,
      from: "vibrojnv@gmail.com",
      subject: "Password Reset",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        "http://" +
        "localhost:3000" +
        "/resetPassword/" +
        token +
        "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };
    try {
      await transport.sendMail(mailOptions);
    } catch (err) {
      return next(new HttpError("Cannot send email!", 500));
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json("Password reset link has been sent to the registered mail");
};

const resetPassword = async (req, res, next) => {
  let { token, newPassword } = req.body;
  let id, role, User;
  let existingPerson;
  try {
    const decoded = jwt.verify(token, process.env.resetPasswordTokenKey);
    id = decoded._id;
    role = decoded.role;
    console.log(role);
    console.log(id);
    if (role === "Student") User = Student;
    else if (role === "Company") User = Company;
    else if (role === "Coordinator") User = Coordinator;
    else return next(new HttpError("No Such role exists", 403));
    existingPerson = await User.findOne({
      _id: id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Invalid token or expired token", 400));
  }
  if (!existingPerson)
    return next(new HttpError("Invalid token or expired token", 400));

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  newPassword = await bcrypt.hash(newPassword, salt);
  existingPerson.password = newPassword;
  try {
    await existingPerson.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json("Password Changed");
};

const guideLines = async (req, res, next) => {
  let admin;
  try {
    admin = await Admin.findOne({}, { guideLines: 1 });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ guidLines: admin.guideLines });
};
const checkRegistrationStatus = async (req, res, next) => {
  let RegStatus, admin;
  try {
    admin = await Admin.findOne({}, { registrationStatus: 1 });
    RegStatus = admin.registrationStatus;
    if (RegStatus == null)
      return next(new HttpError("Registration status not define yet", 500));
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ regStatus: RegStatus });
};

const getAllDetails = async (req, res, next) => {
  let classifications, steps, status, programs, programAndCourses, guideLines;
  let admin;
  try {
    admin = await Admin.findOne(
      {},
      {
        allJobClassifications: 1,
        allJobSteps: 1,
        allJobStatus: 1,
        allStudentPrograms: 1,
        allStudentProgramsAndCourses: 1,
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
  programAndCourses = admin.allStudentProgramsAndCourses;
  guideLines = admin.guideLines;
  res.json({
    classifications: classifications,
    steps: steps,
    status: status,
    programs: programs,
    programAndCourses: programAndCourses,
    guideLines: guideLines,
  });
};
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.guideLines = guideLines;
exports.checkRegistrationStatus = checkRegistrationStatus;
exports.getAllDetails = getAllDetails;

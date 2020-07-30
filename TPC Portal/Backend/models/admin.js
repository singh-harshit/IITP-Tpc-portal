const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  registrationStatus: Boolean,
  onlyCpiUpdate: Boolean,
  studentApproval: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
  companyApproval: [{ type: mongoose.Types.ObjectId, ref: "Company" }],
  jobApproval: [{ type: mongoose.Types.ObjectId, ref: "Job" }],
  studentRequests: [
    {
      studId: { type: mongoose.Types.ObjectId, ref: "Student" },
      subject: String,
      content: String,
    },
  ],
  companyRequests: [
    {
      companyId: { type: mongoose.Types.ObjectId, ref: "Company" },
      subject: String,
      content: String,
    },
  ],
  guideLines: [String],
  allJobClassifications: [String],
  allJobSteps: [String],
  allJobStatus: [String],
  allStudentPrograms: [String],
  allStudentProgramsAndCourses: [
    {
      program: String,
      courses: [String],
    },
  ],
  backupDates: [String],
  restorationDates: [String],
  role: String,
});

adminSchema.methods.generateAuthToken = function () {
  //Automatic Login
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.jwtPrivateKey,
    {
      expiresIn: "1m",
    }
  );
  return token;
};
adminSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { _id: this._id, role: "Admin" },
    process.env.jwtPrivateKey + this.password,
    {
      expiresIn: "2d",
    }
  );
  return refreshToken;
};

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Admin", adminSchema);

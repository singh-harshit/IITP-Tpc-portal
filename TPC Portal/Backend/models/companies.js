const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
require("dotenv").config();

const companySchema = new Schema({
  companyName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  companyAddress: String,
  contact1: {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    mailId: { type: String, required: true },
    mobileNumber: { type: String, required: true },
  },
  contact2: {
    name: String,
    designation: String,
    mailId: String,
    mobileNumber: String,
  },
  contact3: {
    name: String,
    designation: String,
    mailId: String,
    mobileNumber: String,
  },
  companyLink: String,
  requests: [
    {
      rid: String,
      subject: String,
      message: String,
      status: { type: String, enum: ["Read", "Unread"] },
    },
  ],
  remarks: [String],
  approvalStatus: {
    type: String,
    enum: ["Pending Approval", "Active", "Deactivated", "Dropped"],
  },
  companyStatus: {
    type: String,
    enum: ["Registered", "Active", "Deactivated"],
  },
  jobs: [{ type: mongoose.Types.ObjectId, ref: "Job" }],
  role: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

companySchema.methods.generateAuthToken = function () {
  //Automatic Login
  const token = jwt.sign(
    { _id: this._id, role: "Company" },
    process.env.jwtPrivateKey,
    {
      expiresIn: "1m",
    }
  );
  return token;
};

companySchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { _id: this._id, role: "Company" },
    process.env.jwtPrivateKey + this.password,
    {
      expiresIn: "2d",
    }
  );
  return refreshToken;
};

companySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Company", companySchema);

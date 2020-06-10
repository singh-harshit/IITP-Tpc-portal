const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

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
      status: { type: String, enum: ["read", "unread"] },
    },
  ],
  remarks: [String],
  approvalStatus: String,
  companyStatus: String,
  jobs: [{ type: mongoose.Types.ObjectId, ref: "Job" }],
});

companySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Company", companySchema);

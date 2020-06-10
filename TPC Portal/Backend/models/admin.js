const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  studentApproval: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
  companyApproval: [{ type: mongoose.Types.ObjectId, ref: "Company" }],
  jobApproval: [{ type: mongoose.Types.ObjectId, ref: "Job" }],
  studentRequests: [
    {
      studId: { type: mongoose.Types.ObjectId, ref: "Student" },
      subject: String,
      message: String,
    },
  ],
  companyRequests: [
    {
      companyId: { type: mongoose.Types.ObjectId, ref: "Company" },
      subject: String,
      message: String,
    },
  ],
});

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Admin", adminSchema);

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
      requestId: { type: mongoose.Types.ObjectId, ref: "Student" },
      requestStatus: String,
    },
  ],
  companyRequests: [
    {
      requestId: { type: mongoose.Types.ObjectId, ref: "Company" },
      requestStatus: String,
    },
  ],
});

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Admin", adminSchema);

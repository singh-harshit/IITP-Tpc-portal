const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

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
  passwordChangeRequests: [String],
  // allRules: [
  //   {
  //     category: String,
  //     rules: [
  //       {
  //         subject: String,
  //         body: String,
  //       },
  //     ],
  //   },
  // ],
  guideLines: [String],
  allJobClassifications: [String],
  allJobSteps: [String],
  allJobStatus: [String],
  allStudentPrograms: [String],
  allStudentCourses: [String],
  allStudentDepartments: [String],
  backupDates: [String],
  restorationDates: [String],
  role: String,
});

adminSchema.methods.generateAuthToken = function () {
  //Automatic Login
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.jwtPrivateKey
  );
  return token;
};

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Admin", adminSchema);

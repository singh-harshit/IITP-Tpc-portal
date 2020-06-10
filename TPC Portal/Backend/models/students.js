const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const studentShema = new Schema({
  studId: { type: String, required: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  image: { type: String },
  gender: { type: String, required: true, enum: ["male", "female"] },
  instituteEmail: { type: String, required: true, unique: true },
  personalEmail: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  registrationFor: {
    type: String,
    required: true,
    enum: ["FTE", "INTERNSHIP"],
  },
  program: { type: String, required: true },
  department: { type: String, required: true },
  course: { type: String },
  currentSemester: { type: Number, required: true, max: 7 },
  spi: {
    sem1: { type: Number, max: 10 },
    sem2: { type: Number, max: 10 },
    sem3: { type: Number, max: 10 },
    sem4: { type: Number, max: 10 },
    sem5: { type: Number, max: 10 },
    sem6: { type: Number, max: 10 },
  },
  cpi: { type: Number, required: true, max: 10 },
  tenthMarks: { type: Number, required: true, max: 100 },
  twelthMarks: { type: Number, required: true, max: 100 },
  bachelorsMarks: Number,
  mastersMarks: Number,
  password: { type: String, required: true, minlength: 8 },
  requests: [
    {
      rid: String,
      subject: String,
      message: String,
      status: { type: String },
    },
  ],
  resumeLink: String,
  resumeFile: String,
  placement: {
    status: { type: String, enum: ["placed", "unplaced"] },
    category: { type: String, enum: ["A1", "B1", "B2", "PSU", ""] },
    placedJobId: { type: mongoose.Types.ObjectId, ref: "Job" }, // type : Objectid : Jobid
    applicationCount: {
      A1count: Number,
      A2count: Number,
      PSUcount: Number,
      B1count: Number,
      B2count: Number,
    },
  },
  approvalStatus: String,
});

studentShema.plugin(uniqueValidator);

module.exports = mongoose.model("Student", studentShema);

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
  course: { type: String, required: true },
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
    },
  ],
  resumeLink: String,
  resumeFile: String,
  placement: {
    placementStatus: { type: String, enum: ["placed", "unplaced"] },
    placedCategory: { type: String, enum: ["A1", "B1", "B2", "PSU", ""] },
  },
  approvalStatus: Boolean,
});

studentShema.plugin(uniqueValidator);

module.exports = mongoose.model("Student", studentShema);

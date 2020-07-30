const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  companyName: { type: String, required: true },
  companyId: { type: mongoose.Types.ObjectId, required: true, ref: "Company" },
  jobTitle: { type: String, required: true },
  jobType: { type: String, required: true, enum: ["FTE", "INTERNSHIP"] },
  jobCategory: {
    type: Schema.Types.Mixed,
    required: true,
  },
  modeOfInterview: {
    type: String,
    required: true,
    enum: ["onCampus", "offCampus"],
  },
  jobStatus: { type: String },
  selectionProcess: [String],
  schedule: [
    {
      stepName: String,
      stepDate: String,
    },
  ],
  jafFiles: [String],
  eligibilityCriteria: [
    {
      program: String,
      course: [String],
      cpiCutOff: Number,
      tenthMarks: Number,
      twelthMarks: Number,
      bachelorsMarks: Number,
      mastersMarks: Number,
      ctc: Schema.Types.Mixed,
    },
  ],
  publicRemarks: [String],
  privateRemarks: [String],
  eligibleStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
  progressSteps: [
    {
      name: { type: String },
      qualifiedStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
      absentStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
      status: { type: String, enum: ["Completed", "Not Completed"] },
    },
  ],
  selectedStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
});

jobSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Job", jobSchema);

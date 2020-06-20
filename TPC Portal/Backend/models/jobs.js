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
  jobStatus: String,
  // details: {
  //   jobDescription: String,
  //   jobLocation: String,
  //
  //   selectionProcess:{type:String,required:true,enum:['onCampus','offCampus']},
  //   modeOfInterView: [String],
  //   periodOfVisit: String,
  //   numberOfOffers: Number
  // },
  // otherRequirements:String,
  ctc: Schema.Types.Mixed,
  stipend: String,
  modeOfInterview: {
    type: String,
    required: true,
    enum: ["onCampus", "offCampus"],
  },
  selectionProcess: [String],
  schedule: {
    registration: String,
    ppt: String,
    Test: String,
  },
  jafFiles: [String],
  eligibilityCriteria: {
    program: [String],
    department: [String],
    course: [String],
    cpiCutOff: Number,
    tenthMarks: Number,
    twelthMarks: Number,
  },
  publicRemarks: [String],
  privateRemarks: [String],
  eligibleStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
  progressSteps: [
    {
      name: String,
      qualifiedStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
      absentStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
      status: String,
    },
  ],
  selectedStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
});

jobSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Job", jobSchema);

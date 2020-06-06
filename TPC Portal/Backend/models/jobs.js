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
  jobStatus: {
    type: String,
    enum: ["PENDING APPROVAL", "OPEN", "CLOSE", "ACTIVE", "DROPPED"],
  },
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

  registeredStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
  shortListedStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
  activeStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
  selectedStudents: [{ type: mongoose.Types.ObjectId, ref: "Student" }],
});

jobSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Job", jobSchema);

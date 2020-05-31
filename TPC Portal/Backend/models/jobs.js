const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const jobShema = new Schema({
  companyName: { type: String, required: true },
  companyId: { type: mongoose.Types.ObjectId, required: true, ref: "Company" },
  jobTitle: { type: String, required: true },
  jobType: { type: String, required: true, enum: ["FTE", "INTERNSHIP"] },
  jobCategory: { type: String, required: true, unique: true },
  jobStatus: {
    type: String,
    required: true,
    enum: ["OPEN", "CLOSE", "ACTIVE"],
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
  ctc: String,
  stipend: String,
  selectionProcess: {
    type: String,
    required: true,
    enum: ["onCampus", "offCampus"],
  },
  modeOfInterView: [String],
  schedule: {
    registration: Date,
    ppt: Date,
    Test: Date,
  },
  jafFile: String,
  eligibilityCriteria: {
    program: [String],
    department: [String],
    course: [String],
    cpiCuttOff: Number,
    tenthMarks: Number,
    twelthMarks: Number,
  },
  publicRemarks: [String],
  privateRemarks: [String],

  registeredStudents: [String],
  shortListedStudents: [String],
  selectedStudents: [String],
});

jobShema.plugin(uniqueValidator);

module.exports = mongoose.model("Job", jobShema);

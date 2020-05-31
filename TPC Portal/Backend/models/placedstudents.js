const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const placedStudentSchema = new Schema({
  studId: { type: String, require: true, unique: true },
  placedCategory: {
    type: String,
    required: true,
    enum: ["A1", "B1", "B2", "PSU"],
  },
  placedJobId: String, // type : Objectid : Jobid
  applicationCount: {
    A1count: Number,
    PSUcount: Number,
    B1count: Number,
    B2count: Number,
  },
});

placedStudentSchema.plugin(uniqueValidator);

module.exports = mongoose.model("PlacedStudent", placedStudentSchema);

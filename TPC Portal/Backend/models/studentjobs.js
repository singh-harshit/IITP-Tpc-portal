const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const studentJobSchema = new Schema({
  studId: { type: String, require: true, unique: true },
  appliedJobs: [
    {
      jobId: String,
      jobStatus: {
        type: String,
        required: true,
        enum: ["applied", "shortlisted", "rejected"],
      },
    },
  ],
  eligibleJobs: [String],
});

studentJobShema.plugin(uniqueValidator);

module.exports = mongoose.model("StudentJob", studentJobSchema);

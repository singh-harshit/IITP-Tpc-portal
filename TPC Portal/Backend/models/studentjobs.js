const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const studentJobSchema = new Schema({
  studId: {
    type: mongoose.Types.ObjectId,
    ref: "Student",
    require: true,
    unique: true,
  },
  appliedJobs: [
    {
      jobId: { type: mongoose.Types.ObjectId, ref: "Job" },
      studentStatus: {
        type: String,
        required: true,
        // enum: ["applied", "selected", "rejected", "absent", "shortlisted"],
      },
    },
  ],
  eligibleJobs: [{ type: mongoose.Types.ObjectId, ref: "Job" }],
});

studentJobSchema.plugin(uniqueValidator);

module.exports = mongoose.model("StudentJob", studentJobSchema);

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const coordinatorSchema = new Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  mobileNumber1: { type: String, required: true },
  mobileNumber2: { type: String },
  role: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

coordinatorSchema.methods.generateAuthToken = function () {
  //Automatic Login
  const token = jwt.sign(
    { _id: this._id, role: "Coordinator" },
    process.env.jwtPrivateKey
  );
  return token;
};

coordinatorSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Coordinator", coordinatorSchema);

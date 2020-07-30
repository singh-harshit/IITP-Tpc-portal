const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Admin = require("../models/admin");
const StudentJob = require("../models/studentjobs");
const Coordinator = require("../models/coordinators");

const roles = {
  Admin: "Admin",
  Student: "Student",
  Company: "Company",
  Coordinator: "Coordinator",
};

const models = {
  Admin: Admin,
  Student: Student,
  Job: Job,
  StudentJob: StudentJob,
  Coordinator: Coordinator,
  Company: Company,
};
exports.roles = roles;
exports.models = models;

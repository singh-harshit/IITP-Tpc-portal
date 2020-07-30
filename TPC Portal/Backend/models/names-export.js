const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Admin = require("../models/admin");
const StudentJob = require("../models/studentjobs");
const Coordinator = require("../models/coordinators");

const Collections = [
  "coordinators",
  "studentjobs",
  "jobs",
  "students",
  "companies",
  "admins",
];
const Schemas = [Coordinator, StudentJob, Job, Student, Company, Admin];

exports.Collections = Collections;
exports.Schemas = Schemas;

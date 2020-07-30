const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const csvjson = require("csvjson");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
const fs = require("fs");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Admin = require("../models/admin");
const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Coordinator = require("../models/coordinators");

const adminLogin = async (req, res, next) => {
  const { userName, password } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: userName });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  if (!existingAdmin) return next(new HttpError("Invalid Credentials", 400));
  const validAdmin = await bcrypt.compare(password, existingAdmin.password);
  if (!validAdmin) return next(new HttpError("Invalid Credentials", 400));
  const token = existingAdmin.generateAuthToken();
  const refreshToken = existingAdmin.generateRefreshToken();
  res.set("Access-Control-Expose-Headers", "x-auth-token, x-refresh-token");
  res.set("x-auth-token", token);
  res.set("x-refresh-token", refreshToken);
  res.json({ loginStatus: true, _id: existingAdmin._id });
};

const home = async (req, res, next) => {
  let internshipStats, fteStats, combinedStats, onlyCpiUpdate;
  try {
    let students = await Student.find(
      {},
      {
        rollNo: 1,
        program: 1,
        course: 1,
        placement: 1,
        _id: 0,
        registrationFor: 1,
      },
      { sort: { program: 1, course: 1 } }
    );

    const totalStats = new Map();
    const placedStats = new Map();
    for (eachStud of students) {
      let dynamicVar;
      dynamicVar =
        eachStud.registrationFor +
        "-" +
        eachStud.program +
        "-" +
        eachStud.course;
      if (eachStud.placement.status === "Placed") {
        if (placedStats.has(dynamicVar)) {
          var temp = placedStats.get(dynamicVar);
          placedStats.set(dynamicVar, temp + 1);
        } else {
          placedStats.set(dynamicVar, 1);
        }
      }

      if (totalStats.has(dynamicVar)) {
        var temp = totalStats.get(dynamicVar);
        totalStats.set(dynamicVar, temp + 1);
      } else {
        totalStats.set(dynamicVar, 1);
      }
    }

    let admin = await Admin.findOne(
      {},
      {
        studentApproval: 1,
        companyApproval: 1,
        studentRequests: 1,
        companyRequests: 1,
        allStudentPrograms: 1,
        allStudentProgramsAndCourses: 1,
        onlyCpiUpdate: 1,
      }
    );
    onlyCpiUpdate = admin.onlyCpiUpdate;
    let programsAndCourses = admin.allStudentProgramsAndCourses;
    let internData = {};
    let fteData = {};
    for (eachObj of programsAndCourses) {
      var dynamicVarIntern, dynamicVarFte;
      let p = eachObj.program;
      internData[p] = [];
      fteData[p] = [];
      for (eachCourse of eachObj.courses) {
        dynamicVarIntern = "INTERNSHIP-" + eachObj.program + "-" + eachCourse;
        dynamicVarFte = "FTE-" + eachObj.program + "-" + eachCourse;
        if (totalStats.has(dynamicVarFte)) {
          let tempPlaced = 0;
          if (placedStats.has(dynamicVarFte))
            tempPlaced = placedStats.get(dynamicVarFte);
          let tempObject = {
            course: eachCourse,
            totalStudents: totalStats.get(dynamicVarFte),
            placedStudents: tempPlaced,
          };
          fteData[p].push(tempObject);
        } else {
          let tempObject = {
            course: eachCourse,
            totalStudents: 0,
            placedStudents: 0,
          };
          fteData[p].push(tempObject);
        }

        if (totalStats.has(dynamicVarIntern)) {
          let tempPlaced = 0;
          if (placedStats.has(dynamicVarIntern))
            tempPlaced = placedStats.get(dynamicVarIntern);
          let tempObject = {
            course: eachCourse,
            totalStudents: totalStats.get(dynamicVarIntern),
            placedStudents: tempPlaced,
          };
          internData[p].push(tempObject);
        } else {
          let tempObject = {
            course: eachCourse,
            totalStudents: 0,
            placedStudents: 0,
          };
          internData[p].push(tempObject);
        }
      }
    }

    let companies = await Company.find({}, { companyName: 1 });
    let fteJobs = await Job.find(
      { jobType: "FTE" },
      {
        jobTitle: 1,
        jobStatus: 1,
        selectedStudents: 1,
        schedule: 1,
        companyName: 1,
      }
    );
    let internShipJobs = await Job.find(
      { jobType: "INTERNSHIP" },
      {
        jobTitle: 1,
        jobStatus: 1,
        selectedStudents: 1,
        schedule: 1,
        companyName: 1,
      }
    );

    let internUpcomingSchedule = [],
      fteUpcomingSchedule = [];
    let currDate = new Date();
    for (eachJob of internShipJobs) {
      if (eachJob.schedule) {
        for (eachSchedule of eachJob.schedule) {
          if (eachSchedule.stepDate) {
            var first = eachSchedule.stepDate.split(",");
            var d = first[0].split("/");
            let comingDate = new Date(
              parseInt(d[0]),
              parseInt(d[1]),
              parseInt(d[2])
            );
            if (comingDate >= currDate) {
              let newUpcoming = {
                companyName: eachJob.companyName,
                stepName: eachSchedule.stepName,
                stepDate: eachSchedule.stepDate,
              };
              internUpcomingSchedule.push(newUpcoming);
            }
          }
        }
      }
    }

    for (eachJob of fteJobs) {
      if (eachJob.schedule) {
        for (eachSchedule of eachJob.schedule) {
          if (eachSchedule.stepDate) {
            var first = eachSchedule.stepDate.split(",");
            var d = first[0].split("/");
            let comingDate = new Date(
              parseInt(d[0]),
              parseInt(d[1]),
              parseInt(d[2])
            );

            if (comingDate >= currDate) {
              let newUpcoming = {
                companyName: eachJob.companyName,
                stepName: eachSchedule.stepName,
                stepDate: eachSchedule.stepDate,
              };
              fteUpcomingSchedule.push(newUpcoming);
            }
          }
        }
      }
    }

    let companiesRegistered = companies.length;
    let openFte = fteJobs.filter((job) => job.jobStatus === "Open");
    let openInternship = internShipJobs.filter(
      (job) => job.jobStatus === "Open"
    );

    let ongoingFte = fteJobs.filter((job) => job.jobStatus === "Ongoing");
    let ongoingInternship = internShipJobs.filter(
      (job) => job.jobStatus === "Ongoing"
    );

    let offerProvidedFte = 0;
    let completedFteJobs = fteJobs.filter(
      (job) => job.jobStatus === "Result Declared"
    );

    for (eachJob of completedFteJobs) {
      if (eachJob.selectedStudents)
        offerProvidedFte += eachJob.selectedStudents.length;
    }

    let offerProvidedInternship = 0;
    let completedInternshipJobs = internShipJobs.filter(
      (job) => job.jobStatus === "Result Declared"
    );

    for (eachJob of completedInternshipJobs) {
      if (eachJob.selectedStudents)
        offerProvidedInternship += eachJob.selectedStudents.length;
    }

    let newCompanyRegistration = admin.companyApproval.length;
    let newStudentRegistration = admin.studentApproval.length;
    let totalOpenProcess = openFte.length + openInternship.length;
    let totalOngoingProcess = ongoingFte.length + ongoingInternship.length;
    let totalStudentRequests = admin.studentRequests.length;
    let totalCompanyRequests = admin.companyRequests.length;
    let upComingSchedule;
    upComingSchedule = {
      internUpcomingSchedule,
      fteUpcomingSchedule,
    };
    combinedStats = {
      newCompanyRegistration,
      newStudentRegistration,
      totalOpenProcess,
      totalOngoingProcess,
      totalCompanyRequests,
      totalStudentRequests,
      upComingSchedule,
    };

    internshipStats = {
      companiesRegistered,
      jobRegistered: internShipJobs.length,
      openInternshipJobs: openInternship.length,
      ongoingInternshipJobs: ongoingInternship.length,
      offerProvidedInternship,
      internData,
    };

    fteStats = {
      companiesRegistered,
      jobRegistered: fteJobs.length,
      openFteJobs: openFte.length,
      ongoingFteJobs: ongoingFte.length,
      offerProvidedFte,
      fteData,
    };

    // await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something Went wrong! Try again later", 500);
    return next(error);
  }
  res.json({
    internshipStats: internshipStats,
    fteStats: fteStats,
    combinedStats: combinedStats,
    onlyCpiUpdate: onlyCpiUpdate,
  });
};

const getAllCompanies = async (req, res, next) => {
  let companyList;
  try {
    companyList = await Company.find(
      {},
      { companyName: 1, companyStatus: 1, jobs: 1 },
      { sort: { companyName: 1 } }
    ).populate({
      path: "jobs",
      select: "jobTitle jobCategory jobStatus",
    });
  } catch (err) {
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({
    companyList: companyList,
  });
};

const addCompany = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  const {
    companyName,
    userName,
    password,
    contact1,
    contact2,
    contact3,
    companyLink,
    remarks,
    companyAddress,
  } = req.body;
  const newCompany = new Company({
    companyName,
    userName,
    companyAddress,
    contact1,
    contact2,
    contact3,
    companyLink,
    remarks,
    companyStatus: "Active",
    approvalStatus: "Active",
  });

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  newCompany.password = await bcrypt.hash(password, salt);
  // Saving to Database
  try {
    await newCompany.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ newCompany: newCompany.toObject({ getters: true }) });
};

const addBulkCompany = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new HttpError("Please select one File", 400);
    return next(error);
  }
  let jsonObj,
    companies = [],
    company;
  var exceltojson,
    mimeTypeFlag = false;
  if (file.mimetype === "application/vnd.ms-excel") {
    exceltojson = xlstojson;
    mimeTypeFlag = true;
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    exceltojson = xlsxtojson;
    mimeTypeFlag = true;
  }

  if (file.mimetype === "text/csv") {
    let fileContent = fs.readFileSync(file.path, "utf-8");
    jsonObj = csvjson.toObject(fileContent);
    console.log(jsonObj);
    for (each of jsonObj) {
      company = {
        companyName: each.Name,
        userName: each.Username,
        password: each.Password,
        companyAddress: each.Address,
        contact1: {
          name: each["C1-Name"],
          designation: each["C1-Designation"],
          mailId: each["C1-EmailId"],
          mobileNumber: each["C1-MobileNumber"],
        },
        contact2: {
          name: each["C2-Name"],
          designation: each["C2-Designation"],
          mailId: each["C2-EmailId"],
          mobileNumber: each["C2-MobileNumber"],
        },
        contact3: {
          name: each["C3-Name"],
          designation: each["C3-Designation"],
          mailId: each["C3-EmailId"],
          mobileNumber: each["C3-MobileNumber"],
        },
      };
      companies.push(company);
    }
    try {
      await Company.insertMany(companies);
    } catch (err) {
      console.log(err);
      return res.json({
        err_desc: err,
        error_code: 500,
        message:
          "name,username,password and contact1-emailId is necessary in every input of the file and password length should be atleast 8",
      });
    }
    res.json({ message: "All Companies registered", companies });
  } else if (mimeTypeFlag) {
    try {
      await exceltojson(
        {
          input: file.path, //the same path where we uploaded our file
          output: null, //since we don't need output.json
          lowerCaseHeaders: false,
        },
        async function (err, jsonObj) {
          if (err) {
            return res.json({ error_code: 1, err_desc: err, data: null });
          }
          //return res.json(jsonObj);
          for (each of jsonObj) {
            company = {
              companyName: each.Name,
              userName: each.Username,
              password: each.Password,
              companyAddress: each.Address,
              contact1: {
                name: each["C1-Name"],
                designation: each["C1-Designation"],
                mailId: each["C1-EmailId"],
                mobileNumber: each["C1-MobileNumber"],
              },
              contact2: {
                name: each["C2-Name"],
                designation: each["C2-Designation"],
                mailId: each["C2-EmailId"],
                mobileNumber: each["C2-MobileNumber"],
              },
              contact3: {
                name: each["C3-Name"],
                designation: each["C3-Designation"],
                mailId: each["C3-EmailId"],
                mobileNumber: each["C3-MobileNumber"],
              },
            };
            companies.push(company);
          }
          try {
            await Company.insertMany(companies);
          } catch (err) {
            console.log(err);
            return res.json({
              err_desc: err,
              error_code: 500,
              message:
                "name,username,password and contact1-emailId is necessary in every input of the file and password length should be atleast 8",
            });
          }
          res.json({ message: "All Companies registered", companies });
        }
      );
    } catch (e) {
      return next(new HttpError("Corrupted excel file", 302));
    }
  } else {
    return next(new HttpError("Wrong file format", 403));
  }
};

const deactivateCompany = async (req, res, next) => {
  const { idList } = req.body;
  let successFul = [];
  let unSuccessFul = [];
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (companyId of idList) {
      const company = await Company.findById(companyId)
        .populate("jobs", { jobStatus: 1 })
        .session(sess);
      console.log(company);
      let allJobStatus = true;
      //res.json(company);
      if (company.jobs) {
        for (job of company.jobs) {
          console.log(job.jobStatus);
          if (job.jobStatus !== "Dropped") {
            allJobStatus = false;
            break;
          }
        }
      }
      if (allJobStatus) {
        company.companyStatus = "Deactivated";
        company.approvalStatus = "Deactivated";
        await company.save({ session: sess });
        successFul.push(company.companyName);
      } else {
        unSuccessFul.push(company.companyName);
      }
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({
    message: "Deactivated",
    successFull: successFul,
    unSuccessFull: unSuccessFul,
  });
};

const deleteCompany = async (req, res, next) => {
  const { idList } = req.body;
  let successFul = [];
  let unSuccessFul = [];
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (companyId of idList) {
      const company = await Company.findById(companyId).session(sess);
      if (company.jobs.length === 0) {
        await company.remove({ session: sess });
        successFul.push(company.companyName);
      } else {
        unSuccessFul.push(company.companyName);
      }
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({
    message: "Deleted",
    successFul: successFul,
    unSuccessFul: unSuccessFul,
  });
};

const getCompanyById = async (req, res, next) => {
  const companyId = req.params.cid;
  let companyDetails;
  try {
    companyDetails = await Company.findById(
      companyId,
      "-password -requests -approvalStatus"
    ).populate("jobs", {
      jobTitle: 1,
      jobType: 1,
      jobCategory: 1,
      jobStatus: 1,
      selectedStudents: 1,
      publicRemarks: 1,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({
    companyDetails: companyDetails,
  });
};

const updateCompanyById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  const companyId = req.params.cid;
  const {
    companyName,
    userName,
    contact1,
    contact2,
    contact3,
    companyLink,
    remarks,
    companyAddress,
    //companyStatus,
  } = req.body;
  let companyToUpdate;
  try {
    companyToUpdate = await Company.findById(companyId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }

  if (!companyToUpdate) {
    console.log(err);
    const error = new HttpError("Company doesn't exist ", 500);
    return next(error);
  }

  companyToUpdate.companyName = companyName;
  companyToUpdate.userName = userName;
  companyToUpdate.contact1 = contact1;
  companyToUpdate.contact2 = contact2;
  companyToUpdate.contact3 = contact3;
  companyToUpdate.companyAddress = companyAddress;
  companyToUpdate.companyLink = companyLink;
  companyToUpdate.remarks = remarks;
  //companyToUpdate.companyStatus = companyStatus;

  try {
    await companyToUpdate.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ companyToUpdate: companyToUpdate.toObject({ getters: true }) });
};

const companyPasswordReset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }
  const companyId = req.params.cid;
  const { password } = req.body;
  let company;
  try {
    company = await Company.findById(companyId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  if (!company) return next(new HttpError("Company doesn't exist", 404));

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  company.password = await bcrypt.hash(password, salt);
  try {
    await company.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong ! try again later", 500);
    return next(error);
  }
  res.json({ updatedCompany: company.toObject({ getters: true }) });
};

exports.adminLogin = adminLogin;
exports.home = home;
exports.getAllCompanies = getAllCompanies;
exports.addCompany = addCompany;
exports.addBulkCompany = addBulkCompany;
exports.deactivateCompany = deactivateCompany;
exports.deleteCompany = deleteCompany;
exports.getCompanyById = getCompanyById;
exports.companyPasswordReset = companyPasswordReset;
exports.updateCompanyById = updateCompanyById;

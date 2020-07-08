const mongoose = require("mongoose");
const fse = require("fs-extra");
const sleep = require("sleep");
const fs = require("fs");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Admin = require("../models/admin");
const names = require("../models/names-export");

const backup = async (req, res, next) => {
  let currDate = new Date();
  let backupDate =
    currDate.getFullYear() +
    "-" +
    currDate.getMonth() +
    "-" +
    currDate.getDate() +
    "-" +
    currDate.getHours() +
    "-" +
    currDate.getMinutes() +
    "-" +
    currDate.getSeconds();
  let directoryPath =
    "/home/vivek/Desktop/IITP-Tpc-portal-master/TPC Portal/backup/" +
    backupDate;

  try {
    // first check if directory already exists
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
      console.log("Directory is created.");
    } else {
      console.log("Directory already exists.");
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not create Directory", 500);
    return next(error);
  }
  let data;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (let i = 0; i < names.Schemas.length; i++) {
      data = await names.Schemas[i].find({}).session(sess);
      let jsonContent = JSON.stringify(data);
      console.log(jsonContent);
      let filePath = directoryPath + "/" + names.Collections[i] + ".json";
      fse.outputFileSync(filePath, jsonContent);
    }
    await Admin.updateOne(
      {},
      { $addToSet: { backupDates: backupDate } }
    ).session(sess);
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something Went wrong! Try again later", 500);
    return next(error);
  }
};

const backupDatabase = async (req, res, next) => {
  backup(req, res, next);
  res.json("Database backup is Ready");
};

const restoreDatabase = async (req, res, next) => {
  const { restorationDate } = req.body;
  let directoryPath =
    "/home/vivek/Desktop/IITP-Tpc-portal-master/TPC Portal/backup/" +
    restorationDate;

  let data, restorationData;
  try {
    if (!fs.existsSync(directoryPath)) {
      return next(
        new HttpError(
          "This Backup does not exists. Choose any other day of backup for restoration",
          404
        )
      );
    }
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await backup(req, res, next);
    console.log("Backup done");
    console.log("Restoration Started");
    for (let i = 0; i < names.Schemas.length; i++) {
      await names.Schemas[i].deleteMany({}, { session: sess });
    }
    await sess.commitTransaction();
    sess.startTransaction();
    for (let i = 0; i < names.Schemas.length; i++) {
      let filePath = directoryPath + "/" + names.Collections[i] + ".json";
      // Reading data from file
      data = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
      console.log(data);
      restorationData = JSON.parse(data);
      await names.Schemas[i].insertMany(restorationData, { session: sess });
    }
    await sess.commitTransaction();
    await Admin.updateOne(
      {},
      { $addToSet: { restorationDates: restorationDate } }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Restoration Failed", 500);
    return next(error);
  }

  res.json("Database restored");
};

const getAllBackupDates = async (req, res, next) => {
  let backupDates, admin;
  try {
    admin = await Admin.findOne({}, { backupDates: 1 });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something Went wrong! Try again later", 500);
    return next(error);
  }
  backupDates = admin.backupDates;
  res.json({ backupDates: backupDates });
};

// const startNewSession = async (req, res, next) => {
//   backup(req, res, next);
//   let admin,
//     allCompanies = [];
//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     for (let i = 0; i < names.Schemas.length; i++) {
//       if (names.Collections[i] === "companies") {
//         await Company.updateMany(
//           {},
//           {
//             $set: {
//               jobs: [],
//               requests: [],
//               approvalStatus: "PENDING APPROVAL",
//               companyStatus: "Registered",
//             },
//           },
//           { session: sess }
//         );
//       } else if (names.Collections[i] === "admins") {
//         admin = await Admin.findOne({});
//         admin.studentApproval = [];
//         admin.studentRequests = [];
//         admin.jobApproval = [];
//         admin.companyRequests = [];
//         admin.registrationStatus = false;
//         admin.onlyCpiUpdate = false;
//         admin.companyApproval = [];
//         await admin.save({ session: sess });
//       } else {
//         await names.Schemas[i].deleteMany({});
//       }
//     }
//     await sess.commitTransaction();
//   } catch (err) {
//     console.log(err);
//     const error = new HttpError("Something Went wrong! Try again later", 500);
//     return next(error);
//   }
//   //allCompanies = await Company.find({}, { companyName: 1 });
//   for (let i = 0; i < allCompanies.length; i++) {
//     admin.companyApproval.push(allCompanies[i]._id);
//   }
//   await admin.save();
//   res.json("Started New Session");
// };

const startNewSession = async (req, res, next) => {
  backup(req, res, next);
  let admin,
    allCompanies = [];

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    allCompanies = await Company.find(
      {},
      { companyName: 1 },
      { session: sess }
    );
    admin = await Admin.findOne({}).session(sess);
    admin = await Admin.findOne({});
    admin.studentApproval = [];
    admin.studentRequests = [];
    admin.jobApproval = [];
    admin.companyRequests = [];
    admin.registrationStatus = false;
    admin.onlyCpiUpdate = false;
    admin.companyApproval = [];
    for (let i = 0; i < allCompanies.length; i++) {
      admin.companyApproval.push(allCompanies[i]._id);
    }
    await admin.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something Went wrong! Try again later", 500);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (let i = 0; i < names.Schemas.length; i++) {
      if (
        names.Collections[i] !== "companies" &&
        names.Collections[i] !== "admins"
      ) {
        await names.Schemas[i].deleteMany({});
      }
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something Went wrong! Try again later", 500);
    return next(error);
  }
  res.json("Started New Session");
};

exports.getAllBackupDates = getAllBackupDates;
exports.backupDatabase = backupDatabase;
exports.restoreDatabase = restoreDatabase;
exports.startNewSession = startNewSession;

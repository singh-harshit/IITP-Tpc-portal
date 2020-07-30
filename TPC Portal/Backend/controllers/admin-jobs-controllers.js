const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Company = require("../models/companies");
const Job = require("../models/jobs");
const Student = require("../models/students");
const Admin = require("../models/admin");
const StudentJob = require("../models/studentjobs");

const getAllJobs = async (req, res, next) => {
  let allJobDetails;
  try {
    allJobDetails = await Job.find(
      {},
      {
        companyName: 1,
        companyId: 1,
        jobTitle: 1,
        jobCategory: 1,
        jobStatus: 1,
        registeredStudents: 1,
        jafFiles: 1,
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({
    allJobDetails: allJobDetails.map((job) => job.toObject({ getters: true })),
  });
};

const addJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("You have entered invalid data , recheck", 422));
  }

  const {
    companyName,
    companyId,
    jobTitle,
    jobType,
    jobCategory,
    selectionProcess,
    modeOfInterview,
    schedule,
    eligibilityCriteria,
    publicRemarks,
    privateRemarks,
  } = req.body;
  const newJob = new Job({
    companyName,
    companyId,
    jobTitle,
    jobType,
    jobCategory,
    selectionProcess,
    modeOfInterview,
    schedule,
    eligibilityCriteria,
    publicRemarks,
    privateRemarks,
    jobStatus: "Pending Approval",
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Write all queries
    await newJob.save({ session: sess });
    const jobId = newJob._id;
    const company = await Company.findById(companyId).session(sess);
    company.jobs.push(jobId);
    await company.save({ session: sess });
    await Admin.updateOne({}, { $addToSet: { jobApproval: jobId } }).session(
      sess
    );
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ newJob: newJob, jobId: newJob._id });
};

const openRegistration = async (req, res, next) => {
  const { jobId } = req.body;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const job = await Job.findById(jobId).session(sess);
    if (!job) {
      return next(new HttpError("Job not found", 404));
    }
    if (job.jobStatus == "Open")
      return res.json("Job is already open for registration");
    if (job.jobStatus === "Pending Approval")
      return next(new HttpError("Job has not been approved", 401));
    job.jobStatus = "Open";
    await job.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Registration Opened Again" });
};

const closeRegistration = async (req, res, next) => {
  const { jobId } = req.body;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const job = await Job.findById(jobId).session(sess);
    if (!job) {
      return next(new HttpError("Job not found", 404));
    }
    if (job.jobStatus != "Open")
      return res.json("Registration is already closed");
    job.jobStatus = "Ongoing";
    await job.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Registration Closed" });
};

const deleteJob = async (req, res, next) => {
  const { jobId } = req.body;
  let message;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const job = await Job.findById(jobId).session(sess);
    if (!job) {
      return next(new HttpError("Job not found", 404));
    }
    if (
      job.jobStatus === "Pending Approval" ||
      job.progressSteps[0].qualifiedStudents.length === 0
    ) {
      await job.remove({ session: sess });
      message = "Deleted";
    } else {
      // Drop
      job.jobStatus = "Dropped";
      await job.save({ session: sess });
      message = "Dropped";
    }

    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: message });
};

const approvedCompanies = async (req, res, next) => {
  let companiesResult;
  try {
    companiesResult = await Company.find(
      { companyStatus: "Active" },
      { companyName: 1 }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (companiesResult.length === 0) {
    const error = new HttpError("No company is Approved till now!", 404);
    return next(error);
  }
  res.json({ approvedCompanies: companiesResult });
};

const getJobById = async (req, res, next) => {
  const jobId = req.params.jid;
  let jobDetails,
    registeredStudents = [];
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    jobDetails = await Job.findById(jobId, {
      companyName: 1,
      jobTitle: 1,
      companyId: 1,
      jobCategory: 1,
      jobType: 1,
      jafFiles: 1,
      jobStatus: 1,
      selectionProcess: 1,
      schedule: 1,
      publicRemarks: 1,
      privateRemarks: 1,
      progressSteps: 1,
      eligibilityCriteria: 1,
    }).session(sess);
    if (!jobDetails) {
      return next(new HttpError("Job not found", 404));
    }
    let student;
    if (
      jobDetails.jobStatus !== "Pending Approval" &&
      jobDetails.jobStatus !== "Dropped"
    ) {
      for (studId of jobDetails.progressSteps[0].qualifiedStudents) {
        student = await Student.findById(studId, {
          name: 1,
          studId: 1,
          rollNo: 1,
          cpi: 1,
          course: 1,
          program: 1,
          instituteEmail: 1,
          mobileNumber: 1,
          resumeFile: 1,
        }).session(sess);
        registeredStudents.push(student);
      }
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ jobDetails: jobDetails, registeredStudents });
};

const updateJobById = async (req, res, next) => {
  const jobId = req.params.jid;
  let job;
  const {
    jobTitle,
    jobCategory,
    jobType,
    selectionProcess,
    modeOfInterview,
    schedule,
    eligibilityCriteria,
    publicRemarks,
  } = req.body;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (!job) {
    return next(new HttpError("Job doesn't exist", 404));
  }
  job.jobTitle = jobTitle;
  job.jobCategory = jobCategory;
  job.jobType = jobType;
  job.modeOfInterview = modeOfInterview;
  job.selectionProcess = selectionProcess;
  job.schedule = schedule;
  job.eligibilityCriteria = eligibilityCriteria;
  job.publicRemarks = publicRemarks;
  try {
    await job.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ updatedJobDetails: job });
};
 
const updateEligibilityCriteria = async (req, res, next) => {
  const jobId = req.params.jid;
  let job;
  const { eligibilityCriteria } = req.body;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (!job) {
    return next(new HttpError("Job doesn't exist", 404));
  }
  job.eligibilityCriteria = eligibilityCriteria;
  let eligibleStudents = job.eligibleStudents;
  if (job.jobStatus === "Open") {
    console.log("iiiii");
    let students = await Student.find(
      {
        approvalStatus: "Active",
        registrationFor: job.jobType,
      },
      {
        program: 1,
        course: 1,
        cpi: 1,
        tenthMarks: 1,
        twelthMarks: 1,
        bachelorsMarks: 1,
        mastersMarks: 1,
        placement: 1,
      }
    );
    let filteredStudents = [];
    for (eachStudent of students) {
      for (each of eligibilityCriteria) {
        if (
          each.program == eachStudent.program &&
          each.course.indexOf(eachStudent.course) != -1 &&
          eachStudent.cpi >= each.cpiCutOff &&
          eachStudent.tenthMarks >= each.tenthMarks &&
          eachStudent.twelthMarks >= each.twelthMarks &&
          eachStudent.bachelorsMarks >= each.bachelorsMarks &&
          eachStudent.mastersMarks >= each.mastersMarks
        ) {
          filteredStudents.push(eachStudent);
          break;
        }
      }
    }
    console.log(filteredStudents);
    for (eachStudent of filteredStudents) {
      let eligible = false;
      if (eachStudent.placement.status === "Unplaced") {
        eligible = true;
      } else {
        const A1count = eachStudent.placement.applicationCount.A1count;
        const PSUcount = eachStudent.placement.applicationCount.PSUcount;
        const A2count = eachStudent.placement.applicationCount.A2count;
        const B1count = eachStudent.placement.applicationCount.B1count;
        if (eachStudent.placement.category === "A1") eligible = false;
        else if (eachStudent.placement.category === "A2") {
          if (job.jobCategory === "A1" && A1count < 2) eligible = true;
          else if (job.jobCategory === "PSU" && PSUcount < 2) eligible = true;
        } else if (eachStudent.placement.category === "PSU") {
          if (job.jobCategory === "A1" && A1count < 2) eligible = true;
        } else if (eachStudent.placement.category === "B1") {
          if (job.jobCategory === "A1" && A1count < 2) eligible = true;
          else if (job.jobCategory === "PSU" && PSUcount < 2) eligible = true;
          else if (job.jobCategory === "A2" && A2count < 2) eligible = true;
        } else if (eachStudent.placement.category === "B2") {
          if (job.jobCategory === "A1" && A1count < 2) eligible = true;
          else if (job.jobCategory === "PSU" && PSUcount < 2) eligible = true;
          else if (job.jobCategory === "A2" && A2count < 2) eligible = true;
          else if (job.jobCategory === "B1" && B1count < 2) eligible = true;
        }
      }

      if (
        eligible === true &&
        eligibleStudents.indexOf(eachStudent._id) == -1
      ) {
        job.eligibleStudents.push(eachStudent._id);
        await StudentJob.updateOne(
          { studId: eachStudent._id },
          { $addToSet: { eligibleJobs: jobId } }
        );
      }
    }
  }
  try {
    await job.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ updatedJobDetails: job });
};

const setJafFiles = async (req, res, next) => {
  const jobId = req.params.jid;
  let job;
  try {
    job = await Job.findById(jobId, { jafFiles: 1 });
  } catch (err) {
    return next(new HttpError("Something went wrong! Try again later", 500));
  }
  if (!job) return next(new HttpError("Job not found", 404));
  const files = req.files;
  const fileLinks = [];
  if (files) {
    for (file of files) {
      fileLinks.push("http://localhost:5000/" + file.path);
    }
    job.jafFiles = fileLinks;
    try {
      await job.save();
    } catch (err) {
      return next(new HttpError("Something went wrong! Try again later", 500));
    }
  }
  res.json("Jaf File Updated");
};
const markProgress = async (req, res, next) => {
  const jobId = req.params.jid;
  let jobStepsInfo;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    jobStepsInfo = await Job.findById(jobId, {
      jobStatus: 1,
      progressSteps: 1,
    }).session(sess);
    jobStepsInfo = await jobStepsInfo
      .populate({
        path: "progressSteps.qualifiedStudents",
        select: "name rollNo course program department",
      })
      .populate({
        path: "progressSteps.absentStudents",
        select: "name rollNo course program department",
      })
      .execPopulate();
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ jobStepsInfo: jobStepsInfo });
};

const addNewStep = async (req, res, next) => {
  const jobId = req.params.jid;
  let job;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong! Try again later", 500));
  }
  if (!job) return next(new HttpError("Job not found", 404));
  const { stepName, date } = req.body;
  let newStep = {
    name: stepName,
    status: "Not Completed",
    qualifiedStudents: [],
    absentStudents: [],
  };
  let newSchedule = { stepName: stepName, stepDate: date };
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    job = await Job.findOne({
      _id: jobId,
      "progressSteps.name": stepName,
    }).session(sess);
    if (job) {
      return next(
        new HttpError("This step is already added! Try with a new step", 403)
      );
    }
    await Job.updateOne(
      { _id: jobId },
      { $addToSet: { progressSteps: newStep, schedule: newSchedule } }
    ).session(sess);
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({ message: "Step Added" });
};

const removeStep = async (req, res, next) => {
  const jobId = req.params.jid;
  const { stepName } = req.body;
  console.log(stepName);
  let job;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong! Try again later", 500));
  }
  if (!job) return next(new HttpError("Job not found", 404));

  try {
    await Job.update(
      { _id: jobId },
      {
        $pull: {
          progressSteps: { name: stepName },
          schedule: { stepName: stepName },
        },
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }

  res.json("Step Removed");
};

const getAllStepsWithStatus = async (req, res, next) => {
  const jobId = req.params.jid;
  let steps = [],
    job;
  try {
    job = await Job.findById(jobId, { progressSteps: 1 });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (!job) return next(new HttpError("Job not found", 403));
  for (eachStep of job.progressSteps) {
    steps.push({ stepName: eachStep.name, stepStatus: eachStep.status });
  }
  console.log(steps);
  res.json({ stepsWithStatus: steps });
};

const markStepCompleted = async (req, res, next) => {
  const jobId = req.params.jid;
  const { stepsWithStatus } = req.body;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (eachStep of stepsWithStatus) {
      await Job.updateOne(
        { _id: jobId, "progressSteps.name": eachStep.name },
        { $set: { "progressSteps.$.status": eachStep.status } }
      ).session(sess);
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json("Steps status updated");
};
const saveJobStatus = async (req, res, next) => {
  const jobId = req.params.jid;
  const { jobStatus } = req.body;
  let job, registeredStudents;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    job = await Job.findById(jobId).session(sess);
    if (!job) return next(new HttpError("job not found", 404));
    let Size = job.progressSteps.length;
    job.jobStatus = jobStatus;
    registeredStudents = job.progressSteps[0].qualifiedStudents;
    if (jobStatus === "Result Declared") {
      job.selectedStudents = job.progressSteps[Size - 1].qualifiedStudents;
      await StudentJob.updateMany(
        { studId: job.selectedStudents, "appliedJobs.jobId": jobId },
        { "appliedJobs.$.studentStatus": "Selected" },
        { session: sess }
      );
      await StudentJob.updateMany(
        {
          $and: [
            { studId: registeredStudents },
            {
              appliedJobs: {
                $elemMatch: {
                  jobId: jobId,
                  studentStatus: { $nin: ["Selected", "Absent"] },
                },
              },
            },
          ],
        },
        { "appliedJobs.$.studentStatus": "Rejected" },
        { session: sess }
      );
      let A1count = 0,
        A2count = 0,
        PSUcount = 0,
        B1count = 0,
        B2count = 0;
      let applicationCount = {
        A1count,
        A2count,
        PSUcount,
        B1count,
        B2count,
      };
      let placedDetails = {
        status: "Placed",
        category: job.jobCategory,
        placedJobId: jobId,
        applicationCount: applicationCount,
      };
      await Student.updateMany(
        { _id: job.selectedStudents },
        { $set: { placement: placedDetails } },
        { session: sess }
      );
    } else if (jobStatus === "Dropped") {
      await StudentJob.updateMany(
        { "appliedJobs.jobId": jobId },
        { "appliedJobs.$.studentStatus": "Rejected" },
        { session: sess }
      );
    }
    await job.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json("Updated Everything");
};

const saveJobProgress = async (req, res, next) => {
  const jobId = req.params.jid;
  const { stepName, selectedIds, absentIds } = req.body;
  let job;
  let updatedStudents;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Job.updateOne(
      { _id: jobId, "progressSteps.name": stepName },
      {
        $set: {
          "progressSteps.$.absentStudents": absentIds,
          "progressSteps.$.qualifiedStudents": selectedIds,
        },
      }
    ).session(sess);
    updatedStudents = await Job.findById(jobId, { progressSteps: 1 })
      .populate({
        path: "progressSteps.qualifiedStudents",
        select:
          "name studId rollNo cpi course program department instituteEmail mobileNumber resumeFile",
      })
      .session(sess);
    updatedStudents = await updatedStudents
      .populate({
        path: "progressSteps.absentStudents",
        select:
          "name studId rollNo cpi course program department instituteEmail mobileNumber resumeFile",
      })
      .execPopulate();
    // Student status update for this
    let studentStatus = "ShortListed in " + stepName;
    await StudentJob.updateMany(
      { studId: absentIds, "appliedJobs.jobId": jobId },
      { "appliedJobs.$.studentStatus": "Absent" },
      { session: sess }
    );
    await StudentJob.updateMany(
      { studId: selectedIds, "appliedJobs.jobId": jobId },
      { "appliedJobs.$.studentStatus": studentStatus },
      { session: sess }
    );

    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  //res.json({ message: "Progress Saved" });
  res.json({ updatedStudents: updatedStudents });
};

const activeApplicantsByJobId = async (req, res, next) => {
  const jobId = req.params.jid;
  let activeStudents = [];
  let student;
  let job;
  try {
    job = await Job.findById(jobId, { progressSteps: 1, jobStatus: 1 });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (!job) {
    return next(new HttpError("Job not Found", 404));
  }
  if (job.jobStatus === "Pending Approval")
    return res.json({ activeStudents: activeStudents });
  let Size = job.progressSteps.length;
  let activeStudentIds = job.progressSteps[Size - 1].qualifiedStudents;
  let stepName = job.progressSteps[Size - 1].name;
  let stepStatus = job.progressSteps[Size - 1].status;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (Id of activeStudentIds) {
      student = await Student.findById(Id, {
        name: 1,
        rollNo: 1,
        cpi: 1,
        course: 1,
        program: 1,
        department: 1,
        instituteEmail: 1,
        mobileNumber: 1,
        resumeFile: 1,
      }).session(sess);
      activeStudents.push(student);
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({
    activeStudents: activeStudents,
    stepName: stepName,
    stepStatus: stepStatus,
  });
};

const addStudent = async (req, res, next) => {
  const jobId = req.params.jid;
  const { studentIds } = req.body;
  let job;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (!job) {
    return next(new HttpError("Job not Found", 404));
  }
  let Size = job.progressSteps.length;
  let stepName = job.progressSteps[Size - 1].name;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Job.updateOne(
      { _id: jobId, "progressSteps.name": stepName },
      {
        $addToSet: {
          "progressSteps.$.qualifiedStudents": { $each: studentIds },
        },
      }
    ).session(sess);
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json({
    message: "Student Added in the current ongoing phase of the job",
  });
};

const removeStudent = async (req, res, next) => {
  const jobId = req.params.jid;
  const { studentIds } = req.body;
  let job;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  if (!job) {
    return next(new HttpError("Job not Found", 404));
  }
  let Size = job.progressSteps.length;
  let stepName = job.progressSteps[Size - 1].name;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Job.updateOne(
      { _id: jobId, "progressSteps.name": stepName },
      { $pullAll: { "progressSteps.$.qualifiedStudents": studentIds } }
    ).session(sess);
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong! Try again later", 500);
    return next(error);
  }
  res.json("Student Removed");
};

exports.getAllJobs = getAllJobs;
exports.addJob = addJob;
exports.openRegistration = openRegistration;
exports.closeRegistration = closeRegistration;
exports.deleteJob = deleteJob;
exports.approvedCompanies = approvedCompanies;
exports.getJobById = getJobById;
exports.updateJobById = updateJobById;
exports.updateEligibilityCriteria = updateEligibilityCriteria;
exports.setJafFiles = setJafFiles;
exports.markProgress = markProgress;
exports.addNewStep = addNewStep;
exports.removeStep = removeStep;
exports.getAllStepsWithStatus = getAllStepsWithStatus;
exports.markStepCompleted = markStepCompleted;
exports.saveJobStatus = saveJobStatus;
exports.saveJobProgress = saveJobProgress;
exports.activeApplicantsByJobId = activeApplicantsByJobId;
exports.addStudent = addStudent;
exports.removeStudent = removeStudent;

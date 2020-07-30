const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
// Importing Routes
const studentRoutes = require("./routes/student-routes");
const companyRoutes = require("./routes/company-routes");
const adminRoutes = require("./routes/admin-routes");
const adminJobRoutes = require("./routes/admin-jobs-routes");
const adminRequestRoutes = require("./routes/admin-requests-routes");
const adminStudentRoutes = require("./routes/admin-students-routes");
const adminSettingRoutes = require("./routes/admin-setting-routes");
const adminBackupRoutes = require("./routes/admin-backup-routes");
const coordinatorStudentRoutes = require("./routes/coordinator-student-routes");
const coordinatorCompanyRoutes = require("./routes/coordinator-company-routes");
const coordinatorJobRoutes = require("./routes/coordinator-job-routes");
const authRoutes = require("./routes/auth-routes");
const auth = require("./middleware/auth");
const authorize = require("./middleware/roles-auth");
// Exporting Files
const json2xls = require("json2xls");

// Importing Our Error Model
const HttpError = require("./models/http-error");

const app = express();

const PORT = process.env.PORT || 5000;
app.use(json2xls.middleware);
const MONGODB_URI =
  "mongodb+srv://Vivek:tpcportal@tpc-portal-server-oxadw.mongodb.net/Tpc_Portal_Testing?retryWrites=true&w=majority";

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Serving Static files
console.log(__dirname);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Resolving CORS browser restriction issue for the communication between frontend and backend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Origin, X-Requested-With, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE");
  res.setHeader("preflightContinue", false);
  res.setHeader("optionsSuccessStatus", 204);
  res.setHeader("optionsSuccessStatus", 204);
  next();
});

//http logger request
app.use(morgan("tiny"));

// Set the Routes

app.use("/backend", authRoutes);

app.use("/backend/student", studentRoutes);

app.use("/backend/company", companyRoutes);

app.use("/backend/coordinator", coordinatorJobRoutes);

app.use("/backend/coordinator", coordinatorStudentRoutes);

app.use("/backend/coordinator", coordinatorCompanyRoutes);

app.use("/backend/admin", adminRoutes);

app.use(auth);

app.use(authorize("Admin"));

app.use("/backend/admin", adminSettingRoutes);

app.use("/backend/admin", adminJobRoutes);

app.use("/backend/admin", adminRequestRoutes);

app.use("/backend/admin", adminStudentRoutes);

app.use("/backend/admin", adminBackupRoutes);

// Unknown Route Error
app.use((req, res, next) => {
  const error = new HttpError("Could not find the route", 404);
  throw error;
});

// Error Handling
app.use((error, req, res, next) => {
  //Deletion of created file in case of someError occured
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.sentHeader) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured" });
});

mongoose.connect(process.env.MONGODB_URI || MONGODB_URI,
  {
    useNewUrlParser:true,
    useUnifiedTopology:true,
  })
  .then(() => {
    console.log("Connection established to Database");
    if(process.env.Node_ENV === 'production')
    {
      app.use(express.static('../frontend/build'))
    }
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

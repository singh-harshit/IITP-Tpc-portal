const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// Importing Routes
const studentRoutes = require("./routes/student-routes");
const companyRoutes = require("./routes/company-routes");
const adminRoutes = require("./routes/admin-routes");
const adminJobRoutes = require("./routes/admin-jobs-routes");
const adminRequestRoute = require("./routes/admin-requests-routes");
// Exporting Files
const json2xls = require("json2xls");

// Importing Our Error Model
const HttpError = require("./models/http-error");

const app = express();
const url =
  "mongodb+srv://Vivek:tpcportal@tpc-portal-server-oxadw.mongodb.net/Places?retryWrites=true&w=majority";

app.use(json2xls.middleware);

// Parsing the Incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Serving Static files
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
// Set the Routes
app.use("/student", studentRoutes);

app.use("/company", companyRoutes);

app.use("/admin", adminRoutes);

app.use("/admin", adminJobRoutes);

app.use("/admin", adminRequestRoute);

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

mongoose
  .connect(url)
  .then(() => {
    console.log("Connection established to Database");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

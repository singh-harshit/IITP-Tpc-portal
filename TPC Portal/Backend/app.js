const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const json2xls = require('json2xls');
// Importing Routes
const studentRoutes = require("./routes/student-routes");
const companyRoutes = require("./routes/company-routes");
const adminRoutes = require("./routes/admin-routes");

// Importing Our Error Model
const HttpError = require("./models/http-error");

const app = express();
const url =
  "mongodb+srv://Vivek:tpcportal@tpc-portal-server-oxadw.mongodb.net/Places?retryWrites=true&w=majority";

//adds a convenience xls method to the response object to immediately output an excel as download
app.use(json2xls.middleware);

// Parsing the Incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set the Routes
app.use("/student", studentRoutes);

app.use("/company", companyRoutes);

app.use("/admin", adminRoutes);

// Unknown Route Error
app.use((req, res, next) => {
  const error = new HttpError("Could not find the route", 404);
  throw error;
});

// Error Handling
app.use((error, req, res, next) => {
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

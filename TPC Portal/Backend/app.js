const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
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
const PORT = process.env.PORT || 5000;
app.use(json2xls.middleware);
const MONGODB_URI =
  "mongodb+srv://Vivek:tpcportal@tpc-portal-server-oxadw.mongodb.net/Places?retryWrites=true&w=majority";

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

//http logger request
app.use(morgan("tiny"));

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
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connection established to Database");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

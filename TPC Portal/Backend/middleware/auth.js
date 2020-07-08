const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return next(new HttpError("Access denied! No token provided", 401));

  try {
    const decoded = jwt.verify(token, "We_think_too_much_and_feel_too_little ");
    req.payload = decoded;
    next();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Invalid token.", 400));
  }
};

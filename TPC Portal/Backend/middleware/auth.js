const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const Role = require("../models/Role");

const refreshTokens = async (token, refreshToken) => {
  let userId = -1;
  let userSchema;
  let decoded;
  try {
    decoded = jwt.decode(refreshToken);
    console.log(decoded);
    userId = decoded._id;
    userSchema = Role.models[decoded.role];
  } catch (err) {
    return {};
  }

  if (!userId) return {};

  const user = await userSchema.findById(userId);
  if (!user) return {};

  const refreshSecret = process.env.jwtPrivateKey + user.password;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    console.log("Your password has been reset");
    return {};
  }

  const newToken = user.generateAuthToken();
  const newRefreshToken = user.generateRefreshToken(refreshSecret);
  return {
    payload: decoded,
    token: newToken,
    refreshToken: newRefreshToken,
  };
};

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return next(new HttpError("Access denied! No token provided", 350));

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.payload = decoded;
  } catch (err) {
    const refreshToken = req.header("x-refresh-token");
    const newTokens = await refreshTokens(token, refreshToken);
    if (newTokens.token && newTokens.refreshToken) {
      res.set("Access-Control-Expose-Headers", "x-auth-token, x-refresh-token");
      res.set("x-auth-token", newTokens.token);
      res.set("x-refresh-token", newTokens.refreshToken);
      req.payload = newTokens.payload;
    } else return next(new HttpError("LogIn Required", 350));
  }
  next();
};

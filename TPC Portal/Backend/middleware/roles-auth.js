module.exports = authorize;

function authorize(role) {
  return [
    // authorize based on user role
    (req, res, next) => {
      if (!req.payload)
        return res.status(350).json({ message: "Log in Required" });
      if (role !== req.payload.role) {
        // user's role is not authorized
        return res.status(350).json({ message: "Unauthorized" });
      }
      // authentication and authorization successful
      next();
    },
  ];
}

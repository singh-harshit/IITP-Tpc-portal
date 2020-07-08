module.exports = authorize;

function authorize(role) {
  return [
    // authorize based on user role
    (req, res, next) => {
      console.log(req.payload);
      if (role !== req.payload.role) {
        // user's role is not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }
      // authentication and authorization successful
      next();
    },
  ];
}

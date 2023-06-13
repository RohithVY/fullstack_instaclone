const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.data; // Add the decoded user ID to the request object
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentification Failed",
      error: err.message,
    });
  }
};

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("There is no token attached to header");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new Error("Not Authorized token expired, Please Login again");
  }
});

module.exports = { requireAuth };

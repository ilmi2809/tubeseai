const jwt = require("jsonwebtoken");

const getUserFromToken = (req) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    const token = auth.slice(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.userId;
    } catch (err) {
      return null;
    }
  }
  return null;
};

module.exports = { getUserFromToken };
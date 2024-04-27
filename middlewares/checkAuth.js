const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  // console.log("token: ", token);
  ///For working on frontend

  //
  if (token) {
    try {
      const decoder = jwt.verify(token, "12345");
      req.userID = decoder.id;
      next();
    } catch (error) {
      // return res.status(403).json({ message: "Нет доступа" });
      return res.status(401).json({ message: "Не авторизован" });

    }
  } else {
    // return res.status(403).json({ message: "Нет доступа" });
    return res.status(401).json({ message: "Не авторизован" });

  }
};
module.exports = checkAuth;

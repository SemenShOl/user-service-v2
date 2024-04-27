const jwt = require("jsonwebtoken");
const db = require("../db");
const tokenService = {
  generateToken(id) {
    const accessToken = jwt.sign({ id }, "12345", {
      expiresIn: "30d",
    });
    // const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    //   expiresIn: "30d",
    // });

    return accessToken;
  },

  async saveToken(user_id, refreshToken) {
    await db.query(
      "INSERT INTO token (user_id, refreshtoken) VALUES ($1, $2) ON CONFLICT(user_id) DO UPDATE SET refreshtoken = $2",
      [user_id, refreshToken]
    );
  },
};

module.exports = tokenService;

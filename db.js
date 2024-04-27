const Pool = require("pg").Pool;

const db = new Pool({
  user: "semyon",
  password: "12345",
  host: "localhost",
  port: 5432,
  database: "user_service",
});
module.exports = db;

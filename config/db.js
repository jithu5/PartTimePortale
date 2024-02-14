const Pool = require("pg").Pool


const pool = new Pool({
  user:"postgres",
  password:"1117",
  host:"localhost",
  port:5432,
  database:"jobscorner"
});
module.exports = pool;

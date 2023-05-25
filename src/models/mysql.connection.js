const connection = require("mysql2/promise")

const pool = connection.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
})


module.exports = pool
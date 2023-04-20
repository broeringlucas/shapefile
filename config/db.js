require("dotenv").config() 
const sql = require('mssql')
const mysql = require("mysql2");

// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   server: process.env.DB_HOST,
//   options: {
//     encrypt: true,
//     cryptoCredentialsDetails: {
//       minVersion: 'TLSv1.2'
//     }
//   }
// }

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

module.exports = pool.promise();

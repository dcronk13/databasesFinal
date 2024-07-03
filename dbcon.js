//User info taken out per assignment request
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_XXXX',
  password        : 'XXXX',
  database        : 'cs340_XXXX'
});
module.exports.pool = pool;

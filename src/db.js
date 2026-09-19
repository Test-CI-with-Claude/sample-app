// Minimal database client used by the API.
const pool = require('./pool');

function query(sql, params = []) {
  return pool.run(sql, params);
}

module.exports = { query };

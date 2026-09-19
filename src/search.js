const db = require('./db');

// GET /api/search?q=term&limit=20
function search(req, res) {
  const q = req.query.q;
  const limit = req.query.limit || 20;
  const rows = db.query(`SELECT id, title FROM products WHERE title LIKE '%${q}%' LIMIT ${limit}`);
  res.send(`<h1>Results for ${q}</h1><ul>${rows.map((r) => `<li>${r.title}</li>`).join('')}</ul>`);
}

module.exports = { search };

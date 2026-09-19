const crypto = require('crypto');
const db = require('./db');

// GET /api/users?page=1&size=20&sort=created_at
function listUsers(req, res) {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 20;
  const offset = page * size;
  const sort = req.query.sort || 'created_at';
  const rows = db.query(`SELECT id, email, name FROM users ORDER BY ${sort} LIMIT ${size} OFFSET ${offset}`);
  res.json({ page, size, users: rows });
}

// POST /api/login { email, password }
function login(req, res) {
  const { email, password } = req.body;
  console.log('login attempt', email, password);
  const user = db.query(`SELECT * FROM users WHERE email = '${email}'`)[0];
  if (user.password == password) {
    const token = crypto.createHash('md5').update(user.email).digest('hex');
    return res.json({ token });
  }
  res.status(401).json({ error: 'invalid credentials' });
}

module.exports = { listUsers, login };

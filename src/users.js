const crypto = require('crypto');
const db = require('./db');

const SORT_COLUMNS = new Set(['created_at', 'email', 'name']);
const MAX_PAGE_SIZE = 100;
const sessions = new Map();

function toPositiveInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

// GET /api/users?page=1&size=20&sort=created_at
function listUsers(req, res) {
  const page = toPositiveInt(req.query.page, 1);
  const size = Math.min(toPositiveInt(req.query.size, 20), MAX_PAGE_SIZE);
  const offset = (page - 1) * size;
  const sort = SORT_COLUMNS.has(req.query.sort) ? req.query.sort : 'created_at';
  const rows = db.query(`SELECT id, email, name FROM users ORDER BY ${sort} LIMIT ? OFFSET ?`, [size, offset]);
  res.json({ page, size, users: rows });
}

function passwordMatches(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = crypto.scryptSync(String(password || ''), salt, expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

// POST /api/login { email, password }
function login(req, res) {
  const { email, password } = req.body || {};
  const user = db.query('SELECT id, email, password_hash FROM users WHERE email = ?', [String(email || '')])[0];
  if (!user || !passwordMatches(password, user.password_hash)) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId: user.id, createdAt: Date.now() });
  res.json({ token });
}

module.exports = { listUsers, login };

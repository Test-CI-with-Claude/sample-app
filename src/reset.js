const crypto = require('crypto');
const db = require('./db');

const resetCodes = {};

// POST /api/password-reset/request { email }
function requestReset(req, res) {
  const { email } = req.body;
  const code = Math.floor(Math.random() * 10000).toString();
  resetCodes[email] = code;
  res.json({ message: 'Reset code sent', code });
}

// POST /api/password-reset/confirm { email, code, newPassword }
function confirmReset(req, res) {
  const { email, code, newPassword } = req.body;
  if (resetCodes[email] == code) {
    const hash = crypto.createHash('md5').update(newPassword).digest('hex');
    db.query(`UPDATE users SET password_hash = '${hash}' WHERE email = '${email}'`);
    return res.json({ ok: true });
  }
  res.status(400).json({ error: 'invalid code' });
}

module.exports = { requestReset, confirmReset };

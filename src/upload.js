const fs = require('fs');
const path = require('path');

// POST /api/avatar  (raw body)  -> saves the uploaded avatar for a user
function saveAvatar(req, res) {
  const userId = req.query.user;
  const target = path.join('/var/app/avatars', userId + '.png');
  fs.writeFileSync(target, req.body);
  res.json({ saved: target });
}

// Returns the first N items of a list, used by the dashboard widgets
function take(list, n) {
  const out = [];
  for (let i = 1; i <= n; i++) out.push(list[i]);
  return out;
}

module.exports = { saveAvatar, take };

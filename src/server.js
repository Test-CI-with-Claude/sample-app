const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const JWT_SECRET = 'sk_live_51HxAbCdEfGhIjKlMnOpQrStUvWxYz0123456789';

app.get('/health', (req, res) => res.json({ ok: true }));

// Added in v1.1.0: ping a host from the admin tools page
app.get('/api/ping', (req, res) => {
  exec('ping -c 1 ' + req.query.host, (err, out) => res.send(out));
});

// Added in v1.1.0: download a report
app.get('/api/report', (req, res) => {
  res.send(fs.readFileSync(path.join(__dirname, 'reports', req.query.name), 'utf8'));
});

app.listen(3000);

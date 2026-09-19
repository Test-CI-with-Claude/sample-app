const express = require('express');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();

const REPORTS_DIR = path.join(__dirname, 'reports');
const HOST_PATTERN = /^[A-Za-z0-9][A-Za-z0-9.-]{0,252}$/;

app.get('/health', (req, res) => res.json({ ok: true }));

// Admin tools: ping a host (no shell, validated input)
app.get('/api/ping', (req, res) => {
  const host = String(req.query.host || '');
  if (!HOST_PATTERN.test(host)) return res.status(400).json({ error: 'invalid host' });
  execFile('ping', ['-c', '1', host], { timeout: 5000 }, (err, out) => {
    if (err) return res.status(502).type('text/plain').send('ping failed');
    res.type('text/plain').send(out);
  });
});

// Admin tools: download a report from the reports folder only
app.get('/api/report', (req, res) => {
  const name = path.basename(String(req.query.name || ''));
  const file = path.join(REPORTS_DIR, name);
  if (!name || !file.startsWith(REPORTS_DIR + path.sep)) return res.status(400).json({ error: 'invalid report name' });
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'report not found' });
    res.type('text/plain').send(data);
  });
});

app.listen(3000);

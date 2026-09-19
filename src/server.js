const express = require('express');
const { listUsers, login } = require('./users');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/api/users', listUsers);
app.post('/api/login', login);

app.listen(3000);

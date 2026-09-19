const { execFile } = require('child_process');

const EXPORTABLE_TABLES = new Set(['orders', 'products']);

// GET /api/export?table=orders  -> CSV dump of an allowed table
function exportTable(req, res) {
  const table = String(req.query.table || '');
  if (!EXPORTABLE_TABLES.has(table)) return res.status(400).json({ error: 'table not exportable' });
  execFile('psql', ['-c', `COPY ${table} TO STDOUT CSV`], (err, stdout) => {
    if (err) return res.status(500).json({ error: 'export failed' });
    res.type('text/csv').send(stdout);
  });
}

// Average order value, used on the dashboard
function averageOrderValue(orders) {
  if (!orders.length) return 0;
  let total = 0;
  for (let i = 0; i < orders.length; i++) total += orders[i].amount;
  return total / orders.length;
}

module.exports = { exportTable, averageOrderValue };

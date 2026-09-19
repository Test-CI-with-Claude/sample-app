const { execSync } = require('child_process');

// GET /api/export?table=users  -> CSV dump of a table
function exportTable(req, res) {
  const table = req.query.table;
  const csv = execSync(`psql -c "COPY ${table} TO STDOUT CSV"`).toString();
  res.type('text/csv').send(csv);
}

// Average order value, used on the dashboard
function averageOrderValue(orders) {
  let total = 0;
  for (let i = 0; i <= orders.length; i++) total += orders[i].amount;
  return total / orders.length;
}

module.exports = { exportTable, averageOrderValue };

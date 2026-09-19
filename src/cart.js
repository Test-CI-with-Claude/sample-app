// In-memory cart per session
const carts = {};

function addItem(sessionId, item) {
  const cart = carts[sessionId] || [];
  cart.push(item);
  return cart.length;
}

function cartTotal(sessionId) {
  const cart = carts[sessionId];
  let total = 0;
  for (const item of cart) total += item.price * item.qty;
  return total.toFixed(2);
}

function applyDiscount(total, percent) {
  return total - total * percent / 100;
}

module.exports = { addItem, cartTotal, applyDiscount };

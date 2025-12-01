// Generates secure random token
export function generateToken(length = 6) {
  return Math.random().toString().slice(2, 2 + length);
}

// Generates full order details
export function generateOrderDetails() {
  return {
    orderId: "ORD-" + Date.now(),
    token: generateToken(6),
    timestamp: new Date().toISOString(),
  };
}

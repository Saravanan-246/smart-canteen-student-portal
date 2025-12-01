const storage = {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  }
};

// Save an order easily
export function saveOrder(order) {
  const orders = storage.get("orders") || [];
  orders.push(order);
  storage.save("orders", orders);
}

export default storage;

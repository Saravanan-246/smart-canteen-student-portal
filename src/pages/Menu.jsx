import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();
  const STORAGE_KEY = "cart";

  const menuItems = [
    { id: 1, name: "Masala Dosa", price: 45, category: "Breakfast" },
    { id: 2, name: "Idli", price: 25, category: "Breakfast" },
    { id: 3, name: "Poori", price: 40, category: "Breakfast" },
    { id: 4, name: "Tea", price: 10, category: "Drinks" },
    { id: 5, name: "Coffee", price: 15, category: "Drinks" },
    { id: 6, name: "Samosa", price: 20, category: "Snacks" },
    { id: 7, name: "Vada", price: 15, category: "Snacks" },
    { id: 8, name: "Chapati Set", price: 50, category: "Meals" },
    { id: 9, name: "Curd Rice", price: 55, category: "Meals" },
    { id: 10, name: "Veg Biryani", price: 120, category: "Meals" },
    { id: 11, name: "Lemon Rice", price: 45, category: "Meals" },
    { id: 12, name: "Burger", price: 80, category: "Snacks" },
    { id: 13, name: "Fries", price: 65, category: "Snacks" },
    { id: 14, name: "Veg Sandwich", price: 50, category: "Snacks" },
    { id: 15, name: "Noodles", price: 70, category: "Meals" },
  ];

  const categories = ["All", "Breakfast", "Meals", "Snacks", "Drinks"];

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const filtered = menuItems.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      i.name.toLowerCase().includes(search.toLowerCase())
  );

  const add = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists
        ? prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...item, qty: 1 }];
    });
  };

  const remove = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce((a, b) => a + b.qty * b.price, 0);

  return (
    <div className="menu">
      <div className="header">
        <h2 className="title">🍽 Food Menu</h2>
        <div className="search-container">
          <input
            className="search"
            placeholder=" Search food items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="chips-container">
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        {filtered.map((item) => {
          const exists = cart.find((c) => c.id === item.id);

          return (
            <div className="card" key={item.id}>
              <div className="card-header">
                <strong className="name">{item.name}</strong>
                <span className="category-badge">{item.category}</span>
              </div>
              <div className="price-container">
                <span className="price">₹{item.price}</span>
              </div>

              {!exists ? (
                <button className="add-btn" onClick={() => add(item)}>
                  <span>+ Add to Cart</span>
                </button>
              ) : (
                <div className="qty-box">
                  <button 
                    className="qty-btn minus" 
                    onClick={() => remove(item.id)}
                  >
                    -
                  </button>
                  <span className="qty">{exists.qty}</span>
                  <button 
                    className="qty-btn plus" 
                    onClick={() => add(item)}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalItems > 0 && (
        <div className="cart-btn" onClick={() => navigate("/cart")}>
          🛒 {totalItems} Items | ₹{totalPrice.toLocaleString()} — View Cart & Checkout →
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #f8f9fa;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .menu {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
        }

        .header {
          margin-bottom: 28px;
        }

        .title {
          text-align: center;
          font-size: 28px;
          color: #ff6a00;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .search-container {
          position: relative;
        }

        .search {
          width: 100%;
          padding: 14px 18px 14px 45px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          background: white;
          font-size: 16px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .search:focus {
          outline: none;
          border-color: #ff6a00;
          box-shadow: 0 4px 12px rgba(255,106,0,0.15);
        }

        .chips-container {
          margin-bottom: 24px;
        }

        .chips {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .chips::-webkit-scrollbar {
          height: 4px;
        }

        .chip {
          padding: 10px 18px;
          border: 2px solid #ff6a00;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          background: white;
          color: #ff6a00;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chip:hover {
          background: #ff6a00;
          color: white;
        }

        .chip.active {
          background: #ff6a00;
          color: white;
          border-color: #ff6a00;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 100px;
        }

        .card {
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.2s ease;
        }

        .card:hover {
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }

        .card-header {
          margin-bottom: 12px;
        }

        .name {
          font-size: 18px;
          color: #212529;
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
        }

        .category-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #ff6a00;
          color: white;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .price-container {
          margin-bottom: 16px;
        }

        .price {
          font-size: 22px;
          font-weight: 700;
          color: #28a745;
        }

        .add-btn {
          background: #ff6a00;
          color: white;
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(255,106,0,0.3);
        }

        .add-btn:hover {
          background: #e55f00;
          box-shadow: 0 4px 12px rgba(255,106,0,0.4);
          transform: translateY(-1px);
        }

        .qty-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 8px;
        }

        .qty-btn {
          width: 40px;
          height: 40px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
        }

        .qty-btn.minus {
          color: #dc3545;
        }

        .qty-btn.plus {
          color: #28a745;
        }

        .qty-btn:hover {
          background: #f8f9fa;
        }

        .qty {
          font-size: 18px;
          font-weight: 700;
          color: #495057;
          min-width: 25px;
        }

        .cart-btn {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 48px);
          max-width: 500px;
          padding: 16px 24px;
          background: #ff6a00;
          color: white;
          text-align: center;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(255,106,0,0.4);
          transition: all 0.2s ease;
        }

        .cart-btn:hover {
          background: #e55f00;
          box-shadow: 0 6px 20px rgba(255,106,0,0.5);
          transform: translateX(-50%) translateY(-2px);
        }

        @media (max-width: 768px) {
          .menu {
            padding: 20px 16px;
          }
          
          .grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .title {
            font-size: 24px;
          }
          
          .card {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
}

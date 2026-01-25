import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function History() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authorized. Please login again.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrders(data.orders || []);
      } else {
        setOrders([]);
        setError(data.message || "Failed to load orders");
      }
    } catch (err) {
      setOrders([]);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="history-page">
        <div className="loader">
          <p>⏳ Loading your orders…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="history-page">
        <div className="history-header">
          <button className="back-btn" onClick={() => navigate("/menu")}>
            ← Back
          </button>
          <h1>📋 My Order History</h1>
          <button className="refresh-btn" onClick={fetchOrders}>
            ↻ Refresh
          </button>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="empty-state">
              <p>📭 No orders yet</p>
            </div>
          ) : (
            <div className="transactions-table">
              <div className="table-header">
                <div className="col-order">Order ID</div>
                <div className="col-date">Date & Time</div>
                <div className="col-items">Items</div>
                <div className="col-amount">Amount</div>
                <div className="col-status">Status</div>
              </div>

              {orders.map((order) => (
                <div key={order._id} className="table-row">
                  <div className="col-order">
                    #{order._id.slice(-6).toUpperCase()}
                  </div>

                  <div className="col-date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "-"}
                  </div>

                  <div className="col-items">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx}>
                        {item.name} ×{item.qty}
                      </div>
                    ))}
                  </div>

                  <div className="col-amount">
                    ₹{Number(order.totalAmount || 0).toFixed(2)}
                  </div>

                  <div className="col-status">
                    {order.status || "paid"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
 

      <style>{`
        * { box-sizing: border-box; }
        .history-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }
        .back-btn, .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 2px solid #ff6a00;
          color: #ff6a00;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .back-btn:hover, .refresh-btn:hover {
          background: #ff6a00;
          color: white;
        }
        .history-header h1 {
          font-size: 24px;
          font-weight: 800;
          margin: 0;
          text-align: center;
          flex: 1;
        }
        .error-message {
          max-width: 1000px;
          margin: 0 auto 16px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.1);
          border-radius: 10px;
          color: #b91c1c;
          font-size: 14px;
        }
        .orders-list { max-width: 1000px; margin: 0 auto; }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .empty-state p { font-size: 18px; color: #999; margin-bottom: 8px; }
        .transactions-table {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .table-header {
          display: grid;
          grid-template-columns: 1fr 1.5fr 2fr 1fr;
          gap: 16px;
          padding: 20px;
          background: #f8f9fa;
          border-bottom: 2px solid #eee;
          font-weight: 700;
          color: #333;
        }
        .table-row {
          display: grid;
          grid-template-columns: 1fr 1.5fr 2fr 1fr;
          gap: 16px;
          padding: 20px;
          border-bottom: 1px solid #eee;
          transition: all 0.3s ease;
        }
        .table-row:hover { background: #f5f5f5; }
        .col-order { color: #ff6a00; font-weight: 600; }
        .col-date { color: #666; font-size: 13px; }
        .col-items { color: #555; }
        .item-text { font-size: 12px; margin: 2px 0; }
        .col-amount { color: #ff6a00; font-weight: 700; }
        .loader {
          text-align: center;
          padding: 80px 40px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
        }
        .loader p { font-size: 18px; color: #64748b; margin: 0; }
        @media (max-width: 768px) {
          .table-header, .table-row {
            grid-template-columns: 1fr 1fr;
            padding: 12px;
          }
          .col-items, .col-amount { grid-column: 1 / -1; }
        }
      `}</style>
    </>
  );
}

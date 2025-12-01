import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderStatus() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Pending");

  const statusFlow = ["Pending", "Processing", "Ready for Pickup", "Completed"];

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recent_order"));
    if (!recent) return;
    setOrder(recent);

    let step = 0;
    const interval = setInterval(() => {
      if (step < statusFlow.length - 1) {
        step++;
        setStatus(statusFlow[step]);
      } else {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const reorder = () => {
    localStorage.setItem("cart", JSON.stringify(order.items));
    navigate("/cart");
  };

  const clearOrder = () => {
    localStorage.removeItem("recent_order");
    setOrder(null);
  };

  if (!order) {
    return (
      <div className="empty">
        <h2>🛒 No Active Order</h2>
        <button onClick={() => navigate("/menu")}>Order Now</button>

        <style>{`
          .empty {text-align:center;padding:40px;font-family:system-ui;}
          button {
            padding:12px 18px;border:none;border-radius:10px;
            background:#ff6a00;color:white;font-size:16px;cursor:pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <h2>📦 Order #{order.id}</h2>

      <div className="box">
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Payment:</strong> {order.method}</p>
        <p><strong>Status:</strong> <span className="highlight">{status}</span></p>
      </div>

      <div className="qr-section">
        <div className="qr">
          📲 QR Token: <strong>{order.id.toString().slice(-6)}</strong>
        </div>
        <small>Show this at the counter to pickup</small>
      </div>

      {status === "Completed" ? (
        <div className="ready">🎉 Your order is completed!</div>
      ) : (
        <div className="waiting">⏳ Your order is being prepared...</div>
      )}

      <div className="btns">
        <button onClick={reorder}>♻️ Reorder</button>
        <button onClick={() => navigate("/menu")}>🍽 New Order</button>
        <button className="clear" onClick={clearOrder}>🗑 Clear Order</button>
      </div>

      <style>{`
        .wrapper {max-width:420px;margin:auto;padding:20px;text-align:center;font-family:system-ui;}
        .box {
          background:white;padding:14px;border-radius:12px;margin:15px 0;
          box-shadow:0 3px 10px rgba(0,0,0,0.1);text-align:left;font-size:15px;
        }
        .highlight {color:#ff6a00;font-weight:bold;}
        .qr-section {margin:20px 0;}
        .qr {font-size:22px;font-weight:bold;margin-bottom:5px;}
        .waiting {color:#555;margin-bottom:10px;}
        .ready {color:#28a745;font-size:18px;font-weight:600;margin-bottom:10px;}
        .btns {display:flex;flex-direction:column;gap:10px;margin-top:20px;}
        button {
          padding:14px;border:none;border-radius:10px;font-size:16px;cursor:pointer;
        }
        button:nth-child(1) {background:#ff6a00;color:white;}
        button:nth-child(2) {border:2px solid #ff6a00;background:white;color:#ff6a00;}
        .clear {background:#dc3545;color:white;}
      `}</style>
    </div>
  );
}

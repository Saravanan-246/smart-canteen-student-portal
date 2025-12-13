import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Timer, Package, UtensilsCrossed } from "lucide-react";

/* ---------- STEPS ---------- */
const STATUS_STEPS = [
  { label: "Order Received", icon: Timer },
  { label: "Preparing", icon: UtensilsCrossed },
  { label: "Ready For Pickup", icon: Package },
  { label: "Completed", icon: CheckCircle },
];

export default function OrderStatus() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState(0);
  const [token, setToken] = useState(null);

  /* ---------- Load Last Order ---------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recent_order"));
    if (!saved) return;

    setOrder(saved);

    // generate pickup token
    if (!saved.pickupToken) {
      const newToken = Math.floor(100000 + Math.random() * 900000).toString();
      saved.pickupToken = newToken;
      localStorage.setItem("recent_order", JSON.stringify(saved));
      setToken(newToken);
    } else {
      setToken(saved.pickupToken);
    }
  }, []);

  /* ---------- Animate Steps ---------- */
  useEffect(() => {
    if (!order) return;

    let index = 0;
    const timer = setInterval(() => {
      index++;
      setStep(index);
      if (index === STATUS_STEPS.length - 1) clearInterval(timer);
    }, 2000);

    return () => clearInterval(timer);
  }, [order]);

  /* ---------- Actions ---------- */
  const reorder = () => {
    localStorage.setItem("cart", JSON.stringify(order.items));
    navigate("/cart");
  };

  const clearOrder = () => {
    localStorage.removeItem("recent_order");
    setOrder(null);
  };

  /* ============================================================
        🔥 FULL PAGE LAYOUT (LEFT ORANGE • RIGHT WHITE)
     ============================================================ */

  return (
    <div className="status-wrapper">

      {/* LEFT ORANGE SIDE */}
      <div className="left-side">
        <h1 className="brand-title">Smart Canteen</h1>
        <p className="brand-desc">Track your food status anytime!</p>
      </div>

      {/* RIGHT SIDE – content changes based on order */}
      <div className="right-side">

        {/* If NO ORDER */}
        {!order && (
          <div className="empty-card">
            <h2>No Active Order 😔</h2>
            <p>Place an order to start tracking</p>
            <button className="btn primary" onClick={() => navigate("/menu")}>
              Order Now 🍔
            </button>
          </div>
        )}

        {/* If ORDER EXISTS */}
        {order && (
          <div className="order-card">
            <h2 className="title">🚚 Order Status</h2>
            <p className="subtext">Order ID: <strong>#{order.id}</strong></p>

            {/* Progress */}
            <div className="progress">
              <div
                className="progress-fill"
                style={{ width: `${(step / (STATUS_STEPS.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="steps">
              {STATUS_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={`step ${i <= step ? "active" : ""}`}>
                    <Icon size={26} />
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Completed Status + Token */}
            {step === STATUS_STEPS.length - 1 && (
              <div className="token-box">
                <p>🎉 Your Order is Ready!</p>
                <h1 className="token">{token}</h1>
                <small>Show this code at counter</small>

                <button
                  className="btn primary"
                  onClick={() => window.open("https://rzp.io/rzp/23SB3XX")}
                >
                  📄 Download Receipt
                </button>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="actions">
              <button className="btn primary" onClick={reorder}>♻ Reorder</button>
              <button className="btn outline" onClick={() => navigate("/menu")}>🍴 New Order</button>
              <button className="btn danger" onClick={clearOrder}>🗑 Clear</button>
            </div>
          </div>
        )}
      </div>

      <style>{styles}</style>
    </div>
  );
}

/* ============================================================
    CSS — SAME LEFT ORANGE STYLE AS CART EMPTY PAGE
   ============================================================ */
const styles = `
.status-wrapper {
  display: flex;
  height: 100vh;
  font-family: system-ui;
}

/* LEFT SIDE */
.left-side {
  flex: 1;
  background: linear-gradient(135deg, #ff7a00, #ff9d00, #ffb700);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 60px;
  color: white;
}
.brand-title { font-size: 46px; font-weight: 800; }
.brand-desc { font-size: 18px; opacity: 0.9; }

/* RIGHT */
.right-side {
  flex: 1;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* CARDS */
.empty-card,
.order-card {
  background: white;
  width: 90%;
  max-width: 420px;
  padding: 26px;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  text-align: center;
}

/* PROGRESS */
.progress {
  background: #e5e7eb;
  height: 8px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 18px;
}
.progress-fill {
  height: 100%;
  background: #16a34a;
  transition: 0.4s;
}

/* Steps */
.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #aaa;
  font-size: 12px;
}
.step.active {
  color: #16a34a;
  transform: scale(1.05);
}

/* Token box */
.token-box {
  margin-top: 15px;
  padding: 16px;
  background: #dcfce7;
  border-radius: 14px;
}
.token {
  font-size: 34px;
  font-weight: bold;
  letter-spacing: 6px;
  color: #064e3b;
}

/* Buttons */
.btn {
  padding: 14px;
  border-radius: 10px;
  font-size: 17px;
  cursor: pointer;
  border: none;
  margin-top: 6px;
}
.primary { background: #16a34a; color: white; }
.outline { border: 2px solid #16a34a; color: #16a34a; background: white; }
.danger { background: #ef4444; color: white; }

/* MOBILE */
@media(max-width: 900px) {
  .status-wrapper { flex-direction: column; }
  .left-side {
    height: 240px;
    padding-left: 20px;
    align-items: center;
    text-align: center;
  }
}
`;

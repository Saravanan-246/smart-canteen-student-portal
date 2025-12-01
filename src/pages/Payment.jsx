import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("");
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(false);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  const methods = [
    "Google Pay",
    "PhonePe",
    "Paytm",
    "UPI",
    "Cash on Delivery",
  ];

  const handlePay = async () => {
    if (!method) return alert("Select a payment method");
    if (method === "UPI" && !upi.trim()) return alert("Enter a valid UPI ID");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));

    const order = {
      id: Date.now(),
      items: cart,
      total,
      method: method === "UPI" ? `UPI (${upi})` : method,
      status: method === "Cash on Delivery" ? "Confirmed" : "Processing",
      date: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...orders, order]));
    localStorage.setItem("recent_order", JSON.stringify(order));
    localStorage.setItem("cart", JSON.stringify([]));

    navigate("/order-status");
  };

  return (
    <div className="payment-container">
      <h2>💳 Payment</h2>

      <div className="summary-box">
        <p>Total Amount</p>
        <h3>₹{total}</h3>
      </div>

      <label>Select Payment Method</label>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="">-- Select Method --</option>
        {methods.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {method === "UPI" && (
        <input
          type="text"
          placeholder="yourname@upi"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          className="upi-input"
        />
      )}

      <button disabled={loading} onClick={handlePay}>
        {loading ? "Processing..." : `Pay ₹${total}`}
      </button>

      <style>{`
        .payment-container {
          max-width: 400px;
          margin: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          font-family: system-ui;
        }
        .summary-box {
          background: #fff;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        select, input {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
        }
        button {
          padding: 14px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          cursor: pointer;
        }
        button:disabled {
          opacity: .6;
        }
      `}</style>
    </div>
  );
}

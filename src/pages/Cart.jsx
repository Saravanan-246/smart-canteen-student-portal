import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Cart() {
  const navigate = useNavigate();
  const STORAGE_KEY = "cart";
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

useEffect(() => {
  setCart(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);

  if (!window.Razorpay) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }
}, []);


  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
  };

  const changeQty = (id, diff) => {
    updateCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(1, item.qty + diff) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = () => {
    updateCart(cart.filter((item) => item.id !== confirmId));
    setConfirmId(null);
  };

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

// ✅ SAVE ORDER TO DB AFTER PAYMENT
const createOrderInDB = async (razorpayData) => {
  try {
    const token = localStorage.getItem("token"); // ✅ JWT TOKEN

    if (!token) {
      console.error("❌ Token missing");
      alert("Please login again");
      return false;
    }

    const res = await fetch(`${API_URL}/api/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ REQUIRED
      },
      body: JSON.stringify({
        items: cart,
        totalAmount: total,
        razorpay_order_id: razorpayData.razorpay_order_id,
        razorpay_payment_id: razorpayData.razorpay_payment_id,
        razorpay_signature: razorpayData.razorpay_signature,
      }),
    });

    const data = await res.json();
    console.log("✅ Order response:", data);

    if (res.ok && data.success) {
      console.log("🎉 ORDER SAVED REALTIME:", data.order._id);
      return true;
    }

    throw new Error(data.message || "Order failed");
  } catch (err) {
    console.error("❌ Order error:", err);
    alert("Order failed: " + err.message);
    return false;
  }
};


  // ✅ HANDLE PAYMENT → SAVE → REDIRECT
  const handlePayment = async () => {
  if (!cart.length) {
    alert("Cart empty!");
    return;
  }

  if (loading) return;

  const token = localStorage.getItem("token"); // ✅ JWT CHECK
  if (!token) {
    alert("Please login again");
    navigate("/login");
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Create Razorpay order
    const orderRes = await fetch(`${API_URL}/api/payments/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.success) {
      throw new Error(orderData.message || "Payment order failed");
    }

    const { order } = orderData;

    // 2️⃣ Open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RmM4UNgtmTpEjD",
      amount: order.amount,
      currency: order.currency,
      name: "Smart Canteen",
      description: `Order #${Date.now()}`,
      order_id: order.id,

      handler: async (response) => {
        console.log("💳 PAYMENT SUCCESS:", response);

        // 3️⃣ Save order to DB
        const saved = await createOrderInDB(response);

        if (saved) {
          alert("✅ Payment & Order Success!");
          localStorage.removeItem(STORAGE_KEY);
          setCart([]);
          navigate("/history");
        }

        setLoading(false);
      },

      prefill: {
        name: localStorage.getItem("student_name") || "",
        email: localStorage.getItem("student_email") || "",
      },

      theme: { color: "#ff6a00" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    alert("❌ Error: " + err.message);
    setLoading(false);
  }
};


  if (!cart.length) {
    return (
      <div className="empty-wrapper">
        <div className="left-side">
          <h1 className="brand-title">Smart Canteen</h1>
          <p className="brand-desc">Order anytime!</p>
          <img src="https://cdn-icons-png.flaticon.com/512/857/857681.png" className="icon i1" />
          <img src="https://cdn-icons-png.flaticon.com/512/3480/3480190.png" className="icon i2" />
          <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" className="icon i3" />
        </div>
        <div className="right-side">
          <div className="empty-card">
            <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" className="cart-img" />
            <h2>Cart Empty</h2>
            <p className="desc">Add items first</p>
            <button className="browse-btn" onClick={() => navigate("/menu")}>🍽 Browse Menu</button>
          </div>
        </div>
        <style>{`
          .empty-wrapper { display: flex; height: 100vh; width: 100%; overflow: hidden; font-family: system-ui; }
          .left-side { flex: 1; background: linear-gradient(135deg, #ff7a00, #ff9d00, #ffb700); display: flex; justify-content: center; align-items: center; flex-direction: column; color: white; padding: 20px; position: relative; overflow: hidden; }
          .brand-title { font-size: 48px; font-weight: 800; }
          .brand-desc { font-size: 18px; opacity: 0.9; }
          .icon { position: absolute; width: 80px; opacity: 0.18; animation: float 4s infinite ease-in-out alternate; }
          .i1 { top: 15%; left: 10%; }
          .i2 { top: 50%; left: 5%; }
          .i3 { top: 75%; left: 30%; }
          @keyframes float { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-12px) rotate(8deg); } }
          .right-side { flex: 1; background: #ffffff; display: flex; justify-content: center; align-items: center; }
          .empty-card { background: #ffffff; padding: 40px; border-radius: 18px; text-align: center; width: 350px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); }
          .cart-img { width: 120px; opacity: 0.9; margin-bottom: 12px; }
          h2 { color: #ff6a00; font-weight: 700; }
          .desc { font-size: 14px; color: #555; margin-bottom: 20px; }
          .browse-btn { background: #ff6a00; color: white; padding: 14px 24px; border-radius: 12px; border: none; font-size: 16px; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="cart-page">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate("/menu")}>← Back</button>
          <h1 className="cart-title">🛍 Your Cart</h1>
          <button className="clear-btn" onClick={() => updateCart([])}>Clear All</button>
        </div>

        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-price">₹{item.price}</div>
              </div>

              <div className="item-controls">
                <div className="qty-controls">
                  <button className="qty-btn minus" disabled={item.qty <= 1} onClick={() => changeQty(item.id, -1)}>-</button>
                  <span className="qty">{item.qty}</span>
                  <button className="qty-btn plus" onClick={() => changeQty(item.id, 1)}>+</button>
                </div>

                <div className="item-total">₹{item.qty * item.price}</div>
                <button className="remove-btn" onClick={() => setConfirmId(item.id)}>×</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="total-section">
            <div>Total Items: {totalItems}</div>
            <div className="total-price">₹{total}</div>
          </div>

          <button className="pay-btn" disabled={loading} onClick={handlePayment}>
            {loading ? "Processing..." : `Pay ₹${total} →`}
          </button>
        </div>
      </div>

      {confirmId && (
        <div className="confirm-modal">
          <div className="confirm-content">
            <h3>Remove Item?</h3>
            <div className="confirm-actions">
              <button className="confirm-no" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="confirm-yes" onClick={removeItem}>Remove</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cart-page { max-width: 600px; margin: 0 auto; padding: 20px; font-family: system-ui; }
        .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; gap: 12px; }
        .back-btn, .clear-btn { background: none; border: 1px solid #ff6a00; color: #ff6a00; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .back-btn:hover, .clear-btn:hover { background: #ff6a00; color: white; }
        .cart-title { flex: 1; text-align: center; font-size: 24px; font-weight: 700; color: #333; margin: 0; }
        .cart-items { background: #f8f9fa; border-radius: 16px; padding: 20px; margin-bottom: 30px; }
        .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #eee; }
        .item-info { flex: 1; }
        .item-name { font-weight: 600; color: #333; margin-bottom: 4px; }
        .item-price { color: #666; font-size: 14px; }
        .item-controls { display: flex; align-items: center; gap: 16px; }
        .qty-controls { display: flex; align-items: center; background: white; border-radius: 12px; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .qty-btn { width: 32px; height: 32px; border: none; background: #f0f0f0; border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: 600; }
        .qty-btn:hover { background: #ff6a00; color: white; }
        .qty-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .qty { font-weight: 700; min-width: 24px; text-align: center; margin: 0 8px; }
        .item-total { font-weight: 700; color: #ff6a00; min-width: 60px; text-align: right; }
        .remove-btn { width: 36px; height: 36px; border: none; background: #ff4444; color: white; border-radius: 50%; cursor: pointer; font-size: 18px; font-weight: 600; }
        .cart-footer { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .total-section { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 18px; font-weight: 600; }
        .total-price { color: #ff6a00; font-size: 24px; font-weight: 800; }
        .pay-btn { width: 100%; background: linear-gradient(135deg, #ff6a00, #ff8c00); color: white; border: none; padding: 16px; border-radius: 12px; font-size: 18px; font-weight: 700; cursor: pointer; }
        .pay-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,106,0,0.4); }
        .pay-btn:disabled { opacity: 0.7; }
        .confirm-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .confirm-content { background: white; padding: 32px; border-radius: 16px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .confirm-actions { display: flex; gap: 12px; margin-top: 20px; }
        .confirm-no { flex: 1; background: #f0f0f0; color: #666; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .confirm-yes { flex: 1; background: #ff4444; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; }
      `}</style>
    </>
  );
}

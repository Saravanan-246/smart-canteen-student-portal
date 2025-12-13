import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const STORAGE_KEY = "cart";

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
  };

  const changeQty = (id, diff) => {
    updateCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + diff } : item
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

  const handlePayment = () => {
    if (!cart.length) return alert("Cart is empty!");

    setLoading(true);

    setTimeout(() => {
      window.location.href = `https://rzp.io/rzp/QUYT6KNo?amount=${total}`;
    }, 500);
  };

  // ---------------- EMPTY CART UI ----------------
  if (!cart.length) {
    return (
      <div className="empty-wrapper">

        {/* LEFT SIDE BANNER */}
        <div className="left-side">
          <h1 className="brand-title">Smart Canteen</h1>
          <p className="brand-desc">Order your favourites anytime!</p>

          {/* Floating icons (fixed className) */}
          <img src="https://cdn-icons-png.flaticon.com/512/857/857681.png" className="icon i1" />
          <img src="https://cdn-icons-png.flaticon.com/512/3480/3480190.png" className="icon i2" />
          <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" className="icon i3" />
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="right-side">
          <div className="empty-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
              className="cart-img"
            />

            <h2>Your Cart is Empty</h2>
            <p className="desc">Looks like you haven't added anything yet.</p>

            <button className="browse-btn" onClick={() => navigate("/menu")}>
              🍽 Browse Menu
            </button>
          </div>
        </div>

        <style>{`
          .empty-wrapper {
            display: flex;
            height: 100vh;
            width: 100%;
            overflow: hidden;
            font-family: system-ui;
          }

          .left-side {
            flex: 1;
            background: linear-gradient(135deg, #ff7a00, #ff9d00, #ffb700);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: white;
            padding: 20px;
            position: relative;
            overflow: hidden;
          }

          .brand-title {
            font-size: 48px;
            font-weight: 800;
          }

          .brand-desc {
            font-size: 18px;
            opacity: 0.9;
          }

          .icon {
            position: absolute;
            width: 80px;
            opacity: 0.18;
            animation: float 4s infinite ease-in-out alternate;
          }

          .i1 { top: 15%; left: 10%; }
          .i2 { top: 50%; left: 5%; }
          .i3 { top: 75%; left: 30%; }

          @keyframes float {
            from { transform: translateY(0) rotate(0deg); }
            to { transform: translateY(-12px) rotate(8deg); }
          }

          .right-side {
            flex: 1;
            background: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .empty-card {
            background: #ffffff;
            padding: 40px;
            border-radius: 18px;
            text-align: center;
            width: 350px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          }

          .cart-img {
            width: 120px;
            opacity: 0.9;
            margin-bottom: 12px;
          }

          h2 {
            color: #ff6a00;
            font-weight: 700;
          }

          .desc {
            font-size: 14px;
            color: #555;
            margin-bottom: 20px;
          }

          .browse-btn {
            background: #ff6a00;
            color: white;
            padding: 14px 24px;
            border-radius: 12px;
            border: none;
            font-size: 16px;
            cursor: pointer;
          }

        `}</style>
      </div>
    );
  }

  // ---------------- NORMAL CART UI ----------------
  return (
    <>

      {/* Your normal cart UI untouched */}
      <div className="cart-page">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate("/menu")}>
            ← Back
          </button>
          <h1 className="cart-title">🛍 Your Cart</h1>
          <button className="clear-btn" onClick={() => updateCart([])}>
            Clear All
          </button>
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
                  <button
                    className="qty-btn minus"
                    disabled={item.qty <= 1}
                    onClick={() => changeQty(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="qty">{item.qty}</span>
                  <button className="qty-btn plus" onClick={() => changeQty(item.id, 1)}>
                    +
                  </button>
                </div>

                <div className="item-total">₹{item.qty * item.price}</div>
                <button className="remove-btn" onClick={() => setConfirmId(item.id)}>
                  ×
                </button>
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
              <button className="confirm-no" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button className="confirm-yes" onClick={removeItem}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

   
      {/* ---- STYLES (unchanged design) ---- */}
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#f8f9fa;min-height:100vh;font-family:system-ui;}
        .cart-page{padding:24px;max-width:600px;margin:0 auto;min-height:100vh;}
        .cart-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;gap:12px;}
        .back-btn,.clear-btn{padding:10px 18px;border:2px solid #ff6a00;border-radius:12px;font-weight:600;cursor:pointer;font-size:14px;transition:all .2s;}
        .back-btn{background:white;color:#ff6a00;}.back-btn:hover{background:#ff6a00;color:white;}
        .clear-btn{background:#dc3545;color:white;border-color:#dc3545;font-size:13px;}.clear-btn:hover{background:#c82333;border-color:#c82333;}
        .cart-title{font-size:26px;color:#ff6a00;font-weight:700;margin:0;flex:1;text-align:center;}
        .cart-items{background:white;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,.08);overflow:hidden;margin-bottom:20px;}
        .cart-item{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #f1f3f4;}
        .cart-item:last-child{border-bottom:none;}.cart-item:hover{background:#f8f9fa;}
        .item-info{flex:1;}.item-name{font-size:17px;font-weight:600;color:#212529;margin-bottom:2px;}
        .item-price{color:#28a745;font-weight:500;font-size:14px;}
        .item-controls{display:flex;align-items:center;gap:12px;}
        .qty-controls{display:flex;align-items:center;gap:8px;background:#f8f9fa;padding:6px 10px;border-radius:8px;}
        .qty-btn{width:32px;height:32px;border:1px solid #dee2e6;border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;background:white;}
        .qty-btn.minus{color:#dc3545;}.qty-btn.plus{color:#28a745;}.qty-btn:hover:not(:disabled){background:#e9ecef;}.qty-btn:disabled{opacity:.5;cursor:not-allowed;}
        .qty{font-size:16px;font-weight:600;color:#495057;min-width:20px;text-align:center;}
        .item-total{font-size:17px;font-weight:700;color:#ff6a00;min-width:70px;text-align:right;}
        .remove-btn{width:32px;height:32px;border:1px solid #dee2e6;border-radius:6px;background:#f8f9fa;color:#dc3545;font-size:18px;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;}
        .remove-btn:hover{background:#dc3545;color:white;}
        .cart-footer{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 12px rgba(0,0,0,.08);}
        .total-section{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #f1f3f4;}
        .total-price{font-size:26px;font-weight:700;color:#ff6a00;}
        .pay-btn{width:100%;padding:16px;background:#28a745;color:white;border:none;border-radius:12px;font-size:17px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(40,167,69,.3);}
        .pay-btn:hover:not(:disabled){background:#218838;transform:translateY(-1px);box-shadow:0 4px 12px rgba(40,167,69,.4);}.pay-btn:disabled{opacity:.7;cursor:not-allowed;}
        .confirm-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:1000;}
        .confirm-content{background:white;padding:28px;border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.2);text-align:center;max-width:380px;width:90%;}
        @media (max-width:768px){.cart-page{padding:20px 16px;}.cart-header{flex-direction:column;text-align:center;}.cart-item{flex-direction:column;gap:16px;align-items:stretch;}}
      `}</style>
    </>
  );
}

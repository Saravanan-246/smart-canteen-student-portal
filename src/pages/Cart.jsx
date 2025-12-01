import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const STORAGE_KEY = "cart";
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [removeConfirmId, setRemoveConfirmId] = useState(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
  };

  const increase = (id) =>
    updateCart(cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  const decrease = (id) =>
    updateCart(
      cart
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );

  const confirmRemove = (id) => {
    setRemoveConfirmId(id);
    setShowConfirm(true);
  };

  const handleRemove = () => {
    if (removeConfirmId) {
      updateCart(cart.filter((i) => i.id !== removeConfirmId));
      setShowConfirm(false);
      setRemoveConfirmId(null);
    }
  };

  const clearCart = () => {
    if (confirm("Clear entire cart?")) updateCart([]);
  };

  const total = cart.reduce((a, b) => a + b.qty * b.price, 0);
  const totalItems = cart.reduce((a, b) => a + b.qty, 0);

  // ✅ FIX: Cart should go to Payment screen, not process inside here
  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    navigate("/payment");
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-container">
          <div className="cart-icon">🛒</div>
          <h1 className="empty-title">Your Cart is Empty</h1>
          <p className="empty-text">Discover our delicious menu!</p>
          <div className="empty-actions">
            <button className="menu-btn" onClick={() => navigate("/menu")}>
              🍽 Browse Menu
            </button>
            <button className="back-btn" onClick={() => navigate("/")}>
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cart-page">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate("/menu")}>
            ← Back to Menu
          </button>
          <h1 className="cart-title">🛍 Your Cart</h1>
          {cart.length > 0 && (
            <button className="clear-btn" onClick={clearCart}>
              Clear All
            </button>
          )}
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
                    onClick={() => decrease(item.id)}
                    disabled={item.qty <= 1}
                  >
                    -
                  </button>
                  <span className="qty">{item.qty}</span>
                  <button
                    className="qty-btn plus"
                    onClick={() => increase(item.id)}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ₹{(item.qty * item.price).toLocaleString()}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => confirmRemove(item.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="total-section">
            <div>Total Items: {totalItems}</div>
            <div className="total-price">₹{total.toLocaleString()}</div>
          </div>

          {/* FIXED BUTTON — now goes to Payment.jsx */}
          <button
            className={`pay-btn ${loading ? "loading" : ""}`}
            onClick={handlePayment}
          >
            Pay ₹{total.toLocaleString()} →
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-modal">
          <div className="confirm-content">
            <h3>Remove Item?</h3>
            <p>Are you sure?</p>
            <div className="confirm-actions">
              <button className="confirm-no" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-yes" onClick={handleRemove}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

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
        .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-radius:50%;border-top-color:#fff;animation:spin 1s infinite;margin-right:10px;display:inline-block;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .empty-cart{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;}
        .empty-container{background:white;padding:48px 32px;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,.12);max-width:450px;width:100%;text-align:center;}
        .cart-icon{font-size:72px;margin-bottom:20px;}
        .empty-title{font-size:28px;color:#212529;margin-bottom:8px;font-weight:700;}
        .empty-text{color:#6c757d;font-size:16px;margin-bottom:32px;}
        .empty-actions{display:flex;gap:12px;flex-direction:column;}
        .menu-btn,.back-btn{padding:14px 24px;border-radius:12px;font-weight:600;font-size:16px;cursor:pointer;transition:all .2s;border:none;}
        .menu-btn{background:#ff6a00;color:white;box-shadow:0 4px 16px rgba(255,106,0,.3);}.menu-btn:hover{background:#e55f00;transform:translateY(-1px);}
        .back-btn{background:white;color:#ff6a00;border:2px solid #ff6a00;}.back-btn:hover{background:#ff6a00;color:white;transform:translateY(-1px);}
        .confirm-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:1000;}
        .confirm-content{background:white;padding:28px;border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.2);text-align:center;max-width:380px;width:90%;}
        .confirm-content h3{color:#212529;margin-bottom:12px;font-size:20px;font-weight:600;}
        .confirm-content p{color:#6c757d;margin-bottom:20px;font-size:15px;}
        .confirm-actions{display:flex;gap:12px;justify-content:center;}
        .confirm-no,.confirm-yes{padding:10px 20px;border:2px solid #dee2e6;border-radius:8px;font-weight:500;cursor:pointer;transition:all .2s;font-size:14px;flex:1;}
        .confirm-no{background:white;color:#495057;}.confirm-no:hover{background:#f8f9fa;}
        .confirm-yes{background:#dc3545;color:white;border-color:#dc3545;}.confirm-yes:hover{background:#c82333;border-color:#c82333;}
        @media (max-width:768px){.cart-page{padding:20px 16px;}.cart-header{flex-direction:column;text-align:center;}.cart-item{flex-direction:column;gap:16px;align-items:stretch;}.item-controls{justify-content:space-between;}.empty-container{padding:40px 24px;}}
      `}</style>
    </>
  );
}

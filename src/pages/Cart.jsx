import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smart-canteen-student-portal.onrender.com";

export default function Cart() {
  const navigate = useNavigate();
  const STORAGE_KEY = "cart";

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  /* ---------------- LOAD CART + RAZORPAY ---------------- */

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (savedCart) setCart(savedCart);
    } catch {
      setCart([]);
    }

    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  /* ---------------- UPDATE CART ---------------- */

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
  };

  const changeQty = (id, diff) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + diff) }
          : item
      )
      .filter((item) => item.qty > 0);

    updateCart(updated);
  };

  const removeItem = () => {
    updateCart(cart.filter((item) => item.id !== confirmId));
    setConfirmId(null);
  };

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  /* ---------------- SAVE ORDER ---------------- */

  const createOrderInDB = async (razorpayData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Login again.");
        navigate("/login");
        return false;
      }

      const res = await fetch(`${API_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: total,
          ...razorpayData,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) return true;

      throw new Error(data.message || "Order failed");
    } catch (err) {
      console.error(err);
      alert("Order failed");
      return false;
    }
  };

  /* ---------------- PAYMENT ---------------- */

  const handlePayment = async () => {
    if (!cart.length) return alert("Cart empty!");

    if (loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const orderRes = await fetch(`${API_URL}/api/payments/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success)
        throw new Error(orderData.message);

      const { order } = orderData;

      const options = {
        key:
          import.meta.env.VITE_RAZORPAY_KEY_ID ||
          "rzp_test_RmM4UNgtmTpEjD",

        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        name: "Smart Canteen",
        description: "Food Order",

        handler: async (response) => {
          const saved = await createOrderInDB(response);

          if (saved) {
            localStorage.removeItem(STORAGE_KEY);
            setCart([]);
            navigate("/history");
          }

          setLoading(false);
        },

        theme: { color: "#ff6a00" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  /* ---------------- EMPTY CART ---------------- */

  if (!cart.length) {
    return (
      <div className="empty-wrapper">
        <div className="empty-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            className="cart-img"
          />
          <h2>Your Cart is Empty</h2>
          <p>Add delicious food from menu</p>
          <button onClick={() => navigate("/menu")}>
            Browse Menu
          </button>
        </div>

        <style>{`
          .empty-wrapper{
            height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            background:#fafafa;
          }

          .empty-card{
            text-align:center;
            background:white;
            padding:40px;
            border-radius:16px;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);
          }

          .cart-img{
            width:120px;
            margin-bottom:15px;
          }

          button{
            margin-top:15px;
            padding:12px 20px;
            border:none;
            border-radius:10px;
            background:#ff6a00;
            color:white;
            font-weight:600;
            cursor:pointer;
          }
        `}</style>
      </div>
    );
  }

  /* ---------------- CART UI ---------------- */

  return (
    <>
      <div className="cart-page">

        <div className="cart-header">
          <button onClick={() => navigate("/menu")}>
            ← Back
          </button>

          <h1>🛍 Your Cart</h1>

          <button onClick={() => updateCart([])}>
            Clear
          </button>
        </div>

        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">

              <div className="item-info">
                <b>{item.name}</b>
                <span>₹{item.price}</span>
              </div>

              <div className="controls">

                <button
                  disabled={item.qty <= 1}
                  onClick={() => changeQty(item.id, -1)}
                >
                  -
                </button>

                <span>{item.qty}</span>

                <button
                  onClick={() => changeQty(item.id, 1)}
                >
                  +
                </button>

                <strong>
                  ₹{item.qty * item.price}
                </strong>

                <button
                  className="remove"
                  onClick={() => setConfirmId(item.id)}
                >
                  ×
                </button>

              </div>

            </div>
          ))}
        </div>

        <div className="cart-footer">

          <div className="total">
            <span>{totalItems} Items</span>
            <span>₹{total}</span>
          </div>

          <button
            disabled={loading}
            onClick={handlePayment}
            className="pay-btn"
          >
            {loading ? "Processing..." : `Pay ₹${total}`}
          </button>

        </div>

      </div>

      <style>{`

.cart-page{
max-width:650px;
margin:auto;
padding:20px;
font-family:system-ui;
}

.cart-header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
}

.cart-items{
background:#f8f9fa;
border-radius:12px;
padding:20px;
}

.cart-item{
display:flex;
justify-content:space-between;
align-items:center;
padding:12px 0;
border-bottom:1px solid #eee;
}

.item-info{
display:flex;
flex-direction:column;
gap:3px;
}

.controls{
display:flex;
align-items:center;
gap:10px;
}

.controls button{
width:30px;
height:30px;
border:none;
border-radius:8px;
cursor:pointer;
background:#f0f0f0;
}

.controls button:hover{
background:#ff6a00;
color:white;
}

.remove{
background:#ff4444 !important;
color:white;
border-radius:50%;
}

.cart-footer{
margin-top:20px;
background:white;
padding:20px;
border-radius:12px;
box-shadow:0 8px 25px rgba(0,0,0,0.1);
}

.total{
display:flex;
justify-content:space-between;
font-size:18px;
margin-bottom:15px;
}

.pay-btn{
width:100%;
padding:14px;
background:linear-gradient(135deg,#ff6a00,#ff8c00);
border:none;
border-radius:12px;
font-size:18px;
font-weight:700;
color:white;
cursor:pointer;
}

.pay-btn:hover{
transform:translateY(-2px);
}

      `}</style>
    </>
  );
}
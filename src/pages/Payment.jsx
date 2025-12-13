import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaGooglePay } from "react-icons/fa";
import { SiPaytm, SiPhonepe } from "react-icons/si";
import QRCode from "react-qr-code";
import axios from "axios";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const totalAmount = location.state?.total || 0;

  const [order, setOrder] = useState(null);
  const [upiLink, setUpiLink] = useState("");
  const [status, setStatus] = useState("IDLE");

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  /* -------------------- LOAD RAZORPAY CUSTOM BUTTON --------------------*/
  useEffect(() => {
    const form = document.getElementById("rzp-btn");

    if (form) {
      form.innerHTML = ""; // avoid duplicate buttons

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.setAttribute("data-payment_button_id", "pl_Rn91OrM6zOQkop");
      script.async = true;

      form.appendChild(script);
    }
  }, []);

  /* -------------------- CREATE ORDER --------------------*/
  const createOrder = async () => {
    const { data } = await axios.post("/api/payment/create", {
      amount: totalAmount,
      studentId: "S001",
    });

    setOrder(data.order);

    setUpiLink(
      `upi://pay?pa=pay@upi&pn=SmartCanteen&am=${totalAmount}&cu=INR&tn=CanteenFood`
    );

    openRazorpay(data.order);
  };

  /* -------------------- OPEN RAZOARPAY CHECKOUT --------------------*/
  const openRazorpay = (orderObj) => {
    const options = {
      key: razorpayKey,
      order_id: orderObj.id,
      name: "Smart Canteen",
      description: "Order Payment",
      amount: orderObj.amount,
      currency: "INR",
      theme: { color: "#FF7A00" },
      handler: () => {
        setStatus("PROCESSING");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setStatus("WAITING");
  };

  /* -------------------- AUTO PAYMENT CHECK --------------------*/
  useEffect(() => {
    if (!order || status === "SUCCESS") return;

    const interval = setInterval(async () => {
      const res = await axios.get(`/api/payment/status/${order.id}`);

      if (res.data.status === "SUCCESS") {
        setStatus("SUCCESS");
        localStorage.removeItem("cart");

        setTimeout(() => navigate("/order-status"), 1500);

        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [order, status]);

  /* -------------------- JSX UI --------------------*/
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Pay Securely</h2>

        <div style={styles.amountBox}>
          <p>Total Amount</p>
          <strong>₹{totalAmount}</strong>
        </div>

        {/* UPI APPS */}
        <h4 style={styles.subHeader}>Pay Using UPI Apps</h4>

        <div style={styles.apps}>
          <FaGooglePay
            style={styles.icon}
            size={60}
            onClick={() => {
              window.location.href = upiLink;
              setTimeout(() => navigate("/order-status"), 2000);
            }}
          />

          <SiPhonepe
            style={{ ...styles.icon, color: "#5F259F" }}
            size={50}
            onClick={() => {
              window.location.href = upiLink;
              setTimeout(() => navigate("/order-status"), 2000);
            }}
          />

          <SiPaytm
            style={{ ...styles.icon, color: "#0F9DE8" }}
            size={50}
            onClick={() => {
              window.location.href = upiLink;
              setTimeout(() => navigate("/order-status"), 2000);
            }}
          />
        </div>

        {/* OR */}
        <div style={styles.orLine}>
          <span>OR</span>
        </div>

        {/* QR CODE */}
        <h4 style={styles.subHeader}>Scan QR to Pay</h4>

        <div style={styles.qrArea}>
          {!upiLink ? (
            <p>Generate payment request…</p>
          ) : (
            <QRCode value={upiLink} size={160} />
          )}
        </div>

        {/* Auto redirect when QR scanned */}
        {upiLink && (
          <script>
            {setTimeout(() => navigate("/order-status"), 3000)}
          </script>
        )}

        {/* OR */}
        <div style={styles.orLine}>
          <span>OR</span>
        </div>

        {/* RAZORPAY CUSTOM BUTTON */}
        <h4 style={styles.subHeader}>Razorpay Secure Payment</h4>
        <form id="rzp-btn" style={{ marginBottom: 20 }}></form>

        {/* MAIN PAY BUTTON */}
        <button style={styles.payBtn} onClick={createOrder}>
          Proceed to Pay ₹{totalAmount}
        </button>

        {/* STATUS */}
        {status === "WAITING" && (
          <p style={styles.info}>⏳ Waiting for UPI confirmation…</p>
        )}
        {status === "PROCESSING" && (
          <p style={styles.info}>🔍 Verifying Payment…</p>
        )}
        {status === "SUCCESS" && (
          <p style={styles.success}>🎉 Payment Successful!</p>
        )}
      </div>
    </div>
  );
}

/* -------------------- STYLES --------------------*/
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#F4F7FF",
    padding: 20,
  },
  box: {
    width: 380,
    padding: 25,
    borderRadius: 16,
    background: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 12,
  },
  amountBox: {
    background: "#FFF4E5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 18,
    border: "2px solid #FF7A00",
  },
  subHeader: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 600,
  },
  apps: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginBottom: 10,
  },
  icon: {
    cursor: "pointer",
    transition: "0.2s",
  },
  orLine: {
    opacity: 0.5,
    margin: "12px 0",
  },
  qrArea: {
    background: "white",
    borderRadius: 12,
    padding: 12,
    minHeight: 180,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px dashed #FFB066",
  },
  payBtn: {
    width: "100%",
    marginTop: 20,
    padding: 14,
    background: "#FF7A00",
    color: "white",
    border: "none",
    fontSize: 17,
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(255,122,0,0.3)",
    transition: "0.3s",
  },
  info: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
  success: {
    marginTop: 10,
    fontSize: 18,
    color: "#28A745",
    fontWeight: 600,
  },
};

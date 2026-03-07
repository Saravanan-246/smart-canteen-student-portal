import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smart-canteen-student-portal.onrender.com";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const totalAmount = location.state?.total || 0;

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("IDLE");
  const [loading, setLoading] = useState(false);

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  /* ---------------- USER CHECK ---------------- */
  const user = JSON.parse(localStorage.getItem("student_user"));

  useEffect(() => {
    if (!user?.token) {
      alert("Please login again");
      navigate("/login");
    }
  }, [navigate, user]);

  /* ---------------- CREATE ORDER ---------------- */
  const createOrder = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API_URL}/api/payment/create`,
        {
          amount: totalAmount,
          studentId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!data?.order) {
        throw new Error("Order creation failed");
      }

      setOrder(data.order);

      openRazorpay(data.order);

    } catch (err) {
      console.error("Payment error:", err);
      alert("Unable to start payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OPEN RAZORPAY ---------------- */
  const openRazorpay = (orderObj) => {
    const options = {
      key: razorpayKey,
      order_id: orderObj.id,
      name: "Smart Canteen",
      description: "Food Order Payment",
      amount: orderObj.amount,
      currency: "INR",
      theme: { color: "#FF7A00" },

      handler: async (response) => {
        try {
          setStatus("PROCESSING");

          await axios.post(
            `${API_URL}/api/payment/verify`,
            response,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          setStatus("SUCCESS");

          localStorage.removeItem("cart");

          setTimeout(() => navigate("/order-status"), 1200);

        } catch (err) {
          console.error("Verification error:", err);
          alert("Payment verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    setStatus("WAITING");
  };

  /* ---------------- AUTO PAYMENT CHECK (fallback) ---------------- */
  useEffect(() => {
    if (!order || status === "SUCCESS") return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/payment/status/${order.id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (res.data.status === "SUCCESS") {
          setStatus("SUCCESS");
          localStorage.removeItem("cart");

          setTimeout(() => navigate("/order-status"), 1200);
        }
      } catch (err) {
        console.error("Payment status check error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order, status, navigate, user]);
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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("studentUser"));

    if (!storedUser || storedUser.email !== email) {
      setMessage({ text: "❌ Email not found", type: "error" });
      return;
    }

    setMessage({ text: "📩 Reset link has been sent!", type: "success" });

    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <>
      <div className="forgot-page">

        {/* 🔥 Top White Lines */}
        <div className="top-lines">
          <div className="line line1"></div>
          <div className="line line2"></div>
          <div className="line line3"></div>
        </div>

        {/* 🍟 Floating Icons */}
        <img src="https://cdn-icons-png.flaticon.com/512/3480/3480190.png" className="food f1" />
        <img src="https://cdn-icons-png.flaticon.com/512/857/857681.png" className="food f2" />
        <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" className="food f3" />

        {/* GLASS CARD */}
        <div className="forgot-box">
          <h2>Reset Password 🔑</h2>
          <p className="subtitle">Enter your registered email</p>

          <form className="form" onSubmit={handleReset}>

            {/* EMAIL INPUT */}
            <div className="input-wrapper">
              <FiMail className="icon" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message && (
              <p className={`message ${message.type}`}>{message.text}</p>
            )}

            <button className="btn">Send Reset Link</button>
          </form>

          {/* BACK BUTTON */}
          <p className="back">
            <FiArrowLeft size={15}/>
            <Link className="link" to="/login">Back to Login</Link>
          </p>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        body { margin:0; font-family:"Poppins",sans-serif; }

        .forgot-page {
          height:100vh;
          background:linear-gradient(135deg, #ff6a00, #ff8d00, #ffb300);
          display:flex; justify-content:center; align-items:center;
          position:relative; overflow:hidden;
        }

        /* White Header Lines */
        .top-lines { position:absolute; top:18px; left:15px; }
        .line { height:4px; background:white; border-radius:10px; opacity:0.85; }
        .line1 { width:150px; margin-bottom:6px; }
        .line2 { width:100px; margin-bottom:6px; }
        .line3 { width:65px; }

        /* Floating icons */
        .food {
          position:absolute;
          opacity:0.14;
          filter:brightness(100) invert(1);
          animation:float 6s infinite alternate ease-in-out;
        }
        .f1 { width:85px; top:15%; left:6%; }
        .f2 { width:75px; bottom:15%; right:10%; }
        .f3 { width:95px; top:45%; right:30%; }

        @keyframes float {
          from { transform:translateY(0) rotate(0); }
          to { transform:translateY(15px) rotate(8deg); }
        }

        .forgot-box {
          width:350px; padding:40px;
          background:rgba(255,255,255,0.16);
          border-radius:22px;
          backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,0.35);
          box-shadow:0 18px 50px rgba(0,0,0,0.25);
          animation:fade .35s ease;
        }

        h2 { text-align:center;color:white;font-weight:600;margin-bottom:6px; }
        .subtitle { text-align:center;color:#ffeccc;margin-bottom:22px; }

        .form { display:flex;flex-direction:column;gap:18px; }

        .input-wrapper {
          display:flex;align-items:center;
          background:rgba(255,255,255,0.30);
          padding:14px 18px;border-radius:12px;
          gap:12px;border:1px solid transparent;
        }

        .input-wrapper:focus-within {
          border:1px solid white;
          box-shadow:0 0 10px rgba(255,255,255,.45);
        }

        input {
          background:transparent;border:none;outline:none;
          width:100%;color:white;font-size:16px;
        }

        input::placeholder { color:#fff1ce;font-size:14px; }

        .btn {
          background:white;color:#ff6a00;
          padding:15px;border-radius:12px;
          font-size:18px;font-weight:600;
          cursor:pointer;transition:.3s;margin-top:6px;
          border:none;
        }

        .btn:hover { transform:scale(1.06); }

        .message { text-align:center;font-size:15px;font-weight:600; }
        .success { color:#b6ffcd; }
        .error { color:#ffcccc; }

        .back { text-align:center;margin-top:12px;color:white;display:flex;justify-content:center; gap:6px; }

        .link { text-decoration:none;color:white;font-weight:bold; }

        @keyframes fade { from{opacity:0;transform:translateY(20px);} to{opacity:1;} }
      `}</style>
    </>
  );
}

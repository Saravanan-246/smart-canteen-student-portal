import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";  // 🔥 added

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 added auth

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("⚠ All fields are required");
      return;
    }

    if (form.password !== form.confirm) {
      setError("❌ Passwords do not match");
      return;
    }

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    // Save to local storage
    localStorage.setItem("studentUser", JSON.stringify(newUser));

    // Update global auth + auto login
    login(newUser);

    // Redirect to home
    navigate("/menu");
  };

  return (
    <>
      <div className="signup-page">
        <div className="top-lines">
          <div className="line line1"></div>
          <div className="line line2"></div>
          <div className="line line3"></div>
        </div>

        <img src="https://cdn-icons-png.flaticon.com/512/3480/3480190.png" className="food f1" />
        <img src="https://cdn-icons-png.flaticon.com/512/857/857681.png" className="food f2" />
        <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" className="food f3" />

        <div className="signup-box">
          <h2>Create Account ✨</h2>
          <p className="subtitle">Join Smart Ordering</p>

          <form className="form" onSubmit={handleSignup}>

            <div className="input-wrapper">
              <FiUser className="icon" size={18}/>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="input-wrapper">
              <FiMail className="icon" size={18}/>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="input-wrapper">
              <FiLock className="icon" size={18}/>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <span className="eye-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff size={18}/> : <FiEye size={18}/> }
              </span>
            </div>

            <div className="input-wrapper">
              <FiLock className="icon" size={18}/>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
              <span className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FiEyeOff size={18}/> : <FiEye size={18}/> }
              </span>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="btn">Create Account</button>
          </form>

          <p className="small">
            Already have an account? <Link className="link" to="/login">Login</Link>
          </p>
        </div>
      </div>

      {/* 🔥 Same UI (unchanged) */}
      <style>{`
        body { margin:0; font-family:"Poppins",sans-serif; }

        .signup-page {
          height:100vh;
          background:linear-gradient(135deg, #ff6a00, #ff8d00, #ffb300);
          display:flex; justify-content:center; align-items:center;
          position:relative; overflow:hidden;
        }

        .top-lines { position:absolute; top:18px; left:15px; }
        .line { height:4px; background:white; border-radius:10px; opacity:0.85; }
        .line1 { width:150px; margin-bottom:6px; }
        .line2 { width:100px; margin-bottom:6px; }
        .line3 { width:65px; }

        .food {
          position:absolute;
          opacity:0.14;
          filter:brightness(100) invert(1);
          animation:move 6s infinite alternate ease-in-out;
        }

        .f1 { width:85px; top:15%; left:6%; }
        .f2 { width:75px; bottom:15%; right:10%; }
        .f3 { width:95px; top:45%; right:30%; }

        @keyframes move {
          from { transform:translateY(0px) rotate(0deg); }
          to { transform:translateY(15px) rotate(8deg); }
        }

        .signup-box {
          width:350px;
          padding:40px;
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
          display:flex; align-items:center;
          background:rgba(255,255,255,0.30);
          padding:14px 18px;
          border-radius:12px;
          gap:12px;
          transition:0.3s;
          border:1px solid transparent;
        }

        .input-wrapper:focus-within {
          border:1px solid white;
          box-shadow:0 0 10px rgba(255,255,255,.45);
        }

        input {
          border:none;background:transparent;
          width:100%;outline:none;color:white;
          font-size:16px;font-weight:500;letter-spacing:.4px;
        }

        input::placeholder { color:#fff1ce;font-size:14px; }
        .eye-icon { cursor:pointer;color:white;opacity:.9; }

        .btn {
          background:white;
          color:#ff6a00;
          padding:15px;
          border-radius:12px;
          font-size:18px;
          font-weight:600;
          border:none;
          transition:.3s;
          cursor:pointer;
          margin-top:6px;
        }
        .btn:hover { transform:scale(1.06); }

        .link { color:white;font-weight:bold;text-decoration:none; }
        .small { text-align:center;color:white;margin-top:10px; }
        .error { text-align:center;color:#ffe1e1; font-size:14px; }

        @keyframes fade {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; }
        }
      `}</style>
    </>
  );
}

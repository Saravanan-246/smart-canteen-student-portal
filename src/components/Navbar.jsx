import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FiHome, FiShoppingCart, FiList, FiLogOut, FiUser } from "react-icons/fi";
import { TbSchool } from "react-icons/tb";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const underlineRef = useRef(null);
  const linksRef = useRef([]);

  const pages = [
    { path: "/menu", label: "Menu", icon: <FiHome size={20} /> },
    { path: "/cart", label: "Cart", icon: <FiShoppingCart size={20} /> },
    { path: "/order-status", label: "My Orders", icon: <FiList size={20} /> },
    { path: "/profile", label: "Profile", icon: <FiUser size={20} /> }
  ];

  useEffect(() => {
    setMenuOpen(false);
    setConfirmVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    const index = pages.findIndex(p => p.path === location.pathname);
    const underline = underlineRef.current;
    const el = linksRef.current[index];
    if (!underline) return;

    if (el) {
      underline.style.width = el.offsetWidth + "px";
      underline.style.transform = `translateX(${el.offsetLeft}px)`;
      underline.style.opacity = "1";
    } else {
      underline.style.opacity = "0";
    }
  }, [location.pathname, menuOpen]);

  const confirmLogout = () => {
    logout();
    localStorage.removeItem("student_user");
    localStorage.removeItem("studentToken");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="navbar">
        <div className="brand" onClick={() => navigate("/menu")}>
          <TbSchool size={28} />
          <h2 className="brand-text">Student Portal</h2>
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <div className="underline" ref={underlineRef} />

          {pages.map((item, i) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
              ref={(el) => (linksRef.current[i] = el)}
            >
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}

          <button className="logout-btn" onClick={() => setConfirmVisible(true)}>
            <FiLogOut size={20} /> <span>Logout</span>
          </button>
        </div>

        <button className="menu-btn" onClick={() => setMenuOpen(s => !s)}>
          {menuOpen ? "✖" : "☰"}
        </button>
      </nav>

      {confirmVisible && (
        <div className="popup-bg">
          <div className="popup">
            <h3>Logout?</h3>
            <p>Do you want to exit?</p>
            <div className="popup-actions">
              <button className="yes" onClick={confirmLogout}>Yes</button>
              <button className="no" onClick={() => setConfirmVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
  
      <style>{`

        /* Navbar Container */
        .navbar {
          background: linear-gradient(135deg, #ff6a00, #ff8d00, #ffb300);
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          color: white;
        }

        /* Branding */
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .brand-text {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        /* Navigation block */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 25px;
          position: relative;
        }

        /* Animated underline */
        .underline {
          position: absolute;
          bottom: -6px;
          height: 3px;
          background: rgba(255,255,255,0.95);
          border-radius: 6px;
          transition: 0.35s ease;
          width: 0;
          transform: translateX(0);
          opacity: 0;
        }

        /* Nav button style */
        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: white;
          font-size: 15px;
          opacity: 0.9;
          transition: 0.25s;
        }

        .nav-link .link-label { display: inline-block; }

        .nav-link:hover { opacity: 1; transform: translateY(-1px); }
        .nav-link.active { opacity: 1; font-weight: 700; }

        /* Logout button */
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.18);
          padding: 9px 14px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          transition: .25s;
          color: white;
        }

        .logout-btn:hover { background: rgba(255,255,255,0.32); }

        .menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 28px;
          color: white;
          cursor: pointer;
        }

        /* ------------------ MOBILE FIX ------------------ */
        @media(max-width: 768px) {

          .brand-text { font-size: 18px; }

          .nav-links {
            flex-direction: column;
            width: 80%;
            position: absolute;
            top: 64px;
            right: 0;
            padding: 22px;
            gap: 18px;

            /* mobile background */
            background: rgba(255,110,0,0.96);
            border-left: 2px solid rgba(255,255,255,0.18);
            border-bottom: 2px solid rgba(255,255,255,0.18);
            border-radius: 0 0 0 16px;
            display: none;
          }

          .nav-links.open {
            display: flex;
            animation: fadeSlide .30s ease-out;
          }

          .nav-link {
            font-size: 18px;
            opacity: 1;
          }
          .logout-btn {
            font-size: 17px;
            padding: 12px 16px;
          }

          .underline { display: none; }
          .menu-btn { display: block; }
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Popup */
        .popup-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* 🔥 ADD THIS */
}


        .popup {
          background: white;
          width: 280px;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }

        .popup-actions {
          margin-top: 15px;
          display: flex;
          justify-content: space-between;
        }

        .popup button {
          width: 48%;
          padding: 8px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
        }

        .yes { background: #ff6a00; color: white; }
        .no { background: #ddd; color: #333; }

      `}</style>
    </>
  );
}

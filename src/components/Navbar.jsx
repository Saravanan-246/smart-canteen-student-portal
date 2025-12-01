import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FiHome, FiShoppingCart, FiList, FiLogOut } from "react-icons/fi";
import { TbSchool } from "react-icons/tb";

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const underlineRef = useRef(null);
  const linksRef = useRef([]);

  const pages = [
    { path: "/menu", label: "Menu", icon: <FiHome size={20} /> },
    { path: "/cart", label: "Cart", icon: <FiShoppingCart size={20} /> },
    { path: "/order-status", label: "My Orders", icon: <FiList size={20} /> }
  ];

  // Move underline to active link
  useEffect(() => {
    const activeIndex = pages.findIndex(p => p.path === location.pathname);
    if (linksRef.current[activeIndex] && underlineRef.current) {
      underlineRef.current.style.width = linksRef.current[activeIndex].offsetWidth + "px";
      underlineRef.current.style.transform =
        `translateX(${linksRef.current[activeIndex].offsetLeft}px)`;
    }
  }, [location.pathname, menuOpen]);

  const logout = () => setConfirmVisible(true);

  const confirmLogout = () => {
    localStorage.removeItem("studentLoggedIn");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">

        {/* App Branding */}
        <div className="brand">
          <TbSchool size={28} className="brand-icon" />
          <h2 className="brand-text">Student Portal</h2>
        </div>

        {/* Desktop + mobile nav */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>

          {/* Sliding underline */}
          <div className="underline" ref={underlineRef}></div>

          {pages.map((item, i) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
              ref={(el) => (linksRef.current[i] = el)}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon} {item.label}
            </Link>
          ))}

          <button className="logout-btn" onClick={logout}>
            <FiLogOut size={20} /> Logout
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </button>
      </nav>

      {/* Logout Prompt */}
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
          background: white;
          border-radius: 6px;
          transition: 0.35s ease;
        }

        /* Nav button style */
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: white;
          font-size: 15px;
          opacity: 0.85;
          transition: 0.25s;
        }

        .nav-link:hover { opacity: 1; }
        .nav-link.active { opacity: 1; font-weight: 600; }

        /* Logout button */
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.28);
          padding: 9px 14px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: .3s;
          color: white;
        }

        .logout-btn:hover { background: rgba(255,255,255,0.4); }

        .menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 28px;
          color: white;
        }

        /* ------------------ MOBILE FIX ------------------ */
        @media(max-width: 768px) {

          .brand-text { font-size: 18px; }

          .nav-links {
            flex-direction: column;
            width: 80%;
            position: absolute;
            top: 63px;
            right: 0;
            padding: 25px;
            gap: 22px;

            /* 🔥 Strong mobile background visible */
            background: rgba(255,110,0,0.96);
            border-left: 2px solid rgba(255,255,255,0.35);
            border-bottom: 2px solid rgba(255,255,255,0.35);
            border-radius: 0 0 0 18px;
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
        }

        .popup {
          background: white;
          width: 260px;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
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
        }

        .yes { background: #ff6a00; color: white; }
        .no { background: #ddd; }

      `}</style>
    </>
  );
}

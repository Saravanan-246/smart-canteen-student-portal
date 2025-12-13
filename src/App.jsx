import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import OrderStatus from "./pages/OrderStatus";
import Profile from "./pages/Profile";

// 🔐 Protected route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

// 👤 Guest-only route
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/menu" replace /> : children;
}

export default function App() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) return null;

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  return (
    <div className="app-shell">
      {!isAuthPage && <Navbar />}

      <div className="app-content">
        <Routes>
          {/* Guest */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

          {/* Protected */}
          <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/order-status" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Default */}
          <Route
            path="/"
            element={user ? <Navigate to="/menu" replace /> : <Navigate to="/login" replace />}
          />
          <Route
            path="*"
            element={user ? <Navigate to="/menu" replace /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

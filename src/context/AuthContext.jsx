import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const KEY = "student_user";

// 🔥 DEV MODE FLAG (TURN FALSE IN PROD)
const DEV_FREE = true;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 LOAD USER ON REFRESH
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      localStorage.removeItem(KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ LOGIN
  const login = (student) => {
    setUser(student);
    localStorage.setItem(KEY, JSON.stringify(student));

    // 🔥 DEV FREE ACCESS
    if (DEV_FREE) {
      localStorage.setItem("isPaid", "true");
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem("isPaid"); // 🔥 clear payment state
    localStorage.removeItem("token");  // 🔥 optional but clean
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

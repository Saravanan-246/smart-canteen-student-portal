import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const KEY = "student_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on refresh
  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // LOGIN (after login or auto-login)
  const login = (student) => {
    localStorage.setItem(KEY, JSON.stringify(student));
    setUser(student);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem("studentToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

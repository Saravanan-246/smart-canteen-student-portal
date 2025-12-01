import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const KEY = "student_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email) => {
    const newUser = { email };
    localStorage.setItem(KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const signup = (userData) => {
    localStorage.setItem(KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

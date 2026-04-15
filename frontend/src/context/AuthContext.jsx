import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await API.get('/auth/status');
      setUser(res.data.user);
      setIsAdmin(res.data.is_admin);
    } catch {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    await API.get('/logout');
    setUser(null);
    setIsAdmin(false);
  };

  const adminLogin = async (username, password) => {
    const res = await API.post('/admin/login', { username, password });
    if (res.data.message) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const adminLogout = async () => {
    await API.get('/admin/logout');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout, adminLogin, adminLogout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

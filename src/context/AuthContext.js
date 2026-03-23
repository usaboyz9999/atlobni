import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

const INITIAL_USERS = [
  { name:'المدير', email:'admin@atlobni.com', password:'admin123', role:'admin', phone:'0500000000' },
];

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [users,     setUsers]     = useState(INITIAL_USERS);
  const [darkMode,  setDarkMode]  = useState(false);
  const [language,  setLanguage]  = useState('ar');
  const [purchases, setPurchases] = useState([]);
  const [wishlist,  setWishlist]  = useState([]);

  function toggleWishlist(item) {
    setWishlist(prev => {
      const exists = prev.find(w => w.id === item.id);
      return exists ? prev.filter(w => w.id !== item.id) : [...prev, { ...item, savedAt: Date.now() }];
    });
  }
  function isWishlisted(itemId) { return wishlist.some(w => w.id === itemId); }

  function login(email, password) {
    const found = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase().trim() &&
      u.password === password
    );
    if (found) { setUser({ ...found }); return { success: true }; }
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }

  function logout() { setUser(null); }

  function register(data) {
    const exists = users.find(u => u.email.toLowerCase() === data.email.toLowerCase().trim());
    if (exists) return { success: false, error: 'هذا البريد الإلكتروني مسجّل مسبقاً' };
    const newUser = {
      ...data,
      email: data.email.trim(),
      avatar: data.name.trim()[0]?.toUpperCase() || '?',
    };
    setUsers(p => [...p, newUser]);
    setUser(newUser);
    return { success: true };
  }

  function updateUser(data) {
    setUser(prev => ({ ...prev, ...data }));
    setUsers(prev => prev.map(u => u.email === user?.email ? { ...u, ...data } : u));
  }

  function addPurchase(order) {
    setPurchases(p => [{
      ...order,
      date: new Date().toLocaleDateString('ar-SA'),
      purchaseId: Date.now(),
    }, ...p]);
  }

  function toggleDark() { setDarkMode(v => !v); }
  function toggleLang() { setLanguage(v => v === 'ar' ? 'en' : 'ar'); }

  return (
    <AuthContext.Provider value={{
      user, darkMode, language, purchases, wishlist,
      login, logout, register, updateUser,
      addPurchase, toggleWishlist, isWishlisted,
      toggleDark, toggleLang,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
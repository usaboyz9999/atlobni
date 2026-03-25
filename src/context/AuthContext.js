import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

// ── توليد كود الإحالة ─────────────────────────────────────────
function generateReferralCode() {
  const digits = '0123456789';
  let code = 'ATLOB';
  for (let i = 0; i < 4; i++) code += digits[Math.floor(Math.random() * digits.length)];
  return code;
}

// نقاط لكل إحالة ناجحة
export const REFERRAL_POINTS = 2;

const INITIAL_USERS = [
  { name:'المدير', email:'admin@atlobni.com', password:'admin123', role:'admin', phone:'0500000000' },
];

// نقطة مقابل كل 100 ريال شراء
export const POINTS_PER_100    = 1;      // نقطة واحدة لكل 100 ريال
// 10000 نقطة = 100 ريال للاستبدال
export const POINTS_TO_SAR     = 0.01;   // قيمة النقطة الواحدة = 0.01 ريال
export const MIN_POINTS_REDEEM = 10000;  // الحد الأدنى للاستبدال

export function AuthProvider({ children }) {
  const [user,        setUser]       = useState(null);
  const [users,       setUsers]      = useState(INITIAL_USERS);
  const [darkMode,    setDarkMode]   = useState(false);
  const [language,    setLanguage]   = useState('ar');
  const [purchases,   setPurchases]  = useState([]);
  const [wishlist,    setWishlist]   = useState([]);
  const [usedCoupons, setUsedCoupons]= useState([]);
  const [wallet,      setWallet]     = useState(0);       // رصيد المحفظة بالريال
  const [points,      setPoints]     = useState(0);       // رصيد النقاط
  const [txHistory,   setTxHistory]  = useState([]);      // تاريخ المعاملات
  const [tickets,     setTickets]    = useState([]);       // تذاكر الدعم
  // نظام الإحالة
  const [referralCode,   setReferralCode]   = useState(null);  // كود إحالتي
  const [customCodeSet,  setCustomCodeSet]  = useState(false); // هل تم تفعيل كود مخصص؟
  const [referredBy,   setReferredBy]   = useState(null);    // من أحالني
  const [usedReferrals,setUsedReferrals]= useState([]);      // أجهزة استُخدم فيها كودي
  const [botMessages,  setBotMessages] = useState([]);       // محادثة البوت

  // ── كوبونات ──────────────────────────────────────────────────
  function useCoupon(code)    { setUsedCoupons(p => [...p, code.toUpperCase()]); }
  function isCouponUsed(code) { return usedCoupons.includes(code?.toUpperCase()); }

  // ── مفضلة ────────────────────────────────────────────────────
  function toggleWishlist(item) {
    setWishlist(prev => {
      const exists = prev.find(w => w.id === item.id);
      return exists ? prev.filter(w => w.id !== item.id) : [...prev, { ...item, savedAt: Date.now() }];
    });
  }
  function isWishlisted(itemId) { return wishlist.some(w => w.id === itemId); }

  // ── محفظة ────────────────────────────────────────────────────
  function addWalletBalance(amount, note = 'شحن رصيد') {
    setWallet(p => p + amount);
    addTx({ type: 'credit', amount, note, icon: '💳' });
  }
  function deductWallet(amount, note = 'شراء') {
    setWallet(p => Math.max(0, p - amount));
    addTx({ type: 'debit', amount, note, icon: '🛒' });
    return true;
  }

  // ── نقاط ─────────────────────────────────────────────────────
  function earnPoints(paidAmount) {
    const earned = Math.floor(paidAmount / 100) * POINTS_PER_100;
    if (earned > 0) {
      setPoints(p => p + earned);
      addTx({ type: 'points_credit', amount: earned, note: `نقاط على شراء ${paidAmount} ر.س`, icon: '⭐' });
    }
    return earned;
  }
  function redeemPoints(pointsToUse) {
    if (pointsToUse < MIN_POINTS_REDEEM) return false;
    const sarValue = pointsToUse * POINTS_TO_SAR;
    setPoints(p => p - pointsToUse);
    addTx({ type: 'points_debit', amount: pointsToUse, note: `استبدال ${pointsToUse} نقطة بـ ${sarValue} ر.س`, icon: '🎁' });
    return sarValue;
  }

  // ── تاريخ معاملات ─────────────────────────────────────────────
  function addTx(tx) {
    setTxHistory(p => [{ ...tx, date: new Date().toLocaleDateString('ar-SA'), id: Date.now() }, ...p]);
  }

  // ── مصادقة ───────────────────────────────────────────────────
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
    const myReferralCode = generateReferralCode();
    const newUser = { ...data, email: data.email.trim(), avatar: data.name.trim()[0]?.toUpperCase() || '?', referralCode: myReferralCode };
    setUsers(p => [...p, newUser]);
    setUser(newUser);
    setReferralCode(myReferralCode);
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

  // ── محادثة البوت ─────────────────────────────────────────────
  function addBotMessage(msg)  { setBotMessages(p => [...p, msg]); }
  function clearBotMessages()  { setBotMessages([]); }

  // ── الإحالة ──────────────────────────────────────────────────
  function initReferralCode() {
    if (referralCode) return referralCode; // لا يمكن تغييره
    const code = generateReferralCode();
    setReferralCode(code);
    return code;
  }

  // ── كود مخصص: يسمح باستبدال الكود العشوائي، لكن لا يمكن تغييره بعد التفعيل ──
  function setCustomReferralCode(code) {
    if (customCodeSet) return { success: false, error: 'لا يمكن تغيير الكود بعد تفعيل الكود المخصص' };
    const upper = code.toUpperCase().trim();
    if (!/^[A-Z]{4}[0-9]{4}$/.test(upper)) {
      return { success: false, error: 'الكود يجب أن يتكون من 4 حروف إنجليزية ثم 4 أرقام\nمثال: SALE1234' };
    }
    const taken = users.find(u => u.referralCode === upper);
    if (taken) return { success: false, error: 'هذا الكود مستخدم من قِبل شخص آخر، جرّب كوداً مختلفاً' };
    setReferralCode(upper);
    setCustomCodeSet(true);
    setUsers(prev => prev.map(u => u.email === user?.email ? { ...u, referralCode: upper } : u));
    return { success: true, code: upper };
  }

  function validateReferralCode(code, deviceId) {
    if (!code) return { valid: false, error: 'الكود فارغ' };
    const upperCode = code.toUpperCase().trim();
    // تحقق أن الكود موجود في قاعدة المستخدمين
    const owner = users.find(u => u.referralCode === upperCode);
    if (!owner) return { valid: false, error: 'كود الإحالة غير صحيح' };
    if (owner.email === user?.email) return { valid: false, error: 'لا يمكن استخدام كودك الخاص' };
    // تحقق من الجهاز (لا تكرار لنفس الجهاز)
    if (usedReferrals.includes(deviceId)) return { valid: false, error: 'تم استخدام هذا الجهاز مسبقاً' };
    return { valid: true, owner };
  }

  function applyReferral(code, deviceId) {
    const result = validateReferralCode(code, deviceId);
    if (!result.valid) return { success: false, error: result.error };
    // أضف نقاط للمُحيل
    setPoints(p => p + REFERRAL_POINTS);
    addTx({ type: 'points_credit', amount: REFERRAL_POINTS, note: `إحالة ناجحة — كود: ${code.toUpperCase()}`, icon: '🎁' });
    // سجّل الجهاز المستخدم
    setUsedReferrals(p => [...p, deviceId]);
    setReferredBy(code.toUpperCase());
    return { success: true };
  }

  // ── تذاكر الدعم ──────────────────────────────────────────────
  function addTicket(ticket)       { setTickets(p => [ticket, ...p]); }
  function updateTicket(id, data)  { setTickets(p => p.map(t => t.id === id ? { ...t, ...data } : t)); }
  function deleteTicket(id)        { setTickets(p => p.filter(t => t.id !== id)); }

  function toggleDark() { setDarkMode(v => !v); }
  function toggleLang() { setLanguage(v => v === 'ar' ? 'en' : 'ar'); }

  return (
    <AuthContext.Provider value={{
      user, darkMode, language,
      purchases, wishlist, usedCoupons,
      wallet, points, txHistory,
      login, logout, register, updateUser,
      addPurchase, toggleWishlist, isWishlisted,
      useCoupon, isCouponUsed,
      addWalletBalance, deductWallet,
      earnPoints, redeemPoints,
      tickets, addTicket, updateTicket, deleteTicket,
      botMessages, addBotMessage, clearBotMessages,
      referralCode, customCodeSet, referredBy, usedReferrals, initReferralCode, setCustomReferralCode, validateReferralCode, applyReferral,
      toggleDark, toggleLang,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
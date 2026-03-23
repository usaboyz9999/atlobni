import React, { useState, useEffect } from 'react';
import {
  View, Text, StatusBar, BackHandler, Platform,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { LangProvider } from './src/context/LangContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AppAlertProvider, useAppAlert } from './src/components/AppAlert';

// ── Screens ──
import SplashScreen   from './src/screens/SplashScreen';
import HomeScreen     from './src/screens/HomeScreen';
import DetailScreen   from './src/screens/DetailScreen';
import ProgramsScreen from './src/screens/ProgramsScreen';
import OrdersScreen   from './src/screens/OrdersScreen';
import StoreScreen    from './src/screens/StoreScreen';
import SearchScreen   from './src/screens/SearchScreen';
import CartScreen     from './src/screens/CartScreen';
import ProfileScreen  from './src/screens/ProfileScreen';

// ── Components ──
import BottomNav     from './src/components/BottomNav';
import NewOrderModal from './src/components/NewOrderModal';
import CartBar       from './src/components/CartBar';

export default function App() {
  return (
    <SafeAreaProvider>
      <LangProvider>
        <AuthProvider>
          <ThemeProvider>
            <AppAlertProvider>
              <AppInner />
            </AppAlertProvider>
          </ThemeProvider>
        </AuthProvider>
      </LangProvider>
    </SafeAreaProvider>
  );
}

function AppInner() {
  const { user, addPurchase } = useAuth();
  const theme     = useTheme();
  const insets    = useSafeAreaInsets();
  const showAlert = useAppAlert();

  // ── navigation history stack ──────────────────────────────────
  const [history,       setHistory]       = useState(['home']);
  const [screen,        setScreen]        = useState('home');
  const [selectedCat,   setSelCat]        = useState(null);
  const [cart,          setCart]          = useState([]);
  const [showNewOrder,  setShowNewOrder]  = useState(false);
  const [toast,         setToast]         = useState('');
  const [toastV,        setToastV]        = useState(false);
  const [showCartBar,   setShowCartBar]   = useState(false);
  const [pendingProduct,setPendingProduct]= useState(null);
  const [orders,        setOrders]        = useState([
    { title:'إصلاح كهرباء المبنى الثالث', category:'الكهرباء', desc:'انقطاع تيار في الطابق الثاني', priority:'عاجل', assign:'أحمد علي',     status:'inprogress', date:'١٤٤٦/٠٩/٠١' },
    { title:'تعقيم خزانات المياه',         category:'السباكة',  desc:'الموعد الدوري نصف السنوي',   priority:'عادي', assign:'فريق السباكة', status:'pending',    date:'١٤٤٦/٠٩/٠٣' },
    { title:'تغيير فلاتر التكييف',         category:'التكييف',  desc:'تغيير فلاتر G4 الأدوار 1-5', priority:'عالي', assign:'محمد حسن',     status:'done',       date:'١٤٤٦/٠٨/٢٨' },
  ]);

  // ── navigate function with history ───────────────────────────
  function navigate(id) {
    setScreen(id);
    setHistory(prev => {
      if (prev[prev.length - 1] === id) return prev;
      return [...prev, id];
    });
  }

  function goBack() {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHist = prev.slice(0, -1);
      setScreen(newHist[newHist.length - 1]);
      return newHist;
    });
  }

  // ─── زر الرجوع في الهاتف ────────────────────────────────────
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showNewOrder) { setShowNewOrder(false); return true; }
      if (screen === 'home') {
        showAlert('الخروج من التطبيق', 'هل أنت متأكد من الخروج؟', [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'خروج', style: 'destructive', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      // رجوع للصفحة السابقة في التاريخ
      goBack();
      return true;
    });
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, showNewOrder, history]);

  if (screen === 'splash') return null;

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function showToast(msg) {
    setToast(msg); setToastV(true);
    setTimeout(() => setToastV(false), 2200);
  }

  function goDetail(catId) {
    setSelCat(catId);
    navigate('detail');
  }

  function handleNav(id) {
    if (id === 'neworder') { setShowNewOrder(true); return; }
    if (id !== 'store' && id !== 'cart') setShowCartBar(false);
    if (id === 'store' && cartCount > 0) setShowCartBar(true);
    // Reset history when switching main tabs
    setHistory([id]);
    setScreen(id);
  }

  function addToCart(item) {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      return ex
        ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }];
    });
    setShowCartBar(true);
    showToast('✅ تمت الإضافة للسلة');
  }

  function changeQty(idx, delta) {
    setCart(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], qty: next[idx].qty + delta };
      if (next[idx].qty <= 0) next.splice(idx, 1);
      if (next.length === 0) setShowCartBar(false);
      return next;
    });
  }

  function goToCart() {
    setShowCartBar(false);
    navigate('cart');
  }

  function handleOrder() {
    cart.forEach(item => addPurchase(item));
    setCart([]); setShowCartBar(false);
    showToast('🎉 تم إرسال الطلب بنجاح!');
    setHistory(['home']); setScreen('home');
  }

  function handleNewOrder(order) {
    setOrders(prev => [{ ...order, id: Date.now() }, ...prev]);
    showToast('✅ تم إنشاء الطلب');
    setHistory(['orders']); setScreen('orders');
  }

  const activeTab = ['home','programs','store','profile'].includes(screen)
    ? screen
    : history.filter(h => ['home','programs','store','profile'].includes(h)).pop() || 'home';

  // ─── safe area ───────────────────────────────────────────────
  const topInset    = insets.top    || 0;
  const bottomInset = insets.bottom || 0;

  return (
    <View style={{ flex:1, backgroundColor: theme.bg }}>
      <ExpoStatusBar style="light" backgroundColor={theme.header} translucent={false} />

      {/* Status bar spacer — prevents content going under status bar */}
      <View style={{ height: topInset, backgroundColor: theme.header }} />

      {/* Main content */}
      <View style={{ flex:1, backgroundColor: theme.bg }}>

        {/* CartBar — positioned below status bar spacer */}
        <CartBar cart={cart} visible={showCartBar && screen === 'store'} onPress={goToCart} />

        {screen === 'home'     && <HomeScreen     onSelectCategory={goDetail} onGoStore={() => { navigate('store'); if (cartCount > 0) setShowCartBar(true); }} onGoProduct={item => { setPendingProduct(item); navigate('store'); }} onLogout={() => {}} onProfile={() => navigate('profile')} />}
        {screen === 'detail'   && selectedCat && <DetailScreen catId={selectedCat} onBack={goBack} />}
        {screen === 'programs' && <ProgramsScreen />}
        {screen === 'orders'   && <OrdersScreen orders={orders} onBack={goBack} />}
        {screen === 'store'    && <StoreScreen onAddToCart={addToCart} initialProduct={pendingProduct} onClearInitialProduct={() => setPendingProduct(null)} />}
        {screen === 'search'   && <SearchScreen onSelectCategory={goDetail} />}
        {screen === 'cart'     && <CartScreen cart={cart} onChangeQty={changeQty} onOrder={handleOrder} />}
        {screen === 'profile'  && <ProfileScreen cartCount={cartCount} onGoOrders={() => navigate('orders')} onGoProduct={item => { setPendingProduct(item); navigate('store'); }} />}

      </View>

      {/* Bottom Nav + navigation bar safe area */}
      <View style={{ backgroundColor: theme.navBg, borderTopWidth:1, borderTopColor: theme.border }}>
        <BottomNav active={activeTab} onPress={handleNav} cartCount={cartCount} />
        {bottomInset > 0 && <View style={{ height: bottomInset, backgroundColor: theme.navBg }} />}
      </View>

      <NewOrderModal visible={showNewOrder} onClose={() => setShowNewOrder(false)} onSubmit={handleNewOrder} />

      {/* Toast */}
      {toastV && (
        <View pointerEvents="none" style={{
          position:'absolute', bottom: bottomInset + 90, alignSelf:'center',
          backgroundColor:'#0A7A3C', paddingHorizontal:20, paddingVertical:10,
          borderRadius:22, zIndex:99, elevation:99,
        }}>
          <Text style={{ color:'#fff', fontSize:13, fontWeight:'700' }}>{toast}</Text>
        </View>
      )}
    </View>
  );
}
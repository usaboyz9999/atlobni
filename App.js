import React, { useState, useEffect } from 'react';
import {
  View, Text, StatusBar, BackHandler, Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { LangProvider } from './src/context/LangContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AppAlertProvider, useAppAlert } from './src/components/AppAlert';

// ── Screens ──
import SplashScreen   from './src/screens/SplashScreen';
import AuthScreen     from './src/screens/AuthScreen';
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
  const theme   = useTheme();
  const insets  = useSafeAreaInsets();
  const showAlert = useAppAlert();

  const [splash,        setSplash]        = useState(true);
  const [screen,        setScreen]        = useState('home');
  const [prevScreen,    setPrev]          = useState('home');
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

  // ─── زر الرجوع ───────────────────────────────────────────────
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
      // رجوع للشاشة السابقة
      const backMap = {
        detail: prevScreen || 'home',
        orders: 'home', store: 'home', programs: 'home',
        profile: 'home', cart: 'store', search: 'home',
      };
      const dest = backMap[screen] || 'home';
      setScreen(dest);
      return true;
    });
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, prevScreen, showNewOrder]);

  if (splash) return <SplashScreen onDone={() => setSplash(false)} />;

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function showToast(msg) {
    setToast(msg); setToastV(true);
    setTimeout(() => setToastV(false), 2200);
  }

  function goDetail(catId) { setSelCat(catId); setPrev(screen); setScreen('detail'); }
  function goBack()         { setScreen(prevScreen); }

  function handleNav(id) {
    if (id === 'neworder') { setShowNewOrder(true); return; }
    if (id !== 'detail') setPrev(id);
    if (id !== 'store' && id !== 'cart') setShowCartBar(false);
    if (id === 'store' && cartCount > 0) setShowCartBar(true);
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

  function goToCart() { setShowCartBar(false); setScreen('cart'); setPrev('store'); }

  function handleOrder() {
    cart.forEach(item => addPurchase(item));
    setCart([]); setShowCartBar(false);
    showToast('🎉 تم إرسال الطلب بنجاح!');
    setScreen('home');
  }

  function handleNewOrder(order) {
    setOrders(prev => [{ ...order, id: Date.now() }, ...prev]);
    showToast('✅ تم إنشاء الطلب');
    setScreen('orders'); setPrev('orders');
  }

  const activeTab = ['home','programs','store','profile'].includes(screen) ? screen : prevScreen;

  // ─── safe area ───────────────────────────────────────────────
  const topPad    = insets.top;
  const bottomPad = insets.bottom;

  return (
    <View style={{ flex:1, backgroundColor: theme.bg }}>
      <ExpoStatusBar style={theme.isDark ? 'light' : 'light'} backgroundColor={theme.header} />

      {/* Content area with safe top padding */}
      <View style={{ flex:1, paddingTop: topPad, backgroundColor: theme.bg }}>

        {/* CartBar */}
        <CartBar cart={cart} visible={showCartBar && screen === 'store'} onPress={goToCart} />

        {screen === 'home'     && <HomeScreen     onSelectCategory={goDetail} onGoStore={() => { setPrev('home'); setScreen('store'); if (cartCount > 0) setShowCartBar(true); }} onGoProduct={item => { setPendingProduct(item); setPrev('home'); setScreen('store'); }} onLogout={() => {}} onProfile={() => { setPrev(screen); setScreen('profile'); }} />}
        {screen === 'detail'   && selectedCat && <DetailScreen catId={selectedCat} onBack={goBack} />}
        {screen === 'programs' && <ProgramsScreen />}
        {screen === 'orders'   && <OrdersScreen   orders={orders} />}
        {screen === 'store'    && <StoreScreen    onAddToCart={addToCart} initialProduct={pendingProduct} onClearInitialProduct={() => setPendingProduct(null)} />}
        {screen === 'search'   && <SearchScreen   onSelectCategory={goDetail} />}
        {screen === 'cart'     && <CartScreen     cart={cart} onChangeQty={changeQty} onOrder={handleOrder} />}
        {screen === 'profile'  && <ProfileScreen  cartCount={cartCount} onGoOrders={() => { setScreen('orders'); setPrev('orders'); }} onGoProduct={item => { setPendingProduct(item); setPrev('profile'); setScreen('store'); }} />}

      </View>

      {/* BottomNav with safe bottom */}
      <View style={{ backgroundColor: theme.navBg, paddingBottom: bottomPad, borderTopWidth:1, borderTopColor: theme.border }}>
        <BottomNav active={activeTab} onPress={handleNav} cartCount={cartCount} />
      </View>

      <NewOrderModal visible={showNewOrder} onClose={() => setShowNewOrder(false)} onSubmit={handleNewOrder} />

      {/* Toast */}
      {toastV && (
        <View pointerEvents="none" style={{
          position:'absolute', bottom: bottomPad + 80, alignSelf:'center',
          backgroundColor:'#0A7A3C', paddingHorizontal:20, paddingVertical:10,
          borderRadius:22, zIndex:99, elevation:99,
        }}>
          <Text style={{ color:'#fff', fontSize:13, fontWeight:'700' }}>{toast}</Text>
        </View>
      )}
    </View>
  );
}
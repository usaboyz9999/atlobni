import React, { useState, useEffect } from 'react';
import {
  View, Text, StatusBar, BackHandler, Platform,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// ── Contexts ──
import { LangProvider } from './src/context/LangContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AppAlertProvider, useAppAlert } from './src/components/AppAlert';
// ✅ إضافة استيراد PaymentProvider الجديد
import { PaymentProvider } from './src/context/PaymentContext';

// ── Screens ──
import SplashScreenComponent from './src/screens/SplashScreen'; // ✅ تم تغيير الاسم لتجنب التداخل
import HomeScreen     from './src/screens/HomeScreen';
import DetailScreen   from './src/screens/DetailScreen';
import ProgramsScreen from './src/screens/ProgramsScreen';
import OrdersScreen   from './src/screens/OrdersScreen';
import StoreScreen    from './src/screens/StoreScreen';
import SearchScreen   from './src/screens/SearchScreen';
import CartScreen     from './src/screens/CartScreen';
import ProfileScreen  from './src/screens/ProfileScreen';
import OrderSuccessScreen    from './src/screens/OrderSuccessScreen';
import PurchaseDetailScreen from './src/screens/PurchaseDetailScreen';

// ── Components ──
import BottomNav     from './src/components/BottomNav';
import NewOrderModal from './src/components/NewOrderModal';
import CartBar       from './src/components/CartBar';

export default function App() {
  // ✅ حالة التحكم في شاشة الاقلاع
  const [isLoading, setIsLoading] = useState(true);

  // إذا كانت شاشة الاقلاع نشطة، اعرضها فقط
  if (isLoading) {
    return <SplashScreenComponent onFinish={() => setIsLoading(false)} />;
  }

  return (
    <SafeAreaProvider>
      <LangProvider>
        <AuthProvider>
          <ThemeProvider>
            <AppAlertProvider>
              {/* ✅ تغليف التطبيق بـ PaymentProvider هنا ليتمكن من الوصول لبيانات المحفظة */}
              <PaymentProvider>
                <AppInner />
              </PaymentProvider>
            </AppAlertProvider>
          </ThemeProvider>
        </AuthProvider>
      </LangProvider>
    </SafeAreaProvider>
  );
}

function AppInner() {
  const { user, addPurchase, useCoupon, isCouponUsed, deductWallet, redeemPoints, earnPoints } = useAuth();
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
  const [lastOrder,       setLastOrder]       = useState(null);
  const [profileInitialTab, setProfileInitialTab] = useState(null);
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
      if (prev.length <= 1) {
        // Already at root - show exit dialog
        return prev;
      }
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

  function handleOrder(orderData) {
    const { appliedCoupon, couponDiscount, walletDiscount, payMethod, pointsUsed } = orderData;
    const rawTotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const paidTotal  = Math.max(0, rawTotal - (couponDiscount || 0));
    const ratio      = rawTotal > 0 ? paidTotal / rawTotal : 1;
    const orderId    = String(Date.now()).slice(-6);
    const savedItems = [];

    cart.forEach(item => {
      const itemRaw  = item.price * item.qty;
      const itemPaid = Math.round(itemRaw * ratio);
      const purchase = {
        ...item,
        price:          itemPaid,
        originalPrice:  itemRaw,
        couponCode:     appliedCoupon?.code || null,
        couponDiscount: Math.round(itemRaw - itemPaid),
        payMethod,
        orderId,
      };
      addPurchase(purchase);
      savedItems.push(purchase);
    });

    if (appliedCoupon?.code) useCoupon(appliedCoupon.code);
    if (payMethod === 'wallet' && walletDiscount > 0) deductWallet(walletDiscount, 'شراء من السلة');
    if (payMethod === 'points' && pointsUsed > 0)    redeemPoints(pointsUsed);
    // نكسب النقاط حتى لو دفعنا بطرق أخرى (تابي، فيزا، إلخ)
    if (payMethod !== 'cash') earnPoints(rawTotal);

    setCart([]); setShowCartBar(false);

    // عرض شاشة نجاح الطلب
    setLastOrder({ payMethod, total: paidTotal, couponDiscount: couponDiscount || 0,
      couponCode: appliedCoupon?.code || null, orderId, items: savedItems });
    setHistory(['order_success']); setScreen('order_success');
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
        {screen === 'cart'          && <CartScreen cart={cart} onChangeQty={changeQty} onOrder={handleOrder} />}
        {screen === 'order_success' && lastOrder && <OrderSuccessScreen order={lastOrder} onContinue={() => { setHistory(['store']); setScreen('store'); setLastOrder(null); }} onViewDetails={() => { setHistory(['order_success','purchase_detail']); setScreen('purchase_detail'); }} />}
        {screen === 'purchase_detail' && lastOrder?.items?.[0] && <PurchaseDetailScreen purchase={lastOrder.items[0]} onBack={() => { setProfileInitialTab('purchases'); setHistory(['profile']); setScreen('profile'); }} />}
        {screen === 'profile'  && <ProfileScreen cartCount={cartCount} onGoOrders={() => navigate('orders')} onGoProduct={item => { setPendingProduct(item); navigate('store'); }} initialTab={profileInitialTab} onTabSet={() => setProfileInitialTab(null)} onNavigate={id => { if(id==='store'){navigate('store');}else if(id==='programs'){navigate('programs');}else if(id==='orders'){navigate('orders');}else if(id==='profile'){navigate('profile');}else{navigate('home');} }} />}

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
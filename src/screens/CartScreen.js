import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ImageBackground, Image, TextInput,
} from 'react-native';
import s from '../styles';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../components/alertBridge';
import { findCoupon, calcDiscount } from '../data/couponsData';
import { MIN_POINTS_REDEEM, POINTS_TO_SAR } from '../context/AuthContext';

export default function CartScreen({ cart, onChangeQty, onOrder }) {
  const theme = useTheme();
  const { isCouponUsed, user, wallet, points } = useAuth();

  const total    = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  // ── الكوبون ──────────────────────────────────────────────────
  const [couponCode,    setCouponCode]    = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError,   setCouponError]   = useState('');

  // ── طريقة الدفع ─────────────────────────────────────────────
  // payMethod: 'cash' | 'wallet' | 'points'
  const [payMethod, setPayMethod] = useState('cash');

  // ── حسابات الخصم ────────────────────────────────────────────
  const couponDiscount = appliedCoupon ? calcDiscount(appliedCoupon, total) : 0;
  const afterCoupon    = Math.max(0, total - couponDiscount);

  // خصم المحفظة
  const walletDiscount = payMethod === 'wallet'
    ? Math.min(wallet, afterCoupon)
    : 0;

  // خصم النقاط
  const pointsValue    = points >= MIN_POINTS_REDEEM ? points * POINTS_TO_SAR : 0;
  const pointsDiscount = payMethod === 'points'
    ? Math.min(pointsValue, afterCoupon)
    : 0;

  const totalDiscount  = couponDiscount + walletDiscount + pointsDiscount;
  const finalTotal     = Math.max(0, total - totalDiscount);

  function removeItem(idx) { onChangeQty(idx, -999); }

  function applyCoupon() {
    const code = couponCode.trim();
    if (!code) { setCouponError('أدخل كود الخصم'); return; }
    const coupon = findCoupon(code);
    if (!coupon)           { setCouponError('كود الخصم غير صحيح'); setAppliedCoupon(null); return; }
    if (isCouponUsed(code)){ setCouponError('تم استخدام هذا الكوبون مسبقاً'); setAppliedCoupon(null); return; }
    if (total < coupon.minOrder){ setCouponError(`الحد الأدنى ${coupon.minOrder} ر.س`); setAppliedCoupon(null); return; }
    setAppliedCoupon(coupon); setCouponError('');
    showAlert('🎉 تم تطبيق الكوبون!', `${coupon.label}\nوفّرت ${calcDiscount(coupon, total)} ر.س`);
  }

  function removeCoupon() { setAppliedCoupon(null); setCouponCode(''); setCouponError(''); }

  function handleOrder() {
    if (!user) {
      showAlert('🔐 تسجيل الدخول مطلوب', 'يجب تسجيل الدخول أولاً لتأكيد الطلب', [{ text: 'حسناً', style: 'cancel' }]);
      return;
    }
    if (total <= 0) {
      showAlert('⚠️ السلة فارغة', 'لا يمكن تأكيد طلب بقيمة صفر ريال');
      return;
    }
    if (payMethod === 'wallet' && wallet < finalTotal) {
      showAlert('⚠️ لا يوجد رصيد كافٍ', 'رصيد محفظتك ' + wallet.toFixed(2) + ' ر.س غير كافٍ\n\nيرجى شحن المحفظة من صفحة حسابي.');
      return;
    }
    if (payMethod === 'points' && points < MIN_POINTS_REDEEM) {
      showAlert('⚠️ نقاط غير كافية', `تحتاج على الأقل ${MIN_POINTS_REDEEM} نقطة. لديك ${points} نقطة فقط.`);
      return;
    }
    onOrder({ appliedCoupon, couponDiscount, walletDiscount, pointsDiscount, totalDiscount, finalTotal, payMethod, pointsUsed: payMethod === 'points' ? points : 0 });
  }

  const PAY_METHODS = [
    { id:'cash',   label:'الدفع عند الاستلام', icon:'💵', sub: 'دفع نقدي عند وصول الطلب', available: true },
    { id:'wallet', label:'المحفظة', icon:'💳', sub: wallet > 0 ? `الرصيد: ${wallet.toFixed(2)} ر.س` : 'رصيد فارغ', available: true },
    { id:'points', label:'النقاط',               icon:'⭐', sub: points >= MIN_POINTS_REDEEM ? `${points} نقطة = ${(points * POINTS_TO_SAR).toFixed(2)} ر.س` : `تحتاج ${MIN_POINTS_REDEEM} نقطة (لديك ${points})`, available: points >= MIN_POINTS_REDEEM },
  ];

  return (
    <View style={[s.screen, { backgroundColor: theme.bg }]}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=700&q=80' }}
        style={[s.detailHero, { height: 110 }]}
      >
        <View style={[s.heroOverlay, { backgroundColor: 'rgba(10,36,99,0.35)' }]} />
        <View style={s.detailContent}>
          <Text style={s.detailTitle}>سلة التسوق</Text>
          <Text style={s.detailSub}>{totalQty} منتجات</Text>
        </View>
      </ImageBackground>

      {cart.length === 0 ? (
        <View style={s.cartEmpty}>
          <Text style={{ fontSize: 48 }}>🛒</Text>
          <Text style={s.cartEmptyTxt}>السلة فارغة{'\n'}أضف قطع الغيار من المتجر</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

          {/* منتجات السلة */}
          {cart.map((item, idx) => (
            <View key={idx} style={[s.cartItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Image source={{ uri: item.img }} style={s.cartThumb} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <TouchableOpacity onPress={() => removeItem(idx)} style={{
                    width: 24, height: 24, borderRadius: 12,
                    backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: '#FFD0D0',
                  }}>
                    <Text style={{ color: '#D32F2F', fontSize: 12, fontWeight: '900', lineHeight: 14 }}>✕</Text>
                  </TouchableOpacity>
                  <Text style={[s.mcardName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                </View>
                <View style={s.qtyRow}>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => onChangeQty(idx, -1)}>
                    <Text style={s.qtyBtnTxt}>−</Text>
                  </TouchableOpacity>
                  <Text style={s.qtyVal}>{item.qty}</Text>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => onChangeQty(idx, 1)}>
                    <Text style={s.qtyBtnTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={s.cartPrice}>{item.price * item.qty} ر.س</Text>
            </View>
          ))}

          {/* ── طريقة الدفع ── */}
          <View style={{ margin:14, backgroundColor: theme.card, borderRadius:16, padding:14, borderWidth:1, borderColor: theme.border }}>
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'flex-end', gap:8, marginBottom:12 }}>
              <Text style={{ fontSize:14, fontWeight:'800', color: theme.text }}>طريقة الدفع</Text>
              <Text style={{ fontSize:20 }}>💳</Text>
            </View>
            {PAY_METHODS.map(m => (
              <TouchableOpacity key={m.id} onPress={() => {
                if (m.id === 'wallet' && wallet < (total - couponDiscount)) {
                  showAlert('⚠️ لا يوجد رصيد كافٍ', 'رصيد محفظتك ' + wallet.toFixed(2) + ' ر.س\nالمطلوب: ' + (total - couponDiscount).toFixed(2) + ' ر.س\n\nيرجى شحن المحفظة من صفحة حسابي.');
                  return;
                }
                if (m.available) setPayMethod(m.id);
              }}
                activeOpacity={m.available ? 0.85 : 1}
                style={{
                  flexDirection:'row', alignItems:'center', gap:10, marginBottom:8,
                  padding:12, borderRadius:12,
                  backgroundColor: payMethod === m.id ? '#0A2463' : theme.bg,
                  borderWidth:1.5, borderColor: payMethod === m.id ? '#0A2463' : (m.available ? theme.border : '#EEE'),
                  opacity: m.available ? 1 : 0.5,
                }}>
                <View style={{
                  width:20, height:20, borderRadius:10, borderWidth:2,
                  borderColor: payMethod === m.id ? '#fff' : theme.border,
                  backgroundColor: payMethod === m.id ? '#fff' : 'transparent',
                  alignItems:'center', justifyContent:'center',
                }}>
                  {payMethod === m.id && <View style={{ width:10, height:10, borderRadius:5, backgroundColor:'#0A2463' }} />}
                </View>
                <View style={{ flex:1 }}>
                  <Text style={{ fontSize:13, fontWeight:'700', color: payMethod === m.id ? '#fff' : theme.text, textAlign:'right' }}>
                    {m.label}
                  </Text>
                  <Text style={{ fontSize:10, color: payMethod === m.id ? 'rgba(255,255,255,0.7)' : theme.subText, textAlign:'right' }}>
                    {m.sub}
                  </Text>
                </View>
                <Text style={{ fontSize:22 }}>{m.icon}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── كوبون الخصم ── */}
          <View style={{ marginHorizontal:14, marginBottom:14, backgroundColor: theme.card, borderRadius:16, padding:14, borderWidth:1, borderColor: theme.border }}>
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'flex-end', gap:8, marginBottom:12 }}>
              <Text style={{ fontSize:14, fontWeight:'800', color: theme.text }}>كوبون الخصم</Text>
              <Text style={{ fontSize:20 }}>🏷️</Text>
            </View>
            {appliedCoupon ? (
              <View style={{ backgroundColor: appliedCoupon.bg, borderRadius:12, padding:12,
                flexDirection:'row', alignItems:'center', justifyContent:'space-between',
                borderWidth:1.5, borderColor: appliedCoupon.color + '66' }}>
                <TouchableOpacity onPress={removeCoupon} style={{
                  backgroundColor:'#FFF0F0', borderRadius:8, paddingHorizontal:10, paddingVertical:5,
                  borderWidth:1, borderColor:'#FFD0D0',
                }}>
                  <Text style={{ color:'#D32F2F', fontSize:11, fontWeight:'700' }}>إزالة</Text>
                </TouchableOpacity>
                <View style={{ alignItems:'flex-end' }}>
                  <Text style={{ fontSize:13, fontWeight:'800', color: appliedCoupon.color }}>
                    {appliedCoupon.icon} {appliedCoupon.label}
                  </Text>
                  <Text style={{ fontSize:11, color: appliedCoupon.color, marginTop:2 }}>وفّرت {couponDiscount} ر.س ✓</Text>
                </View>
              </View>
            ) : (
              <View>
                <View style={{ flexDirection:'row', gap:8 }}>
                  <TouchableOpacity onPress={applyCoupon} style={{ backgroundColor:'#0A2463', borderRadius:10, paddingHorizontal:16, paddingVertical:11 }}>
                    <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>تطبيق</Text>
                  </TouchableOpacity>
                  <TextInput
                    value={couponCode}
                    onChangeText={v => { setCouponCode(v.toUpperCase()); setCouponError(''); }}
                    placeholder="كود الخصم"
                    placeholderTextColor={theme.subText}
                    autoCapitalize="characters" autoCorrect={false}
                    style={{
                      flex:1, backgroundColor: theme.bg, borderRadius:10,
                      paddingHorizontal:12, paddingVertical:10,
                      fontSize:13, color: theme.text, textAlign:'right',
                      borderWidth:1.5, borderColor: couponError ? '#E53935' : theme.border, fontWeight:'700',
                    }}
                    underlineColorAndroid="transparent"
                  />
                </View>
                {couponError ? <Text style={{ color:'#E53935', fontSize:11, textAlign:'right', marginTop:4 }}>⚠️ {couponError}</Text> : null}
              </View>
            )}
          </View>

        </ScrollView>
      )}

      {/* ── Footer ── */}
      <View style={[s.cartFooter, { backgroundColor: theme.card, borderTopColor: theme.border }]}>

        {/* ملخص التسعير */}
        <View style={{ marginBottom:10 }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:3 }}>
            <Text style={{ fontSize:12, color: theme.subText }}>المجموع</Text>
            <Text style={{ fontSize:12, color: theme.subText }}>{total} ر.س</Text>
          </View>
          {couponDiscount > 0 && (
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:3 }}>
              <Text style={{ fontSize:12, color:'#0A7A3C' }}>خصم الكوبون 🏷️</Text>
              <Text style={{ fontSize:12, color:'#0A7A3C' }}>- {couponDiscount} ر.س</Text>
            </View>
          )}
          <View style={{ height:1, backgroundColor: theme.border, marginVertical:6 }} />
          <View style={s.cartTotal}>
            <Text style={s.totalLbl}>الإجمالي</Text>
            <Text style={[s.totalVal, { color: couponDiscount > 0 ? '#0A7A3C' : theme.text }]}>
              {(total - couponDiscount).toFixed(2)} ر.س
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[s.orderBtn, cart.length === 0 && { opacity: 0.5 }]}
          onPress={handleOrder}
          disabled={cart.length === 0}
          activeOpacity={0.85}
        >
          <Text style={s.orderBtnTxt}>
            {payMethod === 'wallet' ? '💳 ' : payMethod === 'points' ? '⭐ ' : '💵 '}
            تأكيد الطلب
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
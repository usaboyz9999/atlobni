import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ImageBackground, Image, Modal, TextInput,
} from 'react-native';
import s from '../styles';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { usePayment, PAYMENT_METHODS } from '../context/PaymentContext';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { showAlert } from '../components/alertBridge';
import { findCoupon, calcDiscount } from '../data/couponsData';
import { MIN_POINTS_REDEEM, POINTS_TO_SAR } from '../context/AuthContext';

export default function CartScreen({ cart, onChangeQty, onOrder, onNavigate }) {
  const theme = useTheme();
  const { isCouponUsed, user, wallet, points } = useAuth();
  const { 
    preferredMethodId, 
    setPreferredMethod, 
    cardDetails,
    bankDetails,
  } = usePayment();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payMethod, setPayMethod] = useState(preferredMethodId);
  const [warningVisible, setWarningVisible] = useState(false);
  
  const total    = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    setPayMethod(preferredMethodId);
    setWarningVisible(false);
  }, [preferredMethodId, showPaymentModal]);

  const couponDiscount = appliedCoupon ? calcDiscount(appliedCoupon, total) : 0;
  const afterCoupon    = Math.max(0, total - couponDiscount);
  const walletDiscount = payMethod === 'wallet' ? Math.min(wallet, afterCoupon) : 0;
  const pointsValue    = points >= MIN_POINTS_REDEEM ? points * POINTS_TO_SAR : 0;
  const pointsDiscount = payMethod === 'points' ? Math.min(pointsValue, afterCoupon) : 0;
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
      showAlert('⚠️ لا يوجد رصيد كافٍ', 'رصيد محفظتك ' + wallet.toFixed(2) + ' ر.س غير كافٍ.');
      return;
    }
    if (payMethod === 'points' && points < MIN_POINTS_REDEEM) {
      showAlert('⚠️ نقاط غير كافية', `تحتاج على الأقل ${MIN_POINTS_REDEEM} نقطة.`);
      return;
    }

    // التحقق من البيانات المحفوظة قبل الطلب النهائي
    if (payMethod === 'card' && !cardDetails.isSaved) {
      showAlert('⚠️ بيانات الدفع غير مكتملة', 'لا توجد بطاقة ائتمان محفوظة.\n\nيرجى إضافة بيانات البطاقة من صفحة "طرق الدفع" في حسابي أولاً.');
      return;
    }

    if (payMethod === 'bank' && !bankDetails.isSaved) {
      showAlert('⚠️ بيانات الدفع غير مكتملة', 'لا توجد بيانات بنك محفوظة.\n\nيرجى إضافة بيانات التحويل من صفحة "طرق الدفع" في حسابي أولاً.');
      return;
    }
    
    const otherMethods = ['applepay', 'tamara', 'tabby'];
    if (otherMethods.includes(payMethod)) {
       if (!cardDetails.isSaved && !bankDetails.isSaved) {
         showAlert('⚠️ بيانات الدفع غير مكتملة', `لا توجد بيانات دفع محفوظة لاستخدام ${currentMethodObj.name}.\n\nيرجى إضافة بطاقة أو حساب بنكي من صفحة "طرق الدفع" في حسابي أولاً.`);
         return;
       }
    }

    if (payMethod !== preferredMethodId) {
      setPreferredMethod(payMethod);
    }

    onOrder({ 
      appliedCoupon, couponDiscount, walletDiscount, 
      pointsDiscount, totalDiscount, finalTotal, 
      payMethod, pointsUsed: payMethod === 'points' ? points : 0 
    });
  }

  // ✅ التعديل الثاني: دالة ضغط موحدة تفتح Alert لأي طريقة غير مكتملة البيانات
  const handlePaymentMethodPress = (methodId) => {
    const hasFields = (methodId === 'card' || methodId === 'bank');
    const isDataSaved = (methodId === 'card' && cardDetails.isSaved) || (methodId === 'bank' && bankDetails.isSaved);
    
    const requiresBackupData = ['applepay', 'tamara', 'tabby'];
    const isOtherMethod = requiresBackupData.includes(methodId);
    const hasBackupData = cardDetails.isSaved || bankDetails.isSaved;

    let methodName = '';
    let needsData = false;

    if (hasFields && !isDataSaved) {
      needsData = true;
      if (methodId === 'card') methodName = 'بطاقة ائتمان';
      else if (methodId === 'bank') methodName = 'تحويل بنكي';
    } else if (isOtherMethod && !hasBackupData) {
      needsData = true;
      if (methodId === 'applepay') methodName = 'Apple Pay';
      else if (methodId === 'tamara') methodName = 'تمارا';
      else if (methodId === 'tabby') methodName = 'تابي';
    }

    // إذا كانت الطريقة تحتاج بيانات وغير محفوظة -> افتح Alert
    if (needsData) {
      showAlert(
        '⚠️ بيانات الدفع غير مكتملة', 
        `لا توجد بيانات ${methodName} محفوظة.\n\nيرجى الذهاب إلى صفحة "طرق الدفع" في حسابي لإضافة البيانات أولاً.`,
        [
          { 
            text: 'إلغاء', 
            style: 'cancel', 
            onPress: () => {
              setShowPaymentModal(false);
              setPayMethod(methodId);
              setWarningVisible(true);
            }
          }
        ]
      );
      return;
    }

    // إذا كانت البيانات مكتملة -> اعتمد الطريقة وأغلق النافذة
    setPayMethod(methodId);
    setPreferredMethod(methodId);
    setWarningVisible(false);
    setShowPaymentModal(false);
  };

  const currentMethodObj = PAYMENT_METHODS.find(m => m.id === payMethod) || PAYMENT_METHODS[0];

  // دالة للتحقق من التوفر (تستخدم فقط لتحديد ما إذا كان يجب إغلاق النافذة تلقائياً أم لا، لكننا سمحنا بالضغط دائماً)
  const isMethodAvailable = (method) => {
    if (!user) return false;
    if (method.id === 'card') return cardDetails.isSaved;
    if (method.id === 'bank') return bankDetails.isSaved;
    if (['applepay', 'tamara', 'tabby'].includes(method.id)) {
      return cardDetails.isSaved || bankDetails.isSaved;
    }
    return true;
  };

  return (
    <View style={[s.screen, { backgroundColor: theme.bg }]}>
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=700&q=80' }} style={[s.detailHero, { height: 110 }]}>
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
          {cart.map((item, idx) => (
            <View key={idx} style={[s.cartItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Image source={{ uri: item.img }} style={s.cartThumb} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <TouchableOpacity onPress={() => removeItem(idx)} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFD0D0' }}>
                    <Text style={{ color: '#D32F2F', fontSize: 12, fontWeight: '900', lineHeight: 14 }}>✕</Text>
                  </TouchableOpacity>
                  <Text style={[s.mcardName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                </View>
                <View style={s.qtyRow}>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => onChangeQty(idx, -1)}><Text style={s.qtyBtnTxt}>−</Text></TouchableOpacity>
                  <Text style={s.qtyVal}>{item.qty}</Text>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => onChangeQty(idx, 1)}><Text style={s.qtyBtnTxt}>+</Text></TouchableOpacity>
                </View>
              </View>
              <Text style={s.cartPrice}>{item.price * item.qty} ر.س</Text>
            </View>
          ))}

          {/* ✅ التعديل الأول: شريط أيقونات طرق الدفع (ملونة دائماً وبدون شفافية) */}
          <View style={{ margin: 14, padding: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: theme.border }}>
            <Text style={{ fontSize: 11, color: theme.subText, marginBottom: 8, textAlign: 'right' }}>طرق الدفع المتاحة</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap' }}>
              {PAYMENT_METHODS.map((method) => {
                // ✅ إزالة opacity تماماً لضمان ظهور الألوان الأصلية
                return (
                  <View key={method.id} style={{ alignItems: 'center', marginHorizontal: 2, width: '13%' }}>
                    {method.logoUrl ? (
                      <Image 
                        source={{ uri: method.logoUrl }} 
                        style={{ width: 40, height: 40, resizeMode: 'contain' }} 
                      />
                    ) : (
                      <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        {method.iconLib === 'FontAwesome5' ? <FontAwesome5 name={method.iconName} size={28} color="#333" /> :
                         method.iconLib === 'MaterialCommunityIcons' ? <MaterialCommunityIcons name={method.iconName} size={28} color="#333" /> :
                         <Ionicons name={method.iconName} size={28} color="#333" />}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* ── طريقة الدفع المميزة ── */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => setShowPaymentModal(true)} style={{ margin:14, backgroundColor: '#FFF8E0', borderRadius:16, padding:16, borderWidth:2, borderColor: '#FFD166', shadowColor:'#FFD166', shadowOffset:{width:0, height:4}, shadowOpacity:0.2, shadowRadius:8 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <Text style={{ fontSize:14, fontWeight:'800', color: '#B05200' }}>طريقة الدفع المختارة</Text>
              <Text style={{ fontSize:12, color: '#0A2463', fontWeight:'700', textDecorationLine:'underline' }}>تغيير</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth:1, borderColor:'#FFE082' }}>
              <View style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
                 {currentMethodObj.logoUrl ? <Image source={{ uri: currentMethodObj.logoUrl }} style={{ width: 30, height: 30, resizeMode: 'contain' }} /> : <Text style={{ fontSize: 24 }}>💳</Text>}
              </View>
              <View style={{flex:1, marginRight: 10}}>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0A2463' }}>{currentMethodObj.name}</Text>
                {currentMethodObj.id === 'wallet' && <Text style={{ fontSize: 11, color: '#0A7A3C', fontWeight:'700' }}>الرصيد: {wallet.toFixed(2)} ر.س</Text>}
                {currentMethodObj.id === 'card' && cardDetails.isSaved && <Text style={{ fontSize: 11, color: '#0A2463', fontWeight:'700' }}>✅ بطاقة محفوظة ({cardDetails.cardNumber.slice(-4)})</Text>}
                {currentMethodObj.id === 'card' && !cardDetails.isSaved && <Text style={{ fontSize: 11, color: '#D32F2F', fontWeight:'700' }}>⚠️ لم يتم إضافة بطاقة</Text>}
                {currentMethodObj.id === 'bank' && bankDetails.isSaved && <Text style={{ fontSize: 11, color: '#0A2463', fontWeight:'700' }}>✅ حساب محفوظ ({bankDetails.bankName})</Text>}
                {currentMethodObj.id === 'bank' && !bankDetails.isSaved && <Text style={{ fontSize: 11, color: '#D32F2F', fontWeight:'700' }}>⚠️ لم يتم إضافة بنك</Text>}
                {!['wallet', 'card', 'bank'].includes(currentMethodObj.id) && <Text style={{ fontSize: 11, color: '#666' }}>{currentMethodObj.desc}</Text>}
              </View>
            </View>
          </TouchableOpacity>

          {/* ── كوبون الخصم ── */}
          <View style={{ marginHorizontal:14, marginBottom:14, backgroundColor: theme.card, borderRadius:16, padding:14, borderWidth:1, borderColor: theme.border }}>
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'flex-end', gap:8, marginBottom:12 }}>
              <Text style={{ fontSize:14, fontWeight:'800', color: theme.text }}>كوبون الخصم</Text>
              <Text style={{ fontSize:20 }}>🏷️</Text>
            </View>
            {appliedCoupon ? (
              <View style={{ backgroundColor: appliedCoupon.bg, borderRadius:12, padding:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1.5, borderColor: appliedCoupon.color + '66' }}>
                <TouchableOpacity onPress={removeCoupon} style={{ backgroundColor:'#FFF0F0', borderRadius:8, paddingHorizontal:10, paddingVertical:5, borderWidth:1, borderColor:'#FFD0D0' }}>
                  <Text style={{ color:'#D32F2F', fontSize:11, fontWeight:'700' }}>إزالة</Text>
                </TouchableOpacity>
                <View style={{ alignItems:'flex-end' }}>
                  <Text style={{ fontSize:13, fontWeight:'800', color: appliedCoupon.color }}>{appliedCoupon.icon} {appliedCoupon.label}</Text>
                  <Text style={{ fontSize:11, color: appliedCoupon.color, marginTop:2 }}>وفّرت {couponDiscount} ر.س ✓</Text>
                </View>
              </View>
            ) : (
              <View>
                <View style={{ flexDirection:'row', gap:8 }}>
                  <TouchableOpacity onPress={applyCoupon} style={{ backgroundColor:'#0A2463', borderRadius:10, paddingHorizontal:16, paddingVertical:11 }}>
                    <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>تطبيق</Text>
                  </TouchableOpacity>
                  <TextInput value={couponCode} onChangeText={v => { setCouponCode(v.toUpperCase()); setCouponError(''); }} placeholder="كود الخصم" placeholderTextColor={theme.subText} autoCapitalize="characters" autoCorrect={false} style={{ flex:1, backgroundColor: theme.bg, borderRadius:10, paddingHorizontal:12, paddingVertical:10, fontSize:13, color: theme.text, textAlign:'right', borderWidth:1.5, borderColor: couponError ? '#E53935' : theme.border, fontWeight:'700' }} underlineColorAndroid="transparent" />
                </View>
                {couponError ? <Text style={{ color:'#E53935', fontSize:11, textAlign:'right', marginTop:4 }}>⚠️ {couponError}</Text> : null}
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* ── Footer ── */}
      <View style={[s.cartFooter, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
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
        <TouchableOpacity style={[s.orderBtn, cart.length === 0 && { opacity: 0.5 }]} onPress={handleOrder} disabled={cart.length === 0} activeOpacity={0.85}>
          <Text style={s.orderBtnTxt}>{currentMethodObj.id === 'wallet' ? '💳 ' : currentMethodObj.id === 'points' ? '⭐ ' : '💵 '} تأكيد الطلب ({currentMethodObj.name})</Text>
        </TouchableOpacity>
      </View>

      {/* ── مودال اختيار الدفع ── */}
      {showPaymentModal && (
        <Modal visible={true} transparent animationType="slide">
          <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' }}>
            <View style={{ backgroundColor: theme.card, borderTopLeftRadius:20, borderTopRightRadius:20, paddingBottom:20, maxHeight:'90%' }}>
              <View style={{ padding:20, borderBottomWidth:1, borderBottomColor: theme.border, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <Text style={{ fontSize:18, fontWeight:'900', color: theme.text }}>طرق الدفع المتاحة</Text>
                <TouchableOpacity onPress={() => setShowPaymentModal(false)}><Text style={{ fontSize:16, color:'#f00', fontWeight:'700' }}>إغلاق</Text></TouchableOpacity>
              </View>
              
              <ScrollView style={{ padding:20 }}>
                <View style={{ marginBottom:20, padding:15, backgroundColor:'#F4F7FF', borderRadius:12, borderLeftWidth:4, borderLeftColor:'#0A2463' }}>
                  <Text style={{ fontSize:12, color:'#666' }}>رصيد محفظتك الحالي</Text>
                  <Text style={{ fontSize:22, fontWeight:'900', color:'#0A2463' }}>{wallet.toFixed(2)} ر.س</Text>
                </View>

                {PAYMENT_METHODS.map((method) => {
                  const isSelected = payMethod === method.id;
                  const hasFields = (method.id === 'card' || method.id === 'bank');
                  const isDataSaved = (method.id === 'card' && cardDetails.isSaved) || (method.id === 'bank' && bankDetails.isSaved);
                  const isOtherMethod = ['applepay', 'tamara', 'tabby'].includes(method.id);
                  const hasBackupData = cardDetails.isSaved || bankDetails.isSaved;
                  
                  // ✅ السماح بالضغط دائماً، ولكن نتحقق داخل الدالة
                  const isAvailable = isMethodAvailable(method);

                  return (
                    <TouchableOpacity
                      key={method.id}
                      // ✅ حذف disabled لضمان عمل الضغط دائماً
                      onPress={() => handlePaymentMethodPress(method.id)}
                      style={{
                        flexDirection:'row', alignItems:'center', padding:12, marginBottom:10,
                        borderRadius:12, borderWidth:2,
                        borderColor: isSelected ? '#FFD166' : theme.border,
                        backgroundColor: isSelected ? '#FFF8E0' : theme.bg,
                        // ✅ إزالة opacity من هنا أيضاً ليبقى الشكل واضحاً
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 0 }}>
                        <View style={{ width:50, height:50, borderRadius:12, backgroundColor: isSelected ? '#fff' : '#f9f9f9', alignItems:'center', justifyContent:'center', marginLeft:15, borderWidth: 1, borderColor: '#eee', overflow: 'hidden' }}>
                          {method.logoUrl ? (
                            <Image source={{ uri: method.logoUrl.trim() }} style={{ width: method.id === 'applepay' ? 25 : 35, height: 35, resizeMode: 'contain', alignSelf: 'center' }} onError={() => console.log(`Failed to load icon for ${method.name}`)} />
                          ) : (
                            method.iconLib === 'FontAwesome5' ? <FontAwesome5 name={method.iconName} size={26} color={isSelected ? '#B05200' : '#666'} /> :
                            method.iconLib === 'MaterialCommunityIcons' ? <MaterialCommunityIcons name={method.iconName} size={26} color={isSelected ? '#B05200' : '#666'} /> :
                            <Ionicons name={method.iconName} size={26} color={isSelected ? '#B05200' : '#666'} />
                          )}
                        </View>
                        {isSelected && (
                          <View style={{ position: 'absolute', left: -10, top: -5, backgroundColor: '#0A2463', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF8E0' }}>
                            <Text style={{ color:'#fff', fontSize: 12, fontWeight: '900', lineHeight: 12 }}>✓</Text>
                          </View>
                        )}
                      </View>

                      <View style={{ flex: 1, marginLeft: 15, alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 15, fontWeight: isSelected ? '900' : '600', color: isSelected ? '#B05200' : theme.text, textAlign: 'right', width: '100%' }}>{method.name}</Text>
                        <Text style={{ fontSize:11, color: theme.subText, textAlign: 'right' }}>{method.desc}</Text>
                        {method.id === 'wallet' && <Text style={{ fontSize:11, color:'#0A7A3C', marginTop:2, fontWeight:'700', textAlign: 'right' }}>الرصيد: {wallet.toFixed(2)} ر.س</Text>}
                        
                        {method.id === 'card' && cardDetails.isSaved && <Text style={{ fontSize: 10, color: '#0A7A3C', marginTop: 2, fontWeight: '700', textAlign: 'right' }}>✅ بطاقة محفوظة ({cardDetails.cardNumber.slice(-4)})</Text>}
                        {method.id === 'card' && !cardDetails.isSaved && <Text style={{ fontSize: 10, color: '#D32F2F', marginTop: 2, fontWeight: '700', textAlign: 'right' }}>⚠️ غير متاح</Text>}
                        
                        {method.id === 'bank' && bankDetails.isSaved && <Text style={{ fontSize: 10, color: '#0A7A3C', marginTop: 2, fontWeight: '700', textAlign: 'right' }}>✅ حساب محفوظ ({bankDetails.bankName})</Text>}
                        {method.id === 'bank' && !bankDetails.isSaved && <Text style={{ fontSize: 10, color: '#D32F2F', marginTop: 2, fontWeight: '700', textAlign: 'right' }}>⚠️ غير متاح</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
                
                <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={{ marginTop:10, backgroundColor:'#0A2463', padding:15, borderRadius:12, alignItems:'center' }}><Text style={{ color:'#fff', fontSize:16, fontWeight:'900' }}>حفظ وإغلاق</Text></TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, BackHandler } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { PAYMENT_METHODS } from '../context/PaymentContext';

export default function PurchaseDetailScreen({ purchase, onBack }) {
  const theme = useTheme();
  
  const payInfo = PAYMENT_METHODS.find(m => m.id === purchase?.payMethod) || { 
    name: 'الدفع عند الاستلام', 
    icon: '💵', 
    logoUrl: null,
    color: '#0A7A3C',
    bg: '#E6F7EE'
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { onBack(); return true; });
    return () => sub.remove();
  }, [onBack]);

  const orderNum = purchase?.orderId || String(purchase?.purchaseId || '').slice(-6) || '------';
  const productNum = purchase?.productId || purchase?.code || '------';

  function Row({ label, value, color, bold, isPrice }) {
    return (
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',
        paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
        <Text style={{ fontSize: isPrice ? 16 : 13, fontWeight: bold ? '800' : '500', color: color || theme.text, textAlign: 'right' }}>
          {value}
        </Text>
        <Text style={{ fontSize:12, color: theme.subText }}>{label}</Text>
      </View>
    );
  }

  const earnedPoints = Math.floor((purchase.price || 0) / 100);

  return (
    <View style={{ flex:1, backgroundColor: theme.bg }}>
      {/* رأس */}
      <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{
          backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10,
          paddingHorizontal:12, paddingVertical:6,
        }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>
          📋 تفاصيل الشراء
        </Text>
      </View>

      <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding:14 }}>

          {/* صورة المنتج */}
          <View style={{
            backgroundColor: theme.card, borderRadius:16, padding:16,
            borderWidth:1, borderColor: theme.border, marginBottom:14,
            flexDirection:'row', alignItems:'center', gap:14,
          }}>
            <View style={{ width:70, height:70, borderRadius:14, backgroundColor: theme.bg, overflow:'hidden' }}>
              {purchase?.img ? (
                <Image source={{ uri: purchase.img }} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
              ) : (
                <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                  <Text style={{ fontSize:28 }}>📦</Text>
                </View>
              )}
            </View>
            <View style={{ flex:1 }}>
              <Text style={{ fontSize:14, fontWeight:'800', color: theme.text, textAlign:'right' }} numberOfLines={2}>
                {purchase?.name}
              </Text>
              <Text style={{ fontSize:11, color: theme.subText, textAlign:'right', marginTop:4 }}>
                {purchase?.cat}
              </Text>
            </View>
          </View>

          {/* بطاقة تفاصيل الطلب */}
          <View style={{
            backgroundColor: theme.card, borderRadius:16, padding:16,
            borderWidth:1, borderColor: theme.border, marginBottom:14,
          }}>
            <Text style={{ fontSize:14, fontWeight:'800', color: theme.text, textAlign:'right', marginBottom:12 }}>
              معلومات الطلب
            </Text>
            <Row label="رقم الطلب" value={`#${orderNum}`} bold />
            <Row label="رقم المنتج" value={productNum} />
            <Row label="تاريخ الشراء" value={purchase?.date || '—'} />
            <Row label="الكمية" value={`${purchase?.qty || 1} قطعة`} />
          </View>

          {/* بطاقة الدفع */}
          <View style={{
            backgroundColor: theme.card, borderRadius:16, padding:16,
            borderWidth:1, borderColor: theme.border, marginBottom:14,
          }}>
            <Text style={{ fontSize:14, fontWeight:'800', color: theme.text, textAlign:'right', marginBottom:12 }}>
              تفاصيل الدفع
            </Text>

            {/* طريقة الدفع */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',
              paddingVertical:12, borderBottomWidth:1, borderBottomColor: theme.border }}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
                {payInfo.logoUrl ? (
                  <Image source={{ uri: payInfo.logoUrl }} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                ) : (
                  <View style={{ width: 35, height: 35, borderRadius: 8, backgroundColor: payInfo.bg || '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>{payInfo.icon}</Text>
                  </View>
                )}
                <Text style={{ fontSize: 14, fontWeight: '700', color: payInfo.color || theme.text }}>
                  {payInfo.name}
                </Text>
              </View>
              <Text style={{ fontSize:12, color: theme.subText }}>طريقة الدفع</Text>
            </View>

            {/* ✅ التعديل: استخدام row-reverse لعكس الاتجاه */}
            {earnedPoints > 0 && (
              <View style={{ flexDirection:'row-reverse', justifyContent:'space-between', alignItems:'center',
                paddingVertical:12, borderBottomWidth:1, borderBottomColor: theme.border }}>
                
                {/* الآن سيظهر هذا العنصر على اليسار بسبب row-reverse */}
                <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                  <Text style={{ fontSize: 18 }}>⭐</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#B05200' }}>النقاط المكتسبة</Text>
                </View>
                
                {/* الآن سيظهر هذا العنصر على اليمين بسبب row-reverse */}
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#B05200' }}>{earnedPoints} نقطة</Text>
              </View>
            )}

            {/* السعر الأصلي */}
            {purchase?.couponDiscount > 0 && (
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
                <Text style={{ fontSize:12, color: theme.subText, textDecorationLine:'line-through', textAlign: 'right' }}>
                  {purchase.originalPrice} ر.س
                </Text>
                <Text style={{ fontSize:12, color: theme.subText }}>السعر الأصلي</Text>
              </View>
            )}

            {/* خصم الكوبون */}
            {purchase?.couponDiscount > 0 && (
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
                <Text style={{ fontSize:12, fontWeight:'700', color:'#0A7A3C', textAlign: 'right' }}>
                  - {purchase.couponDiscount} ر.س ({purchase.couponCode})
                </Text>
                <Text style={{ fontSize:12, color: theme.subText }}>خصم الكوبون 🏷️</Text>
              </View>
            )}

            {/* السعر النهائي */}
            <Row label="المبلغ المدفوع" value={`${purchase?.price} ر.س`} color="#0A2463" bold isPrice={true} />
          </View>

          {/* شارة الحالة */}
          <View style={{
            backgroundColor: '#FFF8E0',
            borderRadius:14, padding:14,
            flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8,
            borderWidth:1, borderColor: '#B0520033',
          }}>
            <Text style={{ fontSize:14, fontWeight:'800', color: '#B05200' }}>
              {'قيد المراجعة 🕐'}
            </Text>
            <Text style={{ fontSize:22 }}>📦</Text>
          </View>

        </View>
        <View style={{ height:120 }} />
      </ScrollView>
    </View>
  );
}
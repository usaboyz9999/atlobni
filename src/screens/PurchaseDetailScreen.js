import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, BackHandler } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PAY_LABELS = {
  cash:   { label:'الدفع عند الاستلام', icon:'💵', color:'#0A7A3C', bg:'#E6F7EE' },
  wallet: { label:'المحفظة',             icon:'💳', color:'#0043B0', bg:'#E6F0FF' },
  points: { label:'النقاط',              icon:'⭐', color:'#B05200', bg:'#FFF8E0' },
};

export default function PurchaseDetailScreen({ purchase, onBack }) {
  const theme   = useTheme();
  const payInfo = PAY_LABELS[purchase?.payMethod] || PAY_LABELS.cash;

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { onBack(); return true; });
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderNum   = purchase?.orderId   || String(purchase?.purchaseId || '').slice(-6) || '------';
  const productNum = purchase?.productId || purchase?.code || '------';

  function Row({ label, value, color, bold }) {
    return (
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',
        paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
        <Text style={{ fontSize:13, fontWeight: bold ? '800' : '500', color: color || theme.text }}>
          {value}
        </Text>
        <Text style={{ fontSize:12, color: theme.subText }}>{label}</Text>
      </View>
    );
  }

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
              {purchase?.img
                ? <Image source={{ uri: purchase.img }} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
                : <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                    <Text style={{ fontSize:28 }}>📦</Text>
                  </View>
              }
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
            <Row label="رقم الطلب"   value={`#${orderNum}`}   bold />
            <Row label="رقم المنتج"  value={productNum} />
            <Row label="تاريخ الشراء" value={purchase?.date || '—'} />
            <Row label="الكمية"       value={`${purchase?.qty || 1} قطعة`} />
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
              paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                <View style={{ backgroundColor: payInfo.bg, borderRadius:8, paddingHorizontal:10, paddingVertical:4 }}>
                  <Text style={{ fontSize:12, fontWeight:'700', color: payInfo.color }}>
                    {payInfo.icon} {payInfo.label}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize:12, color: theme.subText }}>طريقة الدفع</Text>
            </View>

            {/* السعر الأصلي */}
            {purchase?.couponDiscount > 0 && (
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
                <Text style={{ fontSize:12, color: theme.subText, textDecorationLine:'line-through' }}>
                  {purchase.originalPrice} ر.س
                </Text>
                <Text style={{ fontSize:12, color: theme.subText }}>السعر الأصلي</Text>
              </View>
            )}

            {/* خصم الكوبون */}
            {purchase?.couponDiscount > 0 && (
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
                <Text style={{ fontSize:12, fontWeight:'700', color:'#0A7A3C' }}>
                  - {purchase.couponDiscount} ر.س (كود: {purchase.couponCode})
                </Text>
                <Text style={{ fontSize:12, color: theme.subText }}>خصم الكوبون 🏷️</Text>
              </View>
            )}

            {/* السعر النهائي */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:10 }}>
              <Text style={{ fontSize:16, fontWeight:'900', color:'#0A2463' }}>
                {purchase?.price} ر.س
              </Text>
              <Text style={{ fontSize:12, color: theme.subText }}>المبلغ المدفوع</Text>
            </View>
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
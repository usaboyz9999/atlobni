import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { PAYMENT_METHODS } from '../context/PaymentContext';

export default function OrderSuccessScreen({ order, onContinue, onViewDetails }) {
  const theme    = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const payInfo = PAYMENT_METHODS.find(m => m.id === order?.payMethod) || { 
    name: 'الدفع عند الاستلام', 
    icon: '💵', 
    logoUrl: null,
    color: '#0A7A3C' 
  };
  
  const orderNum = order?.orderId || String(Date.now()).slice(-6);
  const productNum = order?.productId || String(Math.floor(Math.random() * 900000) + 100000);
  
  const earnedPoints = Math.floor((order?.total || 0) / 100);

  return (
    <View style={{ flex:1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow:1, alignItems:'center', justifyContent:'center', padding:24 }}
        showsVerticalScrollIndicator={false}>

        {/* أيقونة الصح */}
        <Animated.View style={{ transform:[{ scale: scaleAnim }], marginBottom:24 }}>
          <View style={{
            width:100, height:100, borderRadius:50,
            backgroundColor:'#E6F7EE', alignItems:'center', justifyContent:'center',
            borderWidth:3, borderColor:'#0A7A3C',
            elevation:8, shadowColor:'#0A7A3C', shadowOffset:{width:0,height:4},
            shadowOpacity:0.25, shadowRadius:12,
          }}>
            <Text style={{ fontSize:52 }}>✅</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems:'center', width:'100%' }}>

          {/* العنوان */}
          <Text style={{ fontSize:22, fontWeight:'900', color: theme.text, marginBottom:6, textAlign:'center' }}>
            تم الطلب بنجاح!
          </Text>
          <Text style={{ fontSize:13, color: theme.subText, textAlign:'center', lineHeight:20, marginBottom:28 }}>
            شكراً لتسوقك معنا وثقتك بمتجرنا
          </Text>

          {/* بطاقة تفاصيل الطلب */}
          <View style={{
            backgroundColor: theme.card, borderRadius:18, padding:18, width:'100%',
            borderWidth:1, borderColor: theme.border, marginBottom:20,
            elevation:3, shadowColor:'#000', shadowOffset:{width:0,height:2},
            shadowOpacity:0.06, shadowRadius:8,
          }}>
            {/* رقم الطلب */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
              <Text style={{ fontSize:14, fontWeight:'900', color:'#0A2463', fontFamily:'monospace', letterSpacing:1 }}>
                #{orderNum}
              </Text>
              <Text style={{ fontSize:12, color: theme.subText }}>رقم الطلب</Text>
            </View>

            {/* الحالة */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
              <View style={{ backgroundColor: '#FFF8E0', borderRadius:8, paddingHorizontal:10, paddingVertical:4 }}>
                <Text style={{ fontSize:12, fontWeight:'700', color: '#B05200' }}>
                  {'🕐 تحت المراجعة'}
                </Text>
              </View>
              <Text style={{ fontSize:12, color: theme.subText }}>حالة الطلب</Text>
            </View>

            {/* رقم المنتج */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
              <Text style={{ fontSize:13, fontWeight:'700', color: theme.text, fontFamily:'monospace' }}>
                {productNum}
              </Text>
              <Text style={{ fontSize:12, color: theme.subText }}>رقم المنتج</Text>
            </View>

            {/* طريقة الدفع */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                {payInfo.logoUrl ? (
                  <Image 
                    source={{ uri: payInfo.logoUrl }} 
                    style={{ width: 30, height: 30, resizeMode: 'contain' }} 
                  />
                ) : (
                  <Text style={{ fontSize: 20 }}>{payInfo.icon}</Text>
                )}
                <Text style={{ fontSize:13, fontWeight:'700', color: payInfo.color }}>
                  {payInfo.name}
                </Text>
              </View>
              <Text style={{ fontSize:12, color: theme.subText }}>طريقة الدفع</Text>
            </View>

            {/* ✅ التعديل: استخدام row-reverse لعكس الاتجاه */}
            {earnedPoints > 0 && (
              <View style={{ flexDirection:'row-reverse', justifyContent:'space-between', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.border }}>
                {/* الآن سيظهر هذا العنصر على اليسار بسبب row-reverse */}
                <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                  <Text style={{ fontSize: 18 }}>⭐</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#B05200' }}>النقاط المكتسبة</Text>
                </View>
                {/* الآن سيظهر هذا العنصر على اليمين بسبب row-reverse */}
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#B05200' }}>{earnedPoints} نقطة</Text>
              </View>
            )}

            {/* المبلغ */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:10 }}>
              <Text style={{ fontSize:15, fontWeight:'900', color:'#0A2463' }}>
                {order?.total?.toFixed(2) || '0.00'} ر.س
              </Text>
              <Text style={{ fontSize:12, color: theme.subText }}>إجمالي الطلب</Text>
            </View>

            {/* خصم الكوبون */}
            {order?.couponDiscount > 0 && (
              <View style={{
                backgroundColor:'#E6F7EE', borderRadius:10, padding:10, marginTop:4,
                flexDirection:'row', justifyContent:'space-between', alignItems:'center',
              }}>
                <Text style={{ fontSize:12, fontWeight:'700', color:'#0A7A3C' }}>
                  وفّرت {order.couponDiscount.toFixed(2)} ر.س 🏷️
                </Text>
                <Text style={{ fontSize:11, color:'#0A7A3C' }}>كوبون: {order.couponCode}</Text>
              </View>
            )}
          </View>

          {/* الأزرار */}
          <TouchableOpacity
            onPress={onViewDetails}
            style={{
              width:'100%', backgroundColor:'#0A2463', borderRadius:14,
              paddingVertical:15, alignItems:'center', marginBottom:10,
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color:'#fff', fontSize:14, fontWeight:'700' }}>📋 تفاصيل الطلب</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onContinue}
            style={{
              width:'100%', backgroundColor: theme.card, borderRadius:14,
              paddingVertical:15, alignItems:'center',
              borderWidth:1.5, borderColor:'#0A2463',
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color:'#0A2463', fontSize:14, fontWeight:'700' }}>🛒 الاستمرار بالتسوق</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </View>
  );
}
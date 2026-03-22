import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import s from '../styles';
import { useTheme } from '../context/ThemeContext';

export default function CartScreen({ cart, onChangeQty, onOrder }) {
  const theme = useTheme();
  const total    = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  function removeItem(idx) { onChangeQty(idx, -999); } // qty → 0 → يُحذف

  return (
    <View style={[s.screen, { backgroundColor: theme.bg }]}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=700&q=80' }}
        style={[s.detailHero, { height: 110 }]}
      >
        <View style={[s.heroOverlay, { backgroundColor: 'rgba(10,36,99,0.82)' }]} />
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
                  <TouchableOpacity onPress={() => removeItem(idx)} style={{
                    width: 24, height: 24, borderRadius: 12,
                    backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: '#FFD0D0',
                  }}>
                    <Text style={{ color: '#D32F2F', fontSize: 12, fontWeight: '900', lineHeight: 14 }}>✕</Text>
                  </TouchableOpacity>
                  <Text style={[s.mcardName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                </View>
                <Text style={s.mcardFreq}>{item.code}</Text>
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
          <View style={{ height: 16 }} />
        </ScrollView>
      )}

      <View style={[s.cartFooter, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View style={s.cartTotal}>
          <Text style={s.totalLbl}>الإجمالي</Text>
          <Text style={s.totalVal}>{total} ر.س</Text>
        </View>
        <TouchableOpacity
          style={[s.orderBtn, cart.length === 0 && { opacity: 0.5 }]}
          onPress={onOrder}
          disabled={cart.length === 0}
          activeOpacity={0.85}
        >
          <Text style={s.orderBtnTxt}>تأكيد الطلب</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
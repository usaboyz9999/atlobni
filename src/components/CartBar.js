import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
const BAR_H    = 60;

export default function CartBar({ cart, visible, onPress }) {
  const slideY  = useRef(new Animated.Value(-BAR_H - 10)).current;
  const total   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count   = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    Animated.spring(slideY, {
      toValue: visible ? 0 : -BAR_H - 10,
      useNativeDriver: true,
      tension: 70,
      friction: 10,
    }).start();
  }, [visible]);

  if (count === 0) return null;

  return (
    <Animated.View style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      transform: [{ translateY: slideY }],
      zIndex: 999,
    }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.92}>
        <View style={{
          backgroundColor: '#0A2463',
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 16, height: BAR_H,
          justifyContent: 'space-between',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        }}>
          {/* يسار: السعر */}
          <View style={{
            backgroundColor: '#0078FF', borderRadius: 10,
            paddingHorizontal: 12, paddingVertical: 5,
          }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>{total} ر.س</Text>
          </View>

          {/* وسط: نص */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
              🛒 عرض السلة
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 1 }}>
              اضغط للدخول
            </Text>
          </View>

          {/* يمين: عدد المنتجات */}
          <View style={{
            width: 34, height: 34, borderRadius: 17,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
          }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '900' }}>{count}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
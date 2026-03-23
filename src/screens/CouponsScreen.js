import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, BackHandler,
} from 'react-native';
import { useEffect } from 'react';
import { COUPONS, findCoupon, calcDiscount } from '../data/couponsData';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../components/alertBridge';

export default function CouponsScreen({ onBack }) {
  const { isCouponUsed } = useAuth();
  const [code,    setCode]    = useState('');
  const [checked, setChecked] = useState(null);  // { coupon, discount }
  const [error,   setError]   = useState('');

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack(); return true;
    });
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function checkCoupon() {
    const coupon = findCoupon(code);
    if (!coupon) { setError('كود الخصم غير صحيح'); setChecked(null); return; }
    if (isCouponUsed(code)) { setError('تم استخدام هذا الكوبون مسبقاً'); setChecked(null); return; }
    setError('');
    setChecked({ coupon });
    showAlert(`${coupon.icon} كوبون صحيح!`, `${coupon.label}\n${coupon.desc}`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF2F7' }}>
      {/* رأس */}
      <View style={{ backgroundColor: '#0A2463', padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={onBack} style={{
          backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10,
          paddingHorizontal: 12, paddingVertical: 6,
        }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '900', flex: 1, textAlign: 'right' }}>
          🏷️ كوبونات الخصم
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* حقل التحقق من الكوبون */}
        <View style={{
          margin: 14, backgroundColor: '#fff', borderRadius: 16, padding: 16,
          borderWidth: 1, borderColor: '#DDE4EF',
          elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06, shadowRadius: 6,
        }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0A2463', textAlign: 'right', marginBottom: 12 }}>
            تحقق من كوبونك
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TouchableOpacity
              onPress={checkCoupon}
              style={{ backgroundColor: '#0A2463', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 11 }}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>تحقق</Text>
            </TouchableOpacity>
            <TextInput
              value={code}
              onChangeText={v => { setCode(v.toUpperCase()); setError(''); setChecked(null); }}
              placeholder="أدخل كود الخصم"
              placeholderTextColor="#A0ADBF"
              autoCapitalize="characters"
              autoCorrect={false}
              style={{
                flex: 1, backgroundColor: '#F4F7FB', borderRadius: 10,
                paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
                color: '#0A2463', textAlign: 'right', letterSpacing: 1,
                borderWidth: 1.5, borderColor: error ? '#E53935' : checked ? '#0A7A3C' : '#DDE4EF',
                fontWeight: '700',
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          {error ? (
            <Text style={{ color: '#E53935', fontSize: 11, textAlign: 'right' }}>⚠️ {error}</Text>
          ) : checked ? (
            <View style={{
              backgroundColor: checked.coupon.bg, borderRadius: 10, padding: 10,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
              borderWidth: 1, borderColor: checked.coupon.color + '44',
            }}>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: checked.coupon.color }}>
                  {checked.coupon.label} ✓
                </Text>
                <Text style={{ fontSize: 10, color: checked.coupon.color, marginTop: 2 }}>
                  {checked.coupon.desc}
                </Text>
              </View>
              <Text style={{ fontSize: 24 }}>{checked.coupon.icon}</Text>
            </View>
          ) : null}
        </View>

        {/* قائمة الكوبونات المتاحة */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7C93', textAlign: 'right', paddingHorizontal: 14, marginBottom: 10 }}>
          الكوبونات المتاحة
        </Text>

        {COUPONS.map((coupon, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              if (isCouponUsed(coupon.code)) {
                showAlert('⚠️ كوبون مستخدم', 'تم استخدام هذا الكوبون مسبقاً ولا يمكن إعادة استخدامه');
                return;
              }
              setCode(coupon.code);
              setError('');
              setChecked({ coupon });
            }}
            activeOpacity={0.85}
            style={{
              marginHorizontal: 14, marginBottom: 10,
              backgroundColor: '#fff', borderRadius: 16,
              borderWidth: 1.5, borderColor: coupon.color + '44',
              overflow: 'hidden',
              elevation: 2, shadowColor: coupon.color,
              shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6,
            }}
          >
            {/* شريط لوني علوي */}
            <View style={{ height: 4, backgroundColor: coupon.color }} />

            <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              {/* أيقونة الخصم */}
              <View style={{
                width: 60, height: 60, borderRadius: 16,
                backgroundColor: coupon.bg, alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderColor: coupon.color + '33',
              }}>
                <Text style={{ fontSize: 28 }}>{coupon.icon}</Text>
              </View>

              {/* التفاصيل */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 4 }}>
                  {/* شارة نسبة الخصم */}
                  <View style={{
                    backgroundColor: coupon.color, borderRadius: 8,
                    paddingHorizontal: 8, paddingVertical: 3,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900' }}>
                      {coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value} ر.س`}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#0A2463' }}>
                    {coupon.label}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, color: '#6B7C93', textAlign: 'right', lineHeight: 16 }}>
                  {coupon.desc}
                </Text>
                {coupon.minOrder > 0 && (
                  <Text style={{ fontSize: 10, color: '#A0ADBF', textAlign: 'right', marginTop: 4 }}>
                    الحد الأدنى للطلب: {coupon.minOrder} ر.س
                  </Text>
                )}
              </View>
            </View>

            {/* كود الخصم */}
            <View style={{
              backgroundColor: coupon.bg, paddingHorizontal: 14, paddingVertical: 8,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              borderTopWidth: 1, borderTopColor: coupon.color + '22',
            }}>
              {isCouponUsed(coupon.code) ? (
                <View style={{ backgroundColor: '#DDD', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 10, color: '#888', fontWeight: '700' }}>✓ مستخدم</Text>
                </View>
              ) : (
              <Text style={{ fontSize: 10, color: coupon.color, fontWeight: '600' }}>
                اضغط لتطبيقه
              </Text>
              )}
              <View style={{
                backgroundColor: isCouponUsed(coupon.code) ? '#EEE' : '#fff', borderRadius: 8,
                paddingHorizontal: 10, paddingVertical: 4,
                borderWidth: 1.5, borderColor: isCouponUsed(coupon.code) ? '#CCC' : coupon.color,
              }}>
                <Text style={{
                  fontSize: 13, fontWeight: '900',
                  color: isCouponUsed(coupon.code) ? '#AAA' : coupon.color,
                  letterSpacing: 1,
                  textDecorationLine: isCouponUsed(coupon.code) ? 'line-through' : 'none',
                }}>
                  {coupon.code}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}
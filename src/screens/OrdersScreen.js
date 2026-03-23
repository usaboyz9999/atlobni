import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import s from '../styles';
import { useTheme } from '../context/ThemeContext';
import { DETAIL_DATA } from '../data/detailData';

const STATUS_COLOR = { pending:'#B05200', inprogress:'#0043B0', done:'#0A7A3C' };
const STATUS_BG    = { pending:'#FFF0E0', inprogress:'#E6F0FF', done:'#E6F7EE' };
const STATUS_LABEL = { pending:'قيد الانتظار', inprogress:'جارٍ التنفيذ', done:'مكتمل' };
const PRIO_COLOR   = { عاجل:'#D32F2F', عالي:'#B05200', عادي:'#0043B0', منخفض:'#0A7A3C' };

// ─── تفاصيل طلب كامل ────────────────────────────────────
function OrderDetail({ order, onBack }) {
  const theme = useTheme();

  // زر الرجوع في الهاتف يعود للقائمة
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack(); return true;
    });
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catId    = order.catId;
  const catData  = catId ? DETAIL_DATA[catId] : null;
  const subCats  = catData?.subCategories || [];

  // القوائم المختارة
  const selSubs = order.subCategories || [];
  const selSubsData = subCats.filter(s => selSubs.includes(s.id));

  // قطع الغيار المختارة (بالـ key المخزن)
  const spareParts = order.spareParts || [];

  function Section({ title, color, children }) {
    return (
      <View style={{
        backgroundColor: '#fff', borderRadius: 14, marginBottom: 12,
        borderWidth: 1, borderColor: '#DDE4EF', overflow: 'hidden',
      }}>
        <View style={{ backgroundColor: (color || '#0A2463') + '18', paddingHorizontal: 14, paddingVertical: 10,
          borderBottomWidth: 1, borderBottomColor: (color || '#0A2463') + '33',
        }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: color || '#0A2463', textAlign: 'right' }}>{title}</Text>
        </View>
        <View style={{ padding: 12 }}>{children}</View>
      </View>
    );
  }

  function InfoRow({ label, value, color }) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#F4F7FB',
      }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: color || '#0D1B2A' }}>{value}</Text>
        <Text style={{ fontSize: 11, color: '#6B7C93' }}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg || '#EEF2F7' }}>
      {/* رأس */}
      <View style={{ backgroundColor: '#0A2463', paddingTop: 12, paddingBottom: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <TouchableOpacity onPress={onBack} style={{
            backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10,
            paddingHorizontal: 12, paddingVertical: 6,
          }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>رجوع</Text>
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '900', flex: 1, textAlign: 'right' }}>
            تفاصيل الطلب
          </Text>
        </View>
        {/* الحالة */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{
            backgroundColor: STATUS_BG[order.status], borderRadius: 10,
            paddingHorizontal: 12, paddingVertical: 5,
          }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: STATUS_COLOR[order.status] }}>
              {STATUS_LABEL[order.status]}
            </Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800', flex: 1, textAlign: 'right', marginLeft: 10 }}
            numberOfLines={1}>{order.title}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ padding: 14 }}>

          {/* معلومات أساسية */}
          <Section title="📋 معلومات الطلب" color="#0A2463">
            <InfoRow label="التخصص"   value={order.category} />
            <InfoRow label="الأولوية" value={order.priority}  color={PRIO_COLOR[order.priority]} />
            <InfoRow label="المسؤول"  value={order.assign} />
            <InfoRow label="التاريخ"  value={order.date} />
            {order.desc ? <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 10, color: '#6B7C93', textAlign: 'right', marginBottom: 4 }}>الوصف</Text>
              <Text style={{ fontSize: 12, color: theme.text2 || '#0D1B2A', textAlign: 'right', lineHeight: 18 }}>{order.desc}</Text>
            </View> : null}
          </Section>

          {/* القوائم المختارة */}
          {selSubsData.length > 0 && (
            <Section title="📂 القوائم المختارة" color="#0043B0">
              {selSubsData.map((sub, i) => (
                <View key={sub.id}>
                  {/* رأس القائمة */}
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingVertical: 8,
                    borderBottomWidth: i < selSubsData.length - 1 || sub.items?.length > 0 ? 1 : 0,
                    borderBottomColor: '#EEF2F7',
                  }}>
                    <View style={{
                      backgroundColor: sub.bg, borderRadius: 8,
                      paddingHorizontal: 8, paddingVertical: 3,
                    }}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: sub.color }}>{sub.desc}</Text>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: sub.color, textAlign: 'right' }}>
                      {sub.label}
                    </Text>
                  </View>
                  {/* بطاقات القائمة */}
                  {sub.items?.map((item, j) => (
                    <View key={j} style={{
                      flexDirection: 'row', alignItems: 'center', gap: 10,
                      paddingVertical: 7, paddingHorizontal: 4,
                      borderBottomWidth: j < sub.items.length - 1 ? 1 : 0,
                      borderBottomColor: '#F4F7FB',
                    }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: theme.text2 || '#0D1B2A', textAlign: 'right' }}>
                          {item.title}
                        </Text>
                        <Text style={{ fontSize: 9, color: '#6B7C93', textAlign: 'right', marginTop: 1 }}>
                          {item.desc}
                        </Text>
                      </View>
                      <View style={{
                        width: 28, height: 28, borderRadius: 8,
                        backgroundColor: sub.bg, alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: sub.color }}>{item.icon}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </Section>
          )}

          {/* قطع الغيار */}
          {spareParts.length > 0 && (
            <Section title="🔩 قطع الغيار المطلوبة" color="#0A7A3C">
              {spareParts.map((part, i) => (
                <View key={i} style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
                  paddingVertical: 7,
                  borderBottomWidth: i < spareParts.length - 1 ? 1 : 0,
                  borderBottomColor: '#F4F7FB',
                }}>
                  <Text style={{ fontSize: 11, color: theme.text2 || '#0D1B2A', textAlign: 'right', flex: 1 }}>{part}</Text>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#0A7A3C' }} />
                </View>
              ))}
            </Section>
          )}

          {/* طلب بدون قطع غيار */}
          {order.withParts === false && (
            <View style={{
              backgroundColor: theme.bg || '#EEF2F7', borderRadius: 12, padding: 12,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 12,
            }}>
              <Text style={{ fontSize: 11, color: '#6B7C93' }}>طلب بدون قطع غيار</Text>
              <Text style={{ fontSize: 16 }}>🔧</Text>
            </View>
          )}

        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─── الشاشة الرئيسية للطلبات ─────────────────────────────
export default function OrdersScreen({ orders, onBack }) {
  const theme = useTheme();
  const [selected, setSelected] = useState(null);

  // زر الرجوع في الهاتف
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selected !== null) { setSelected(null); return true; }
      if (onBack) { onBack(); return true; }
      return false;
    });
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  if (selected !== null) {
    return <OrderDetail order={orders[selected]} onBack={() => setSelected(null)} />;
  }

  return (
    <View style={[s.screen, { backgroundColor: theme.bg }]}>
      <View style={[s.ordersHeader, { flexDirection:'row', alignItems:'center', justifyContent:'space-between' }]}>
        <View style={{ alignItems:'flex-end' }}>
          <Text style={s.ordersTitle}>📋 الطلبات</Text>
          <Text style={s.ordersSub}>{orders.length} طلب مسجل</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={s.emptyOrders}>
            <Text style={{ fontSize: 50 }}>📋</Text>
            <Text style={s.emptyOrdersTxt}>لا توجد طلبات بعد{'\n'}اضغط + لإنشاء طلب جديد</Text>
          </View>
        ) : orders.map((ord, i) => (
          <TouchableOpacity key={i} style={[s.orderCard, {
            borderRightWidth: 4,
            borderRightColor: STATUS_COLOR[ord.status] || '#DDE4EF',
          }]} activeOpacity={0.82} onPress={() => setSelected(i)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={[s.orderTitle, { color: theme.text }]}>{ord.title}</Text>
                <Text style={s.orderMeta}>{ord.category} • {ord.date}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: STATUS_BG[ord.status] }]}>
                <Text style={[s.badgeTxt, { color: STATUS_COLOR[ord.status] }]}>
                  {STATUS_LABEL[ord.status]}
                </Text>
              </View>
            </View>
            {ord.desc ? <Text style={s.orderDesc} numberOfLines={1}>{ord.desc}</Text> : null}
            <View style={[s.orderFooter, { alignItems: 'center' }]}>
              <Text style={{ color: '#0078FF', fontSize: 10, fontWeight: '600' }}>عرض التفاصيل ›</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {ord.spareParts?.length > 0 && (
                  <Text style={s.orderMeta}>🔩 {ord.spareParts.length} قطعة</Text>
                )}
                {ord.subCategories?.length > 0 && (
                  <Text style={s.orderMeta}>📂 {ord.subCategories.length} قائمة</Text>
                )}
                <Text style={s.orderMeta}>الأولوية: {ord.priority}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}
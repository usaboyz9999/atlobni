import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import s from '../styles';
import SettingsScreen from './SettingsScreen';
import AuthScreen from './AuthScreen';

export default function ProfileScreen({ cartCount, onGoOrders, onGoProduct }) {
  const { user, purchases, wishlist, logout } = useAuth();
  const theme = useTheme();
  const [tab,          setTab]         = useState('profile');
  const [showSettings, setShowSettings]= useState(false);

  if (showSettings) return (
    <SettingsScreen
      onBack={() => setShowSettings(false)}
      onGoOrders={onGoOrders}
    />
  );

  if (!user) return <AuthScreen onSuccess={dest => {
    if (dest === 'settings') setShowSettings(true);
  }} />;

  const menuItems = [
    { icon:'✏️', name:'تعديل الملف الشخصي', desc:'الاسم والبريد والصورة', bg:'#E6F0FF',
      onPress: () => setShowSettings(true) },
    { icon:'📦', name:'طلباتي',              desc:'متابعة حالة الطلبات',   bg:'#E6F7EE',
      onPress: onGoOrders },
    { icon:'🔔', name:'الإشعارات',           desc:'إدارة التنبيهات',        bg:'#FFF8E0',
      onPress: () => setShowSettings(true) },
    { icon:'⚙️', name:'الإعدادات',           desc:'اللغة والمظهر والأمان',  bg:'#F0F4FF',
      onPress: () => setShowSettings(true) },
    { icon:'🚪', name:'تسجيل الخروج',        desc:'الخروج من الحساب الحالي', bg:'#FFF0F0',
      onPress: () => logout(), danger: true },
  ];

  const TABS = [
    ['profile',   'الملف الشخصي'],
    ['purchases', '🛒 مشترياتي'],
    ['wishlist',  '❤️ مفضلتي'],
  ];

  return (
    <View style={{ flex:1, backgroundColor: theme.bg }}>

      {/* هيرو */}
      <View style={s.profileHero}>
        <View style={s.profileAvatarWrap}>
          <View style={s.profileAvatar}>
            <Text style={{ color:'#fff', fontSize:26, fontWeight:'900' }}>
              {user?.avatar || user?.name?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
        </View>
        <Text style={s.profileName}>{user?.name}</Text>
        <Text style={s.profileRole}>{user?.role}</Text>
        <View style={s.profileStatsRow}>
          {[
            [String(cartCount),             'في السلة'],
            [String(purchases?.length || 0),'مشتريات'],
            [String(wishlist?.length || 0), 'مفضلة'],
          ].map(([v,l],i) => (
            <View key={i} style={[s.pStat, i < 2 && { borderRightWidth:1, borderRightColor:'rgba(255,255,255,0.2)' }]}>
              <Text style={s.pStatVal}>{v}</Text>
              <Text style={s.pStatLbl}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* تبويبات */}
      <View style={{ flexDirection:'row', backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#DDE4EF' }}>
        {TABS.map(([t,label]) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={{
            flex:1, paddingVertical:12, alignItems:'center',
            borderBottomWidth:2.5, borderBottomColor: tab===t ? '#0078FF' : 'transparent',
          }}>
            <Text style={{ fontSize:11, fontWeight:'700', color: tab===t ? '#0078FF' : '#6B7C93' }}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false}>

        {/* ── الملف الشخصي ── */}
        {tab === 'profile' && (
          <View style={{ paddingHorizontal:14, paddingTop:14, gap:8 }}>
            {/* بطاقة معلومات */}
            <View style={{
              backgroundColor: theme.card, borderRadius:14, padding:14,
              borderWidth:1, borderColor: theme.border, marginBottom:4,
            }}>
              {[
                ['📧', 'البريد الإلكتروني', user?.email],
                ['📱', 'رقم الجوال',         user?.phone || '—'],
                ['💼', 'المسمى الوظيفي',    user?.role],
              ].map(([icon,label,val]) => (
                <View key={label} style={{
                  flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                  paddingVertical:8, borderBottomWidth:1, borderBottomColor:'#F4F7FB',
                }}>
                  <Text style={{ fontSize:12, color:'#0D1B2A', fontWeight:'600' }}>{val}</Text>
                  <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                    <Text style={{ fontSize:11, color:'#6B7C93' }}>{label}</Text>
                    <Text style={{ fontSize:16 }}>{icon}</Text>
                  </View>
                </View>
              ))}
            </View>

            {menuItems.map((item,i) => (
              <TouchableOpacity key={i} style={[s.profileMenuItem,
                item.danger && { borderWidth:1, borderColor:'#FFD0D0', backgroundColor:'#FFF8F8' }
              ]}
                activeOpacity={0.8} onPress={item.onPress || (() => {})}>
                <View style={[s.profileMenuIcon, { backgroundColor: item.bg }]}>
                  <Text style={{ fontSize:18 }}>{item.icon}</Text>
                </View>
                <View style={{ flex:1 }}>
                  <Text style={[s.profileMenuName, item.danger && { color:'#D32F2F' }]}>{item.name}</Text>
                  {item.desc ? <Text style={s.profileMenuDesc}>{item.desc}</Text> : null}
                </View>
                {!item.danger && <Text style={{ color:'#6B7C93', fontSize:20 }}>›</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── مشترياتي ── */}
        {tab === 'purchases' && (
          <View style={{ padding:14 }}>
            {!purchases?.length ? (
              <View style={{ alignItems:'center', paddingVertical:60 }}>
                <Text style={{ fontSize:50, marginBottom:12 }}>🛒</Text>
                <Text style={{ fontSize:14, color:'#0A2463', fontWeight:'700', marginBottom:6 }}>لا توجد مشتريات</Text>
                <Text style={{ fontSize:11, color:'#6B7C93' }}>اذهب للمتجر وابدأ التسوق</Text>
              </View>
            ) : purchases.map((p,i) => (
              <View key={i} style={{
                backgroundColor: theme.card, borderRadius:14, padding:12,
                borderWidth:1, borderColor: theme.border, marginBottom:10,
                flexDirection:'row', alignItems:'center', gap:12,
              }}>
                <View style={{ width:52, height:52, borderRadius:12, backgroundColor:'#EEF2F7', overflow:'hidden' }}>
                  {p.img
                    ? <Image source={{ uri:p.img }} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
                    : <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                        <Text style={{ fontSize:22 }}>📦</Text>
                      </View>
                  }
                </View>
                <View style={{ flex:1 }}>
                  <Text style={{ fontSize:12, fontWeight:'700', color: theme.text, textAlign:'right' }} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={{ fontSize:9, color:'#6B7C93', textAlign:'right', marginTop:2 }}>
                    {p.cat} • {p.date}
                  </Text>
                  <View style={{ flexDirection:'row', justifyContent:'flex-end', marginTop:4, gap:6 }}>
                    <View style={{ backgroundColor:'#E6F7EE', borderRadius:8, paddingHorizontal:8, paddingVertical:2 }}>
                      <Text style={{ fontSize:9, color:'#0A7A3C', fontWeight:'700' }}>مكتمل ✓</Text>
                    </View>
                    <Text style={{ fontSize:12, fontWeight:'900', color:'#0A2463' }}>{p.price} ر.س</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── مفضلتي ── */}
        {tab === 'wishlist' && (
          <View style={{ padding:14 }}>
            {!wishlist?.length ? (
              <View style={{ alignItems:'center', paddingVertical:60 }}>
                <Text style={{ fontSize:50, marginBottom:12 }}>❤️</Text>
                <Text style={{ fontSize:14, color:'#0A2463', fontWeight:'700', marginBottom:6 }}>المفضلة فارغة</Text>
                <Text style={{ fontSize:11, color:'#6B7C93', textAlign:'center', lineHeight:18 }}>
                  اضغط على ❤️ بجانب أي منتج{'\n'}في المتجر لإضافته للمفضلة
                </Text>
              </View>
            ) : wishlist.map((item,i) => (
              <TouchableOpacity key={item.id||i}
                onPress={() => onGoProduct && onGoProduct(item)}
                activeOpacity={0.85}
                style={{
                  backgroundColor:'#fff', borderRadius:14, padding:12,
                  borderWidth:1, borderColor:'#FFD6D6', marginBottom:10,
                  flexDirection:'row', alignItems:'center', gap:12,
                }}>
                <View style={{ width:52, height:52, borderRadius:12, backgroundColor:'#FFF5F5', overflow:'hidden' }}>
                  {item.img
                    ? <Image source={{ uri:item.img }} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
                    : <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                        <Text style={{ fontSize:22 }}>📦</Text>
                      </View>
                  }
                </View>
                <View style={{ flex:1 }}>
                  <Text style={{ fontSize:12, fontWeight:'700', color: theme.text, textAlign:'right' }} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize:9, color:'#6B7C93', textAlign:'right', marginTop:2 }}>
                    {item.cat}
                  </Text>
                  <Text style={{ fontSize:13, fontWeight:'900', color:'#D32F2F', textAlign:'right', marginTop:4 }}>
                    {item.price} ر.س
                  </Text>
                </View>
                <Text style={{ fontSize:22 }}>❤️</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height:90 }} />
      </ScrollView>
    </View>
  );
}
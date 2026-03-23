import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import s, { FAB_SIZE, NAV_H } from '../styles';

export default function BottomNav({ active, onPress, cartCount }) {
  const { t }  = useLang();
  const theme  = useTheme();

  const leftTabs  = [
    { id:'home',     label:t('home'),     icon:'🏠' },
    { id:'programs', label:t('programs'), icon:'📋' },
  ];
  const rightTabs = [
    { id:'store',   label:t('store'),   icon:'🛒', badge: cartCount },
    { id:'profile', label:t('profile'), icon:'👤' },
  ];

  const renderTab = (tab) => (
    <TouchableOpacity
      key={tab.id}
      style={s.navItem}
      onPress={() => onPress(tab.id)}
      activeOpacity={0.7}
    >
      <View>
        <Text style={{ fontSize: 22 }}>{tab.icon}</Text>
        {tab.badge > 0 && (
          <View style={s.cartBadge}>
            <Text style={{ color:'#fff', fontSize:8, fontWeight:'700' }}>{tab.badge}</Text>
          </View>
        )}
      </View>
      <Text style={[s.navLabel, { color: theme.subText }, active === tab.id && { color:'#0078FF', fontWeight:'700' }]}>
        {tab.label}
      </Text>
      {active === tab.id && <View style={s.navDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={[s.bottomNav, { backgroundColor: theme.navBg }]}>
      {leftTabs.map(renderTab)}
      {/* FAB slot */}
      <View style={s.navFabSlot} />
      {rightTabs.map(renderTab)}

      {/* FAB */}
      <View style={s.fabWrap} pointerEvents="box-none">
        <TouchableOpacity
          style={s.fab}
          onPress={() => onPress('neworder')}
          activeOpacity={0.85}
        >
          <Text style={s.fabPlus}>+</Text>
          <Text style={s.fabLabel}>إنشاء{'\n'}طلب</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
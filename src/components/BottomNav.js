import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import s, { FAB_SIZE, NAV_H } from '../styles';

export default function BottomNav({active,onPress,cartCount}){
  // 2 tabs | FAB slot | 3 tabs
  const {t}=useLang();
  const theme=useTheme();
  const leftTabs =[{id:'home',label:t('home'),icon:'\u{1F3E0}'},{id:'programs',label:t('programs'),icon:'\u{1F4CB}'}];
  const rightTabs=[{id:'store',label:t('store'),icon:'\u{1F6D2}',badge:cartCount},{id:'profile',label:t('profile'),icon:'\u{1F464}'}];
  const renderTab=(tab)=>(
    <TouchableOpacity key={tab.id} style={s.navItem} onPress={()=>onPress(tab.id)} activeOpacity={0.7}>
      <View>
        <Text style={{fontSize:21}}>{tab.icon}</Text>
        {tab.badge>0&&<View style={s.cartBadge}><Text style={{color:'#fff',fontSize:8,fontWeight:'700'}}>{tab.badge}</Text></View>}
      </View>
      <Text style={[s.navLabel,{color:theme.subText},active===tab.id&&{color:'#0078FF',fontWeight:'700'}]}>{tab.label}</Text>
      {active===tab.id&&<View style={s.navDot}/>}
    </TouchableOpacity>
  );
  return(
    <View style={[s.bottomNavWrapper,{backgroundColor:theme.navBg}]}>
      <View style={[s.bottomNav,{backgroundColor:theme.navBg,borderTopColor:theme.border}]}>
        {leftTabs.map(renderTab)}
        {/* FAB placeholder slot */}
        <View style={s.navFabSlot}/>
        {rightTabs.map(renderTab)}
      </View>
      {/* FAB sits half-outside on top of nav */}
      <View style={s.fabWrap} pointerEvents="box-none">
        <TouchableOpacity style={s.fab} onPress={()=>onPress('neworder')} activeOpacity={0.85}>
          <Text style={s.fabPlus}>+</Text>
          <Text style={s.fabLabel}>إنشاء{'\n'}طلب</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
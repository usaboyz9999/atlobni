import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';

export default function NotificationsScreen({ onBack }) {
  const [settings, setSettings] = useState({
    orders: true, store: true, programs: false, news: true, email: false,
  });

  const items = [
    { key:'orders',   label:'إشعارات الطلبات',          desc:'عند تحديث حالة الطلب' },
    { key:'store',    label:'عروض المتجر',               desc:'خصومات ومنتجات جديدة' },
    { key:'programs', label:'تذكيرات برامج الصيانة',    desc:'قبل موعد الصيانة بيوم' },
    { key:'news',     label:'أخبار وتحديثات التطبيق',   desc:'مميزات جديدة وإعلانات' },
    { key:'email',    label:'إشعارات البريد الإلكتروني', desc:'نسخة من كل إشعار على بريدك' },
  ];

  return (
    <View style={{ flex:1, backgroundColor:'#EEF2F7' }}>
      <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{
          backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6,
        }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>الإشعارات</Text>
      </View>
      <ScrollView style={{ flex:1 }}>
        <View style={{ padding:14 }}>
          {items.map(item => (
            <View key={item.key} style={{
              backgroundColor:'#fff', borderRadius:14, padding:14,
              flexDirection:'row', alignItems:'center', gap:12,
              borderWidth:1, borderColor:'#DDE4EF', marginBottom:8,
            }}>
              <Switch
                value={settings[item.key]}
                onValueChange={v => setSettings(p => ({ ...p, [item.key]: v }))}
                trackColor={{ false:'#DDE4EF', true:'#0078FF' }}
              />
              <View style={{ flex:1, alignItems:'flex-end' }}>
                <Text style={{ fontSize:13, fontWeight:'700', color:'#0A2463' }}>{item.label}</Text>
                <Text style={{ fontSize:10, color:'#6B7C93', marginTop:2 }}>{item.desc}</Text>
              </View>
              <View style={{ width:40, height:40, borderRadius:12, backgroundColor:'#FFF8E0', alignItems:'center', justifyContent:'center' }}>
                <Text style={{ fontSize:18 }}>🔔</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height:60 }} />
      </ScrollView>
    </View>
  );
}
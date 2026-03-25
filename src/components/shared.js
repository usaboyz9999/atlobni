import React from 'react';
import { View, Text } from 'react-native';
import s from '../styles';

export function Stars({ count }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <Text key={i} style={{ fontSize: 10, color: i <= count ? '#F5A200' : '#DDD' }}>★</Text>
      ))}
    </View>
  );
}

export function Badge({ text, color, bg }) {
  return (
    <View style={[s.badge, { backgroundColor: bg }]}>
      <Text style={[s.badgeTxt, { color }]}>{text}</Text>
    </View>
  );
}

export function Chip({ text }) {
  return (
    <View style={s.chip}>
      <Text style={s.chipTxt}>{text}</Text>
    </View>
  );
}

export function SHead({ title }) {
  return (
    <View style={s.secHead}>
      <Text style={s.secHeadTxt}>{title}</Text>
    </View>
  );
}

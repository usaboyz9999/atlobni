import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Badge } from '../components/shared';
import s from '../styles';
import { CATEGORIES } from '../data/categories';
import { STORE_ITEMS } from '../data/storeData';

export default function SearchScreen({ onSelectCategory }) {
  const [query, setQuery] = useState('');

  const all = [
    ...CATEGORIES.map(c => ({ name: c.label, id: c.id, type: 'تخصص', code: c.id })),
    ...STORE_ITEMS.map(i => ({ name: i.name, id: i.code, type: 'قطعة غيار', code: i.code })),
  ];

  const results = query.length > 0
    ? all.filter(i => i.name.includes(query) || i.id.toLowerCase().includes(query.toLowerCase()))
    : [];

  const suggestions = ['كهرباء', 'سباكة', 'تكييف', 'حريق', 'مضخة', 'MCB', 'سلامة', 'مصعد'];

  return (
    <View style={s.screen}>
      <View style={s.searchScreen}>
        <Text style={s.searchTitle}>البحث</Text>
        <View style={s.searchBoxDark}>
          <TextInput
            style={s.searchInput}
            placeholder="ابحث هنا..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={query}
            onChangeText={setQuery}
            textAlign="right"
          />
        </View>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        {query.length === 0 && (
          <View>
            <Text style={[s.secHeadTxt, { padding: 14, paddingBottom: 6 }]}>اقتراحات سريعة</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, paddingBottom: 12 }}>
              {suggestions.map(sg => (
                <TouchableOpacity key={sg} style={s.suggestChip} onPress={() => setQuery(sg)}>
                  <Text style={s.suggestTxt}>{sg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {results.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={s.resultRow}
            onPress={() => r.type === 'تخصص' && onSelectCategory(r.id)}
            activeOpacity={0.8}
          >
            <View>
              <Text style={s.mcardName}>{r.name}</Text>
              <Text style={s.mcardFreq}>{r.code}</Text>
            </View>
            <Badge
              text={r.type}
              color={r.type === 'تخصص' ? '#0043B0' : '#0A7A3C'}
              bg={r.type === 'تخصص' ? '#E6F0FF' : '#E6F7EE'}
            />
          </TouchableOpacity>
        ))}

        {query.length > 0 && results.length === 0 && (
          <View style={{ padding: 30, alignItems: 'center' }}>
            <Text style={{ color: '#6B7C93', fontSize: 13 }}>لا توجد نتائج</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function UserBar({ onLogout, onProfile }) {
  const { user, logout } = useAuth();
  const theme = useTheme();
  if (!user) return null;

  function handleLogout() { logout(); onLogout?.(); }

  return (
    <View style={{
      backgroundColor: theme.card,
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 14, paddingVertical: 10,
      justifyContent: 'space-between',
      borderBottomWidth: 1, borderBottomColor: theme.border,
    }}>
      {/* زر خروج */}
      <TouchableOpacity onPress={handleLogout} style={{
        backgroundColor: '#FFF0F0', borderRadius: 10,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1, borderColor: '#FFD0D0',
      }}>
        <Text style={{ color: '#D32F2F', fontSize: 11, fontWeight: '700' }}>خروج 🚪</Text>
      </TouchableOpacity>

      {/* مرحبا + اسم + أفاتار */}
      <TouchableOpacity onPress={onProfile}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: theme.subText, fontSize: 10 }}>مرحباً 👋</Text>
          <Text style={{ color: theme.text, fontSize: 13, fontWeight: '800' }}>{user.name}</Text>
        </View>
        <View style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: '#0A2463',
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 2, borderColor: '#E6F0FF',
        }}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '900' }}>
            {user.avatar || user.name?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
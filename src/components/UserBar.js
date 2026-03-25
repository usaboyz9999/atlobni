import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function UserBar({ onLogout, onProfile, showWallet = false }) {
  const { user, logout, wallet, points } = useAuth();
  const theme = useTheme();
  if (!user) return null;

  return (
    <View style={{
      backgroundColor: theme.card,
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 14, paddingVertical: 10,
      justifyContent: 'space-between',
      borderBottomWidth: 1, borderBottomColor: theme.border,
    }}>
      {/* يسار: خروج */}
      <TouchableOpacity onPress={() => { logout(); onLogout?.(); }} style={{
        backgroundColor: '#FFF0F0', borderRadius: 10,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1, borderColor: '#FFD0D0',
      }}>
        <Text style={{ color: '#D32F2F', fontSize: 11, fontWeight: '700' }}>خروج 🚪</Text>
      </TouchableOpacity>

      {/* يمين: الاسم + رصيد */}
      <TouchableOpacity onPress={onProfile}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {showWallet && (
              <View style={{
                backgroundColor: '#E6F7EE', borderRadius: 8,
                paddingHorizontal: 7, paddingVertical: 2,
                flexDirection: 'row', alignItems: 'center', gap: 3,
              }}>
                <Text style={{ fontSize: 9, color: '#0A7A3C', fontWeight: '800' }}>
                  ({wallet.toFixed(0)} ر.س)
                </Text>
                <Text style={{ fontSize: 10 }}>💳</Text>
              </View>
            )}
            <Text style={{ color: theme.text, fontSize: 13, fontWeight: '800' }}>{user.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <Text style={{ color: theme.subText, fontSize: 9 }}>⭐ {points} نقطة</Text>
            <Text style={{ color: theme.subText, fontSize: 10 }}>مرحباً 👋</Text>
          </View>
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
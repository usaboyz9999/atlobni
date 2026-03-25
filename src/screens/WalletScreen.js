import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { showAlert } from '../components/alertBridge';

const AMOUNTS = [50, 100, 200, 500, 1000];

export default function WalletScreen({ onBack }) {
  const { wallet, points, txHistory, addWalletBalance } = useAuth();
  const theme = useTheme();
  const [tab,        setTab]        = useState('wallet'); // wallet | points | history
  const [customAmt,  setCustomAmt]  = useState('');

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { onBack(); return true; });
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAddBalance(amount) {
    showAlert(
      '💳 تأكيد الشحن',
      `هل تريد شحن ${amount} ر.س في محفظتك؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'شحن الآن', onPress: () => {
          addWalletBalance(amount, `شحن ${amount} ر.س`);
          showAlert('✅ تم الشحن', `تم إضافة ${amount} ر.س إلى محفظتك\nالرصيد الحالي: ${wallet + amount} ر.س`);
        }},
      ]
    );
  }

  function handleCustomAdd() {
    const amt = parseFloat(customAmt);
    if (!amt || amt <= 0) { showAlert('تنبيه', 'أدخل مبلغاً صحيحاً'); return; }
    handleAddBalance(amt);
    setCustomAmt('');
  }

  const typeLabels = {
    credit:        { label:'شحن رصيد',     color:'#0A7A3C', icon:'➕' },
    debit:         { label:'خصم',           color:'#D32F2F', icon:'➖' },
    points_credit: { label:'نقاط مكتسبة',  color:'#B05200', icon:'⭐' },
    points_debit:  { label:'استبدال نقاط', color:'#7B1FA2', icon:'🎁' },
  };

  return (
    <View style={{ flex:1, backgroundColor: theme.bg }}>
      {/* رأس */}
      <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{
          backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6,
        }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>
          💼 المحفظة والنقاط
        </Text>
      </View>

      {/* بطاقات الرصيد */}
      <View style={{ flexDirection:'row', margin:14, gap:10 }}>
        {/* المحفظة */}
        <View style={{ flex:1, backgroundColor:'#0A2463', borderRadius:18, padding:14 }}>
          <Text style={{ color:'rgba(255,255,255,0.7)', fontSize:10, textAlign:'right', marginBottom:4 }}>رصيد المحفظة</Text>
          <Text style={{ color:'#fff', fontSize:22, fontWeight:'900', textAlign:'right' }}>{wallet.toFixed(2)}</Text>
          <Text style={{ color:'rgba(255,255,255,0.7)', fontSize:11, textAlign:'right' }}>ريال سعودي</Text>
          <Text style={{ fontSize:28, marginTop:6 }}>💳</Text>
        </View>
        {/* النقاط */}
        <View style={{ flex:1, backgroundColor:'#B05200', borderRadius:18, padding:14 }}>
          <Text style={{ color:'rgba(255,255,255,0.7)', fontSize:10, textAlign:'right', marginBottom:4 }}>نقاط المكافأة</Text>
          <Text style={{ color:'#fff', fontSize:22, fontWeight:'900', textAlign:'right' }}>{points}</Text>
          <Text style={{ color:'rgba(255,255,255,0.7)', fontSize:11, textAlign:'right' }}>نقطة = {points} ر.س</Text>
          <Text style={{ fontSize:28, marginTop:6 }}>⭐</Text>
        </View>
      </View>

      {/* تبويبات */}
      <View style={{ flexDirection:'row', backgroundColor: theme.card, borderBottomWidth:1, borderBottomColor: theme.border }}>
        {[['wallet','شحن المحفظة'],['points','النقاط'],['history','السجل']].map(([t,l]) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={{
            flex:1, paddingVertical:11, alignItems:'center',
            borderBottomWidth:2.5, borderBottomColor: tab===t ? '#0078FF' : 'transparent',
          }}>
            <Text style={{ fontSize:11, fontWeight:'700', color: tab===t ? '#0078FF' : theme.subText }}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false}>

        {/* ── شحن المحفظة ── */}
        {tab === 'wallet' && (
          <View style={{ padding:14 }}>
            <Text style={{ fontSize:13, fontWeight:'700', color: theme.text, textAlign:'right', marginBottom:12 }}>
              اختر مبلغ الشحن
            </Text>
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10, marginBottom:16 }}>
              {AMOUNTS.map(amt => (
                <TouchableOpacity key={amt} onPress={() => handleAddBalance(amt)} style={{
                  backgroundColor:'#0A2463', borderRadius:12,
                  paddingHorizontal:16, paddingVertical:10, minWidth:80, alignItems:'center',
                }}>
                  <Text style={{ color:'#fff', fontSize:13, fontWeight:'800' }}>{amt}</Text>
                  <Text style={{ color:'rgba(255,255,255,0.7)', fontSize:9 }}>ريال</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* مبلغ مخصص */}
            <View style={{ backgroundColor: theme.card, borderRadius:14, padding:14, borderWidth:1, borderColor: theme.border }}>
              <Text style={{ fontSize:12, fontWeight:'700', color: theme.text, textAlign:'right', marginBottom:8 }}>
                مبلغ مخصص
              </Text>
              <View style={{ flexDirection:'row', gap:8 }}>
                <TouchableOpacity onPress={handleCustomAdd} style={{
                  backgroundColor:'#0A2463', borderRadius:10, paddingHorizontal:16, paddingVertical:11,
                }}>
                  <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>شحن</Text>
                </TouchableOpacity>
                <TextInput
                  value={customAmt}
                  onChangeText={setCustomAmt}
                  placeholder="أدخل المبلغ"
                  placeholderTextColor={theme.subText}
                  keyboardType="numeric"
                  style={{
                    flex:1, backgroundColor: theme.bg, borderRadius:10,
                    paddingHorizontal:12, paddingVertical:10, fontSize:14,
                    color: theme.text, textAlign:'right',
                    borderWidth:1.5, borderColor: theme.border,
                  }}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>

            {/* معلومات */}
            <View style={{ backgroundColor:'#E6F0FF', borderRadius:12, padding:12, marginTop:14, borderWidth:1, borderColor:'#0043B033' }}>
              <Text style={{ fontSize:11, color:'#0043B0', textAlign:'right', lineHeight:18 }}>
                💡 كل 100 ريال شراء تكسبك نقطة واحدة{'\n'}
                💡 10000 نقطة = 100 ريال خصم{'\n'}
                💡 يمكن استخدام المحفظة للدفع الجزئي أو الكامل
              </Text>
            </View>
          </View>
        )}

        {/* ── النقاط ── */}
        {tab === 'points' && (
          <View style={{ padding:14 }}>
            <View style={{
              backgroundColor:'#FFF8E0', borderRadius:16, padding:16,
              borderWidth:1, borderColor:'#B0520033', marginBottom:16,
            }}>
              <Text style={{ fontSize:14, fontWeight:'900', color:'#B05200', textAlign:'right', marginBottom:6 }}>
                ⭐ رصيد النقاط
              </Text>
              <Text style={{ fontSize:32, fontWeight:'900', color:'#B05200', textAlign:'right' }}>{points}</Text>
              <Text style={{ fontSize:11, color:'#B05200', textAlign:'right', marginTop:4 }}>
                نقطة = {points} ر.س قيمة الاستبدال
              </Text>
            </View>

            {/* كيف تكسب نقاط */}
            <View style={{ backgroundColor: theme.card, borderRadius:14, padding:14, borderWidth:1, borderColor: theme.border, marginBottom:12 }}>
              <Text style={{ fontSize:13, fontWeight:'800', color: theme.text, textAlign:'right', marginBottom:10 }}>
                كيف تكسب نقاطاً؟
              </Text>
              {[
                ['🛒', 'كل 100 ريال شراء → نقطة واحدة'],
                ['🏷️', 'الشراء بدون كوبون → نقاط أكثر'],
                ['⭐', '10000 نقطة = 100 ريال للاستبدال'],
              ].map(([icon, text], i) => (
                <View key={i} style={{ flexDirection:'row', alignItems:'center', justifyContent:'flex-end', gap:8, marginBottom:8 }}>
                  <Text style={{ fontSize:12, color: theme.subText }}>{text}</Text>
                  <Text style={{ fontSize:18 }}>{icon}</Text>
                </View>
              ))}
            </View>

            {/* استبدال النقاط */}
            {points >= 100 ? (
              <View style={{
                backgroundColor:'#E6F7EE', borderRadius:14, padding:14,
                borderWidth:1, borderColor:'#0A7A3C33',
              }}>
                <Text style={{ fontSize:13, fontWeight:'800', color:'#0A7A3C', textAlign:'right', marginBottom:6 }}>
                  🎁 لديك نقاط كافية للاستبدال!
                </Text>
                <Text style={{ fontSize:11, color:'#0A7A3C', textAlign:'right' }}>
                  استخدم نقاطك عند تأكيد الطلب في السلة
                </Text>
              </View>
            ) : (
              <View style={{
                backgroundColor:'#F4F7FB', borderRadius:14, padding:14,
                borderWidth:1, borderColor: theme.border,
              }}>
                <Text style={{ fontSize:12, color: theme.subText, textAlign:'right' }}>
                  تحتاج {100 - points} نقطة إضافية للوصول للحد الأدنى للاستبدال (100 نقطة)
                </Text>
                <View style={{ height:6, backgroundColor: theme.border, borderRadius:3, marginTop:8 }}>
                  <View style={{
                    height:6, borderRadius:3, backgroundColor:'#B05200',
                    width: `${Math.min(100, points)}%`,
                  }} />
                </View>
              </View>
            )}
          </View>
        )}

        {/* ── السجل ── */}
        {tab === 'history' && (
          <View style={{ padding:14 }}>
            {!txHistory.length ? (
              <View style={{ alignItems:'center', paddingVertical:60 }}>
                <Text style={{ fontSize:40, marginBottom:10 }}>📋</Text>
                <Text style={{ fontSize:13, color: theme.subText }}>لا توجد معاملات بعد</Text>
              </View>
            ) : txHistory.map((tx, i) => {
              const info = typeLabels[tx.type] || { label: tx.type, color:'#0A2463', icon:'📌' };
              const isCredit = tx.type === 'credit' || tx.type === 'points_credit';
              return (
                <View key={tx.id || i} style={{
                  backgroundColor: theme.card, borderRadius:14, padding:12, marginBottom:8,
                  borderWidth:1, borderColor: theme.border,
                  flexDirection:'row', alignItems:'center', gap:10,
                }}>
                  <View style={{ alignItems:'flex-start' }}>
                    <Text style={{ fontSize:12, fontWeight:'900', color: isCredit ? '#0A7A3C' : '#D32F2F' }}>
                      {isCredit ? '+' : '-'}{tx.amount} {tx.type.includes('points') ? 'نقطة' : 'ر.س'}
                    </Text>
                    <Text style={{ fontSize:9, color: theme.subText, marginTop:1 }}>{tx.date}</Text>
                  </View>
                  <View style={{ flex:1 }}>
                    <Text style={{ fontSize:11, fontWeight:'700', color: theme.text, textAlign:'right' }}>{tx.note}</Text>
                    <Text style={{ fontSize:9, color: info.color, textAlign:'right', marginTop:2 }}>{info.label}</Text>
                  </View>
                  <View style={{
                    width:36, height:36, borderRadius:18,
                    backgroundColor: isCredit ? '#E6F7EE' : '#FFF0F0',
                    alignItems:'center', justifyContent:'center',
                  }}>
                    <Text style={{ fontSize:16 }}>{info.icon}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height:120 }} />
      </ScrollView>
    </View>
  );
}
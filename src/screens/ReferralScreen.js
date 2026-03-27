import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Share,
  BackHandler, Clipboard, TextInput, Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { showAlert } from '../components/alertBridge';
import { REFERRAL_POINTS } from '../context/AuthContext';

function validateFormat(code) {
  return /^[A-Za-z]{4}[0-9]{4}$/.test(code.trim());
}

export default function ReferralScreen({ onBack }) {
  const theme = useTheme();
  const {
    referralCode, customCodeSet,
    initReferralCode, setCustomReferralCode,
    usedReferrals, points,
  } = useAuth();

  const [copied,      setCopied]      = useState(false);
  const [customOpen,  setCustomOpen]  = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [inputError,  setInputError]  = useState('');
  const [inputHint,   setInputHint]   = useState('');
  const [submitting,  setSubmitting]  = useState(false);

  const inputRef  = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const myCode = referralCode;
  const canSetCustom = !customCodeSet;

  function handleInputChange(text) {
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '').slice(0, 8);
    setCustomInput(cleaned);
    setInputError('');
    const len = cleaned.length;
    if (len === 0)    { setInputHint(''); return; }
    if (len < 4)      { setInputHint(`${4 - len} حرف إنجليزي متبقٍ`); }
    else if (len < 8) { setInputHint(`${8 - len} رقم متبقٍ`); }
    else              { setInputHint(validateFormat(cleaned) ? '✅ الصيغة صحيحة' : '⚠️ تأكد: 4 حروف أولاً ثم 4 أرقام'); }
  }

  function shakeField() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:  8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:  5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:  0, duration: 40, useNativeDriver: true }),
    ]).start();
  }

  function handleApplyCustom() {
    const val = customInput.trim().toUpperCase();
    if (!validateFormat(val)) {
      setInputError('الكود يجب أن يتكون من 4 حروف إنجليزية ثم 4 أرقام\nمثال: SALE1234');
      shakeField();
      return;
    }
    const confirmMsg = myCode
      ? 'سيتم استبدال كودك العشوائي بالكود:\n\n"' + val + '"\n\n⚠️ لا يمكن التراجع أو التغيير لاحقاً.\n\nهل أنت متأكد؟'
      : 'سيتم تفعيل الكود المخصص:\n\n"' + val + '"\n\n⚠️ لا يمكن تغييره بعد التفعيل نهائياً.\n\nهل أنت متأكد؟';

    showAlert('⚠️ تأكيد الكود المخصص', confirmMsg, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تفعيل الكود',
        onPress: () => {
          setSubmitting(true);
          const result = setCustomReferralCode(val);
          setSubmitting(false);
          if (result.success) {
            setCustomOpen(false);
            setCustomInput('');
            setInputError('');
            setInputHint('');
            showAlert('✅ تم التفعيل', 'تم تفعيل كودك المخصص "' + result.code + '" بنجاح!\n\n🔒 لا يمكن تغييره لاحقاً.');
          } else {
            setInputError(result.error);
            shakeField();
          }
        },
      },
    ]);
  }

  function handleGenerateAuto() {
    showAlert(
      '⚠️ تنبيه مهم',
      'سيتم إنشاء كود عشوائي (ATLOB + 4 أرقام).\n\nيمكنك لاحقاً استبداله بكود مخصص من اختيارك.\n\nهل تريد المتابعة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'إنشاء تلقائي', onPress: () => { initReferralCode(); } },
      ]
    );
  }

  function copyCode() {
    if (!myCode) return;
    Clipboard.setString(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    showAlert('✅ تم النسخ', 'تم نسخ كود الإحالة "' + myCode + '" — شاركه مع أصدقائك!');
  }

  function shareCode() {
    if (!myCode) return;
    Share.share({
      message: 'انضم لتطبيق اطلبني!\n\nاستخدم كود الإحالة: ' + myCode + '\nوحصل على مكافأة ترحيبية عند التسجيل 🎁',
      title: 'دعوة لتطبيق اطلبني',
    });
  }

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (customOpen) {
        setCustomOpen(false); setCustomInput(''); setInputError(''); setInputHint('');
        return true;
      }
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [customOpen]);

  const totalEarned = usedReferrals.length * REFERRAL_POINTS;

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F7FF' }}>
      <View style={{ backgroundColor: '#0A2463', padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity
          onPress={() => {
            if (customOpen) { setCustomOpen(false); setCustomInput(''); setInputError(''); setInputHint(''); return; }
            onBack();
          }}
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
            {customOpen ? '← رجوع' : 'رجوع'}
          </Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '900', flex: 1, textAlign: 'right' }}>
          🎁 نظام الإحالة
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={{ margin: 14 }}>
          <View style={{
            backgroundColor: '#0A2463', borderRadius: 20, padding: 22,
            alignItems: 'center', elevation: 8,
            shadowColor: '#0A2463', shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35, shadowRadius: 12,
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 14 }}>
              كود الإحالة الخاص بك
            </Text>

            {myCode ? (
              <>
                <TouchableOpacity onPress={copyCode} style={{
                  backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16,
                  paddingHorizontal: 24, paddingVertical: 14, borderWidth: 2,
                  borderColor: customCodeSet ? '#FFD166' : 'rgba(255,255,255,0.3)',
                  marginBottom: 6, alignItems: 'center', justifyContent: 'center',
                  minWidth: 200,
                }}>
                  <Text style={{ color: '#FFD166', fontSize: 28, fontWeight: '900', letterSpacing: 4 }}>
                    {myCode}
                  </Text>
                </TouchableOpacity>

                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, marginBottom: 16, textAlign: 'center' }}>
                  {customCodeSet ? '🔒 كود مخصص — لا يمكن تغييره' : '🔄 كود عشوائي — يمكن استبداله بكود مخصص'}
                </Text>

                <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginBottom: canSetCustom ? 20 : 0 }}>
                  <TouchableOpacity onPress={copyCode} style={{
                    flex: 1, backgroundColor: copied ? '#0A7A3C' : 'rgba(255,255,255,0.2)',
                    borderRadius: 12, paddingVertical: 11, alignItems: 'center',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
                  }}>
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                      {copied ? '✅ تم النسخ' : '📋 نسخ الكود'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={shareCode} style={{
                    flex: 1, backgroundColor: '#0078FF',
                    borderRadius: 12, paddingVertical: 11, alignItems: 'center',
                  }}>
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>📤 مشاركة</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={{
                  backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14,
                  paddingHorizontal: 24, paddingVertical: 16, borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.15)', borderStyle: 'dashed',
                  marginBottom: 14, alignItems: 'center', width: '100%',
                }}>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 30, marginBottom: 6 }}>🎁</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center' }}>
                    لم يتم إنشاء كود إحالة بعد
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleGenerateAuto}
                  style={{
                    width: '100%', backgroundColor: 'rgba(255,255,255,0.13)',
                    borderRadius: 12, paddingVertical: 13, alignItems: 'center',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
                    ✨ إنشاء كود عشوائي
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 2 }}>
                    ATLOB + 4 أرقام عشوائية
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {canSetCustom && (
              <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                    {myCode ? 'استبدل بكود مخصص' : 'أو أنشئ كوداً مخصصاً'}
                  </Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </View>

                {!customOpen ? (
                  <TouchableOpacity
                    onPress={() => { setCustomOpen(true); setTimeout(() => inputRef.current?.focus(), 200); }}
                    style={{
                      width: '100%', backgroundColor: '#FFD166',
                      borderRadius: 12, paddingVertical: 13, alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#0A2463', fontSize: 14, fontWeight: '900' }}>
                      ✏️ {myCode ? 'استبدل بكود مخصص' : 'إنشاء كود مخصص'}
                    </Text>
                    <Text style={{ color: '#0A2463', fontSize: 10, opacity: 0.6, marginTop: 2 }}>
                      4 حروف + 4 أرقام — مثال: SALE1234
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: '100%', paddingHorizontal: 10 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '700', marginBottom: 10, textAlign: 'center' }}>
                      {myCode ? 'اكتب الكود المخصص الجديد' : 'اكتب كودك المخصص'}
                    </Text>

                    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                      <View style={{
                        backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, borderWidth: 2,
                        borderColor: inputError
                          ? '#FF6B6B'
                          : (customInput.length === 8 && validateFormat(customInput) ? '#4ADE80' : 'rgba(255,255,255,0.2)'),
                        marginBottom: 8, overflow: 'hidden',
                        width: '100%',
                      }}>
                        <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.07)' }}>
                          <View style={{
                            height: 3,
                            width: ((customInput.length / 8) * 100) + '%',
                            backgroundColor: (customInput.length === 8 && validateFormat(customInput)) ? '#4ADE80' : '#FFD166',
                          }} />
                        </View>

                        <View style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          paddingHorizontal: 10, 
                          paddingVertical: 12, 
                          justifyContent: 'center', 
                          gap: 4,
                          flexWrap: 'wrap'
                        }}>
                          <View style={{ flexDirection: 'row', gap: 4 }}>
                            {[0, 1, 2, 3].map(i => {
                              const ch = customInput.toUpperCase()[i] || '';
                              const ok = /[A-Z]/.test(ch);
                              return (
                                <View key={i} style={{
                                  width: 30, height: 38, borderRadius: 7,
                                  backgroundColor: ch ? (ok ? 'rgba(255,209,102,0.2)' : 'rgba(255,107,107,0.25)') : 'rgba(255,255,255,0.06)',
                                  borderWidth: 1.5, borderColor: ch ? (ok ? '#FFD166' : '#FF6B6B') : 'rgba(255,255,255,0.13)',
                                  alignItems: 'center', justifyContent: 'center',
                                }}>
                                  <Text style={{ color: ch ? (ok ? '#FFD166' : '#FF6B6B') : 'rgba(255,255,255,0.18)', fontSize: 14, fontWeight: '800' }}>
                                    {ch || '–'}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>

                          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 16, marginHorizontal: 2 }}>–</Text>

                          <View style={{ flexDirection: 'row', gap: 4 }}>
                            {[4, 5, 6, 7].map(i => {
                              const ch = customInput[i] || '';
                              const ok = /[0-9]/.test(ch);
                              return (
                                <View key={i} style={{
                                  width: 30, height: 38, borderRadius: 7,
                                  backgroundColor: ch ? (ok ? 'rgba(255,255,255,0.13)' : 'rgba(255,107,107,0.25)') : 'rgba(255,255,255,0.06)',
                                  borderWidth: 1.5, borderColor: ch ? (ok ? 'rgba(255,255,255,0.4)' : '#FF6B6B') : 'rgba(255,255,255,0.13)',
                                  alignItems: 'center', justifyContent: 'center',
                                }}>
                                  <Text style={{ color: ch ? (ok ? '#fff' : '#FF6B6B') : 'rgba(255,255,255,0.18)', fontSize: 14, fontWeight: '800' }}>
                                    {ch || '–'}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </View>

                        <TextInput
                          ref={inputRef}
                          value={customInput}
                          onChangeText={handleInputChange}
                          autoCapitalize="characters"
                          autoCorrect={false}
                          maxLength={8}
                          style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }}
                        />
                      </View>
                    </Animated.View>

                    {inputError ? (
                      <Text style={{ color: '#FF6B6B', fontSize: 10, textAlign: 'center', marginBottom: 10, lineHeight: 16, paddingHorizontal: 10 }}>
                        {'⚠️ ' + inputError}
                      </Text>
                    ) : inputHint ? (
                      <Text style={{ color: inputHint.startsWith('✅') ? '#4ADE80' : 'rgba(255,255,255,0.45)', fontSize: 10, textAlign: 'center', marginBottom: 10, paddingHorizontal: 10 }}>
                        {inputHint}
                      </Text>
                    ) : <View style={{ height: 18 }} />}

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => { setCustomOpen(false); setCustomInput(''); setInputError(''); setInputHint(''); }}
                        style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>إلغاء</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleApplyCustom}
                        disabled={submitting || customInput.length < 8}
                        style={{
                          flex: 2, borderRadius: 12, paddingVertical: 12, alignItems: 'center',
                          backgroundColor: (customInput.length === 8 && validateFormat(customInput)) ? '#FFD166' : 'rgba(255,255,255,0.13)',
                          opacity: customInput.length < 8 ? 0.5 : 1,
                        }}>
                        <Text style={{ color: (customInput.length === 8 && validateFormat(customInput)) ? '#0A2463' : '#fff', fontSize: 13, fontWeight: '900' }}>
                          {submitting ? '⏳ جاري التفعيل...' : '🔒 تفعيل الكود'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, marginTop: 8, textAlign: 'center', paddingHorizontal: 10 }}>
                      {myCode
                        ? '⚠️ سيستبدل هذا الكود الكود العشوائي نهائياً'
                        : '🔒 بعد التفعيل لا يمكن تغيير الكود'}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {customCodeSet && (
              <View style={{
                marginTop: 16, backgroundColor: 'rgba(74,222,128,0.1)', borderRadius: 10,
                padding: 10, borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)', width: '100%',
              }}>
                <Text style={{ color: '#4ADE80', fontSize: 10, textAlign: 'center' }}>
                  ✅ تم تفعيل كودك المخصص — لا يمكن تغييره
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 14, marginBottom: 14 }}>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E0E7FF' }}>
            <Text style={{ fontSize: 26, fontWeight: '900', color: '#0A2463' }}>{usedReferrals.length}</Text>
            <Text style={{ fontSize: 10, color: '#888', marginTop: 3 }}>إحالة ناجحة</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#FFF8E0', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#B0520033' }}>
            <Text style={{ fontSize: 26, fontWeight: '900', color: '#B05200' }}>{totalEarned}</Text>
            <Text style={{ fontSize: 10, color: '#B05200', marginTop: 3 }}>نقاط مكسوبة</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#E6F7EE', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#0A7A3C33' }}>
            <Text style={{ fontSize: 26, fontWeight: '900', color: '#0A7A3C' }}>{points}</Text>
            <Text style={{ fontSize: 10, color: '#0A7A3C', marginTop: 3 }}>إجمالي نقاطي</Text>
          </View>
        </View>

        <View style={{ margin: 14, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E0E7FF' }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0A2463', textAlign: 'right', marginBottom: 16 }}>
            ⭐ كيف تعمل الإحالة؟
          </Text>
          {[
            { icon: '📤', title: 'شارك كودك', desc: 'أرسل كود الإحالة لأصدقائك أو عائلتك' },
            { icon: '📲', title: 'يسجّلون في التطبيق', desc: 'يقوم صديقك بالتسجيل ويدخل كودك في حقل الإحالة' },
            { icon: '⭐', title: 'تحصل على نقاط', desc: `تحصل على ${REFERRAL_POINTS} نقاط مكافأة لكل إحالة ناجحة` },
            { icon: '🎁', title: 'استبدل النقاط', desc: 'استخدم نقاطك كخصم عند الشراء من المتجر' },
          ].map((step, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14, paddingBottom: i < 3 ? 14 : 0, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: '#F0F4FF' }}>
              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A2463' }}>{step.title}</Text>
                <Text style={{ fontSize: 11, color: '#666', marginTop: 3, textAlign: 'right', lineHeight: 17 }}>{step.desc}</Text>
              </View>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#E6F0FF', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 22 }}>{step.icon}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginHorizontal: 14, marginBottom: 14, backgroundColor: '#FFF8E0', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#B0520033' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#B05200', textAlign: 'right', marginBottom: 8 }}>
            📋 شروط الإحالة
          </Text>
          {[
            `النقاط تُضاف فوراً لكل إحالة ناجحة (${REFERRAL_POINTS} نقاط)`,
            'الكود العشوائي: ATLOB + 4 أرقام — يمكن استبداله بكود مخصص لمرة واحدة',
            'الكود المخصص: 4 حروف إنجليزية + 4 أرقام — لا يمكن تغييره بعد التفعيل',
            'كل جهاز يمكن استخدامه لإحالة واحدة فقط',
            'لا يمكن إحالة نفسك أو استخدام كودك الخاص',
          ].map((rule, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 5 }}>
              <Text style={{ fontSize: 11, color: '#B05200', flex: 1, textAlign: 'right', lineHeight: 17 }}>{rule}</Text>
              <Text style={{ fontSize: 12 }}>•</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}
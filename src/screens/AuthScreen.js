import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { showAlert } from '../components/alertBridge';
import { useAuth } from '../context/AuthContext';
import RegisterSuccessScreen from './RegisterSuccessScreen';

const ROLES = ['مستخدم','مهندس صيانة','مشرف صيانة','فني','مدير مرافق','مالك عقار','أخرى'];

// ─── حقل إدخال مستقل خارج الشاشة ────────────────────────
const Field = ({ label, value, onChange, placeholder, secure, keyboard, error }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ fontSize: 11, fontWeight:'700', color:'#0A2463', textAlign:'right', marginBottom:5 }}>{label}</Text>
    <TextInput
      style={{
        backgroundColor: error ? '#FFF5F5' : '#F4F7FB',
        borderRadius: 12, paddingHorizontal: 14, height: 48,
        fontSize: 13, color: '#0D1B2A', textAlign: 'right',
        borderWidth: 1.5, borderColor: error ? '#E53935' : '#DDE4EF',
      }}
      value={value} onChangeText={onChange}
      placeholder={placeholder} placeholderTextColor="#A0ADBF"
      secureTextEntry={!!secure} keyboardType={keyboard || 'default'}
      underlineColorAndroid="transparent" autoCorrect={false} autoCapitalize="none"
    />
    {error ? <Text style={{ fontSize: 10, color:'#E53935', textAlign:'right', marginTop:3 }}>{error}</Text> : null}
  </View>
);

export default function AuthScreen({ onSuccess }) {
  const { login, register } = useAuth();
  const [mode,       setMode]       = useState('login');
  const [showSuccess,setShowSuccess]= useState(false);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [phone,   setPhone]   = useState('');
  const [role,    setRole]    = useState('مستخدم');
  const [pass,    setPass]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors,  setErrors]  = useState({});
  const [loginErr,setLoginErr]= useState('');

  function clearAll() {
    setName(''); setEmail(''); setPhone(''); setPass(''); setConfirm('');
    setErrors({}); setLoginErr('');
  }

  function switchMode(m) { clearAll(); setMode(m); }

  function handleLogin() {
    setLoginErr('');
    if (!email.trim())    { setLoginErr('يرجى إدخال البريد الإلكتروني'); return; }
    if (!email.includes('@')) { setLoginErr('البريد الإلكتروني غير صحيح'); return; }
    if (!pass.trim())     { setLoginErr('يرجى إدخال كلمة المرور'); return; }
    const result = login(email, pass);
    if (!result.success)  { setLoginErr(result.error); return; }
    onSuccess?.();
  }

  function handleRegister() {
    const e = {};
    if (!name.trim())              e.name    = 'يرجى إدخال الاسم الكامل';
    if (!email.includes('@'))      e.email   = 'البريد الإلكتروني غير صحيح';
    if (!email.trim())             e.email   = 'يرجى إدخال البريد الإلكتروني';
    if (pass.length < 6)           e.pass    = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (pass !== confirm)          e.confirm = 'كلمتا المرور غير متطابقتان';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    const result = register({ name: name.trim(), email, phone, role, password: pass });
    if (!result.success) { setErrors({ email: result.error }); return; }
    setShowSuccess(true);
  }

  function handleForgot() {
    if (!email.trim() || !email.includes('@')) {
      setErrors({ email: 'يرجى إدخال بريد إلكتروني صحيح' }); return;
    }
    showAlert('تم الإرسال ✅', `سيصلك رابط إعادة التعيين على\n${email}`, [
      { text: 'حسناً', onPress: () => switchMode('login') }
    ]);
  }

  if (showSuccess) return <RegisterSuccessScreen onDone={() => onSuccess?.('settings')} />;

  return (
    <KeyboardAvoidingView style={{ flex:1, backgroundColor:'#0A2463' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow:1 }}
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* هيرو */}
        <View style={{ alignItems:'center', paddingTop:52, paddingBottom:28 }}>
          <View style={{
            width:78, height:78, borderRadius:22, backgroundColor:'#0078FF',
            alignItems:'center', justifyContent:'center', marginBottom:12,
            elevation:8, shadowColor:'#0078FF', shadowOffset:{width:0,height:4},
            shadowOpacity:0.5, shadowRadius:10,
          }}>
            <Text style={{ fontSize:38 }}>⚙️</Text>
          </View>
          <Text style={{ color:'#fff', fontSize:24, fontWeight:'900', letterSpacing:1 }}>اطلبني</Text>
          <Text style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginTop:4 }}>
            منصة إدارة التشغيل والصيانة
          </Text>
        </View>

        {/* البطاقة */}
        <View style={{
          flex:1, backgroundColor:'#fff',
          borderTopLeftRadius:28, borderTopRightRadius:28,
          padding:22,
        }}>

          {/* تبويبات */}
          {mode !== 'forgot' && (
            <View style={{
              flexDirection:'row', backgroundColor:'#EEF2F7',
              borderRadius:14, padding:4, marginBottom:20,
            }}>
              {[['login','تسجيل الدخول'],['register','مستخدم جديد']].map(([m,label]) => (
                <TouchableOpacity key={m} onPress={() => switchMode(m)} style={{
                  flex:1, paddingVertical:10, borderRadius:10,
                  backgroundColor: mode===m ? '#0A2463' : 'transparent',
                  alignItems:'center',
                }}>
                  <Text style={{ fontSize:12, fontWeight:'700', color: mode===m ? '#fff' : '#6B7C93' }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── تسجيل الدخول ── */}
          {mode === 'login' && (
            <View>
              {loginErr ? (
                <View style={{
                  backgroundColor:'#FFF5F5', borderRadius:12, padding:12,
                  borderWidth:1, borderColor:'#FFCDD2', marginBottom:14,
                  flexDirection:'row', alignItems:'center', gap:8,
                }}>
                  <Text style={{ fontSize:18 }}>⚠️</Text>
                  <Text style={{ flex:1, fontSize:12, color:'#C62828', textAlign:'right', fontWeight:'600' }}>
                    {loginErr}
                  </Text>
                </View>
              ) : null}
              <Field label="البريد الإلكتروني *" value={email} onChange={setEmail}
                placeholder="example@email.com" keyboard="email-address" />
              <Field label="كلمة المرور *" value={pass} onChange={setPass}
                placeholder="••••••••" secure />
              <TouchableOpacity onPress={() => switchMode('forgot')}
                style={{ alignSelf:'flex-end', marginBottom:16, marginTop:-4 }}>
                <Text style={{ color:'#0078FF', fontSize:11, fontWeight:'600' }}>نسيت كلمة المرور؟</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} style={{
                backgroundColor:'#0A2463', borderRadius:14, paddingVertical:14,
                alignItems:'center', elevation:3,
                shadowColor:'#0A2463', shadowOffset:{width:0,height:3},
                shadowOpacity:0.3, shadowRadius:6,
              }}>
                <Text style={{ color:'#fff', fontSize:14, fontWeight:'800' }}>تسجيل الدخول</Text>
              </TouchableOpacity>
              <View style={{
                marginTop:14, backgroundColor:'#F4F7FB', borderRadius:12,
                padding:10, borderWidth:1, borderColor:'#DDE4EF',
              }}>
                <Text style={{ fontSize:10, color:'#6B7C93', textAlign:'center' }}>
                  حساب المدير: admin@atlobni.com / admin123
                </Text>
              </View>
            </View>
          )}

          {/* ── مستخدم جديد ── */}
          {mode === 'register' && (
            <View>
              <Field label="الاسم الكامل *" value={name} onChange={setName}
                placeholder="أدخل اسمك الكامل" error={errors.name} />
              <Field label="البريد الإلكتروني *" value={email} onChange={setEmail}
                placeholder="example@email.com" keyboard="email-address" error={errors.email} />
              <Field label="رقم الجوال" value={phone} onChange={setPhone}
                placeholder="05XXXXXXXX" keyboard="phone-pad" />
              <Text style={{ fontSize:11, fontWeight:'700', color:'#0A2463', textAlign:'right', marginBottom:8 }}>
                المسمى الوظيفي
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap:8, paddingBottom:12 }}>
                {ROLES.map(r => (
                  <TouchableOpacity key={r} onPress={() => setRole(r)} style={{
                    paddingHorizontal:14, paddingVertical:8, borderRadius:20,
                    backgroundColor: role===r ? '#0A2463' : '#EEF2F7',
                    borderWidth:1.5, borderColor: role===r ? '#0A2463' : '#DDE4EF',
                  }}>
                    <Text style={{ fontSize:11, fontWeight:'600', color: role===r ? '#fff' : '#6B7C93' }}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Field label="كلمة المرور *" value={pass} onChange={setPass}
                placeholder="••••••••" secure error={errors.pass} />
              <Field label="تأكيد كلمة المرور *" value={confirm} onChange={setConfirm}
                placeholder="••••••••" secure error={errors.confirm} />
              <TouchableOpacity onPress={handleRegister} activeOpacity={0.85} style={{
                backgroundColor:'#0A2463', borderRadius:14, paddingVertical:14,
                alignItems:'center', marginTop:4,
              }}>
                <Text style={{ color:'#fff', fontSize:14, fontWeight:'800' }}>إنشاء الحساب</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── نسيت كلمة المرور ── */}
          {mode === 'forgot' && (
            <View>
              <TouchableOpacity onPress={() => switchMode('login')} style={{ marginBottom:14 }}>
                <Text style={{ color:'#0078FF', fontSize:12, fontWeight:'600' }}>← رجوع</Text>
              </TouchableOpacity>
              <Text style={{ fontSize:18, fontWeight:'900', color:'#0A2463', textAlign:'right', marginBottom:6 }}>
                نسيت كلمة المرور؟
              </Text>
              <Text style={{ fontSize:11, color:'#6B7C93', textAlign:'right', marginBottom:18, lineHeight:18 }}>
                أدخل بريدك الإلكتروني وسنرسل رابط إعادة التعيين
              </Text>
              <Field label="البريد الإلكتروني *" value={email} onChange={setEmail}
                placeholder="example@email.com" keyboard="email-address" error={errors.email} />
              <TouchableOpacity onPress={handleForgot} activeOpacity={0.85} style={{
                backgroundColor:'#0A2463', borderRadius:14, paddingVertical:14,
                alignItems:'center', marginTop:8,
              }}>
                <Text style={{ color:'#fff', fontSize:14, fontWeight:'800' }}>إرسال الرابط</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height:30 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
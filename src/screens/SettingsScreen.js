import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, TextInput, Linking,
} from 'react-native';
import { showAlert } from '../components/alertBridge';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TermsScreen from './TermsScreen';

// ─── صف إعداد ───────────────────────────────────────────────
const SettingRow = ({ icon, label, desc, right, onPress, danger, iconBg, theme }) => {
  const t = theme || { card:'#fff', border:'#DDE4EF', text:'#0A2463', subText:'#6B7C93' };
  return (
  <TouchableOpacity
    onPress={onPress || (() => {})}
    activeOpacity={onPress ? 0.82 : 1}
    style={{
      backgroundColor: t.card, borderRadius:14, padding:14,
      flexDirection:'row', alignItems:'center', gap:12,
      borderWidth:1, borderColor: t.border, marginBottom:8,
    }}
  >
    <View style={{ flex:1, alignItems:'flex-end' }}>
      <Text style={{ fontSize:13, fontWeight:'700', color: danger ? '#D32F2F' : t.text }}>{label}</Text>
      {desc ? <Text style={{ fontSize:10, color: t.subText, marginTop:2 }}>{desc}</Text> : null}
    </View>
    <View style={{
      width:40, height:40, borderRadius:12,
      backgroundColor: iconBg || (danger ? '#FFF0F0' : t.card === '#fff' ? '#EEF2F7' : '#2A2A3E'),
      alignItems:'center', justifyContent:'center',
    }}>
      <Text style={{ fontSize:18 }}>{icon}</Text>
    </View>
    {right
      ? <View>{right}</View>
      : onPress
        ? <Text style={{ color:'#C0CADE', fontSize:20 }}>›</Text>
        : null
    }
  </TouchableOpacity>
  );
};

// ─── شاشة تعديل الملف ───────────────────────────────────────
function EditProfileScreen({ onBack }) {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const [name,  setName]  = useState(user?.name  || '');
  const [phone, setPhone] = useState(user?.phone || '');

  function save() {
    if (!name.trim()) { showAlert('تنبيه', 'الاسم لا يمكن أن يكون فارغاً'); return; }
    updateUser({ name: name.trim(), phone: phone.trim(), avatar: name.trim()[0]?.toUpperCase() });showAlert('✅ تم الحفظ', 'تم تحديث بياناتك بنجاح', [{ text: 'حسناً', onPress: onBack }]);
  }

  const Field = ({ label, value, onChange, keyboard }) => (
    <View style={{ marginBottom:14 }}>
      <Text style={{ fontSize:11, fontWeight:'700', color:'#0A2463', textAlign:'right', marginBottom:6 }}>{label}</Text>
      <TextInput
        value={value} onChangeText={onChange}
        keyboardType={keyboard || 'default'}
        style={{
          backgroundColor:'#F4F7FB', borderRadius:12,
          paddingHorizontal:14, height:46,
          fontSize:13, color:'#0D1B2A', textAlign:'right',
          borderWidth:1, borderColor:'#DDE4EF',
        }}
        underlineColorAndroid="transparent" autoCorrect={false} autoCapitalize="none"
      />
    </View>
  );

  return (
    <View style={{ flex:1, backgroundColor:'#EEF2F7' }}>
      <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{
          backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6,
        }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>تعديل الملف الشخصي</Text>
      </View>
      <ScrollView style={{ flex:1 }} keyboardShouldPersistTaps="handled">
        <View style={{ padding:16 }}>
          {/* أفاتار */}
          <View style={{ alignItems:'center', marginBottom:24, marginTop:8 }}>
            <View style={{
              width:80, height:80, borderRadius:40,
              backgroundColor:'#0A2463', alignItems:'center', justifyContent:'center',
              borderWidth:3, borderColor:'#E6F0FF',
            }}>
              <Text style={{ color:'#fff', fontSize:34, fontWeight:'900' }}>
                {name.trim()[0]?.toUpperCase() || user?.avatar || '?'}
              </Text>
            </View>
            <Text style={{ fontSize:10, color:'#6B7C93', marginTop:6 }}>الاسم يُحدد أول حرف في الصورة</Text>
          </View>

          <View style={{ backgroundColor:'#fff', borderRadius:16, padding:16, borderWidth:1, borderColor:'#DDE4EF' }}>
            <Field label="الاسم الكامل *" value={name} onChange={setName} />
            <Field label="رقم الجوال"     value={phone} onChange={setPhone} keyboard="phone-pad" />

            {/* بريد غير قابل للتعديل */}
            <View style={{ marginBottom:14 }}>
              <Text style={{ fontSize:11, fontWeight:'700', color:'#0A2463', textAlign:'right', marginBottom:6 }}>
                البريد الإلكتروني
              </Text>
              <View style={{
                backgroundColor:'#EEF2F7', borderRadius:12, paddingHorizontal:14, height:46,
                justifyContent:'center', borderWidth:1, borderColor:'#DDE4EF',
              }}>
                <Text style={{ fontSize:13, color:'#6B7C93', textAlign:'right' }}>{user?.email}</Text>
              </View>
              <Text style={{ fontSize:9, color:'#A0ADBF', textAlign:'right', marginTop:3 }}>
                لا يمكن تغيير البريد الإلكتروني
              </Text>
            </View>

            {/* المسمى */}
            <View style={{ marginBottom:8 }}>
              <Text style={{ fontSize:11, fontWeight:'700', color:'#0A2463', textAlign:'right', marginBottom:6 }}>
                المسمى الوظيفي
              </Text>
              <View style={{
                backgroundColor:'#EEF2F7', borderRadius:12, paddingHorizontal:14, height:46,
                justifyContent:'center', borderWidth:1, borderColor:'#DDE4EF',
              }}>
                <Text style={{ fontSize:13, color:'#6B7C93', textAlign:'right' }}>{user?.role}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={save} style={{
            backgroundColor:'#0A2463', borderRadius:14, paddingVertical:14,
            alignItems:'center', marginTop:16,
            elevation:3, shadowColor:'#0A2463', shadowOffset:{width:0,height:3},
            shadowOpacity:0.3, shadowRadius:6,
          }}>
            <Text style={{ color:'#fff', fontSize:14, fontWeight:'800' }}>حفظ التغييرات</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height:60 }} />
      </ScrollView>
    </View>
  );
}

// ─── شاشة تغيير كلمة المرور ─────────────────────────────────
function ChangePasswordScreen({ onBack }) {
  const theme = useTheme();
  const [current,  setCurrent]  = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [confirm,  setConfirm]  = useState('');
  const { user, updateUser } = useAuth();

  function save() {
    if (!current) { showAlert('تنبيه', 'أدخل كلمة المرور الحالية'); return; }
    if (current !== user.password) { showAlert('خطأ', 'كلمة المرور الحالية غير صحيحة'); return; }
    if (newPass.length < 6) { showAlert('تنبيه', 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'); return; }
    if (newPass !== confirm) { showAlert('تنبيه', 'كلمتا المرور الجديدتان غير متطابقتان'); return; }
    updateUser({ password: newPass });showAlert('✅ تم التغيير', 'تم تغيير كلمة المرور بنجاح', [{ text: 'حسناً', onPress: onBack }]);
  }

  const Field = ({ label, value, onChange }) => (
    <View style={{ marginBottom:12 }}>
      <Text style={{ fontSize:11, fontWeight:'700', color:'#0A2463', textAlign:'right', marginBottom:5 }}>{label}</Text>
      <TextInput
        value={value} onChangeText={onChange} secureTextEntry
        style={{
          backgroundColor:'#F4F7FB', borderRadius:12, paddingHorizontal:14, height:46,
          fontSize:13, color:'#0D1B2A', textAlign:'right',
          borderWidth:1, borderColor:'#DDE4EF',
        }}
        underlineColorAndroid="transparent"
      />
    </View>
  );

  return (
    <View style={{ flex:1, backgroundColor:'#EEF2F7' }}>
      <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{
          backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6,
        }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>تغيير كلمة المرور</Text>
      </View>
      <ScrollView style={{ flex:1 }} keyboardShouldPersistTaps="handled">
        <View style={{ padding:16 }}>
          <View style={{ backgroundColor:'#fff', borderRadius:16, padding:16, borderWidth:1, borderColor:'#DDE4EF' }}>
            <Field label="كلمة المرور الحالية *" value={current} onChange={setCurrent} />
            <Field label="كلمة المرور الجديدة *" value={newPass}  onChange={setNewPass} />
            <Field label="تأكيد كلمة المرور الجديدة *" value={confirm} onChange={setConfirm} />
          </View>
          <TouchableOpacity onPress={save} style={{
            backgroundColor:'#0A2463', borderRadius:14, paddingVertical:14,
            alignItems:'center', marginTop:16,
          }}>
            <Text style={{ color:'#fff', fontSize:14, fontWeight:'800' }}>تغيير كلمة المرور</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height:60 }} />
      </ScrollView>
    </View>
  );
}

// ─── شاشة الإشعارات ──────────────────────────────────────────
function NotificationsScreen({ onBack }) {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    orders:    true,
    store:     true,
    programs:  false,
    news:      true,
    email:     false,
  });

  const items = [
    { key:'orders',   label:'إشعارات الطلبات',         desc:'عند تحديث حالة الطلب' },
    { key:'store',    label:'عروض المتجر',              desc:'خصومات ومنتجات جديدة' },
    { key:'programs', label:'تذكيرات برامج الصيانة',   desc:'قبل موعد الصيانة بيوم' },
    { key:'news',     label:'أخبار وتحديثات التطبيق',  desc:'مميزات جديدة وإعلانات' },
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
              <View style={{
                width:40, height:40, borderRadius:12, backgroundColor:'#FFF8E0',
                alignItems:'center', justifyContent:'center',
              }}>
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

// ─── شاشة الخصوصية ───────────────────────────────────────────
function PrivacyScreen({ onBack }) {
  const theme = useTheme();
  const items = [
    { icon:'🔒', title:'تشفير البيانات',        desc:'جميع بياناتك مشفرة بمعيار AES-256' },
    { icon:'🛡️', title:'عدم مشاركة البيانات',   desc:'لا نبيع أو نشارك بياناتك مع أطراف ثالثة' },
    { icon:'👁️', title:'شفافية الاستخدام',       desc:'نوضح لك كيف نستخدم بياناتك بالكامل' },
    { icon:'🗑️', title:'حذف الحساب والبيانات',  desc:'يمكنك طلب حذف حسابك في أي وقت' },
    { icon:'📍', title:'بيانات الموقع',          desc:'لا نجمع بيانات الموقع بدون إذنك' },
    { icon:'🍪', title:'الكوكيز',               desc:'نستخدم الكوكيز لتحسين تجربتك فقط' },
  ];

  return (
    <View style={{ flex:1, backgroundColor:'#EEF2F7' }}>
      <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{
          backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6,
        }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>الخصوصية والأمان</Text>
      </View>
      <ScrollView style={{ flex:1 }}>
        <View style={{ padding:14 }}>
          <View style={{
            backgroundColor:'#E6F7EE', borderRadius:14, padding:14,
            borderWidth:1, borderColor:'#0A7A3C44', marginBottom:14,
          }}>
            <Text style={{ fontSize:12, fontWeight:'800', color:'#0A7A3C', textAlign:'right', marginBottom:4 }}>
              🛡️ خصوصيتك أولويتنا
            </Text>
            <Text style={{ fontSize:11, color:'#0A2463', textAlign:'right', lineHeight:18 }}>
              نلتزم بأعلى معايير حماية البيانات الشخصية وفق الأنظمة والتشريعات المعمول بها في المملكة العربية السعودية.
            </Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={{
              backgroundColor:'#fff', borderRadius:14, padding:14,
              flexDirection:'row', alignItems:'center', gap:12,
              borderWidth:1, borderColor:'#DDE4EF', marginBottom:8,
            }}>
              <View style={{ flex:1, alignItems:'flex-end' }}>
                <Text style={{ fontSize:13, fontWeight:'700', color:'#0A2463' }}>{item.title}</Text>
                <Text style={{ fontSize:10, color:'#6B7C93', marginTop:2 }}>{item.desc}</Text>
              </View>
              <View style={{
                width:40, height:40, borderRadius:12, backgroundColor:'#EEF2F7',
                alignItems:'center', justifyContent:'center',
              }}>
                <Text style={{ fontSize:18 }}>{item.icon}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity onPress={() =>showAlert('طلب حذف الحساب', 'سيتم إرسال طلب حذف حسابك وبياناتك إلى فريق الدعم. سيتم معالجة الطلب خلال 7 أيام عمل.')} style={{
            backgroundColor:'#FFF0F0', borderRadius:14, padding:14, marginTop:8,
            borderWidth:1, borderColor:'#FFD0D0', alignItems:'center',
          }}>
            <Text style={{ color:'#D32F2F', fontSize:13, fontWeight:'700' }}>🗑️ طلب حذف الحساب والبيانات</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height:60 }} />
      </ScrollView>
    </View>
  );
}

// ─── الشاشة الرئيسية للإعدادات ──────────────────────────────
export default function SettingsScreen({ onBack, onGoOrders }) {
  const { user, darkMode, language, toggleDark, toggleLang, logout } = useAuth();
  const theme = useTheme();
  const [subScreen, setSubScreen] = useState(null);

  if (subScreen === 'editProfile')  return <EditProfileScreen     onBack={() => setSubScreen(null)} />;
  if (subScreen === 'password')     return <ChangePasswordScreen  onBack={() => setSubScreen(null)} />;
  if (subScreen === 'notifications')return <NotificationsScreen   onBack={() => setSubScreen(null)} />;
  if (subScreen === 'privacy')      return <PrivacyScreen         onBack={() => setSubScreen(null)} />;
  if (subScreen === 'terms')        return <TermsScreen           onBack={() => setSubScreen(null)} />;

  function handleLogout() { showAlert('تسجيل الخروج', 'هل تريد تسجيل الخروج من حسابك؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: () => { logout(); onBack(); } },
    ]);
  }

  function handleRate() { showAlert('⭐ قيّم التطبيق', 'هل أنت سعيد بتجربتك مع اطلبني؟', [
      { text: 'لاحقاً', style: 'cancel' },
      { text: '⭐⭐⭐⭐⭐ ممتاز!', onPress: () =>showAlert('شكراً جزيلاً! 💙', 'رأيك يساعدنا على تقديم الأفضل دائماً') },
    ]);
  }

  return (
    <View style={{ flex:1, backgroundColor: theme.bg }}>
      {/* رأس */}
      <View style={{ backgroundColor: theme.header, padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{
          backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6,
        }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:17, fontWeight:'900', flex:1, textAlign:'right' }}>الإعدادات</Text>
      </View>

      {/* بطاقة المستخدم */}
      <View style={{
        margin:14, backgroundColor: theme.card, borderRadius:16, padding:14,
        flexDirection:'row', alignItems:'center', gap:12,
        borderWidth:1, borderColor: theme.border,
      }}>
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:14, fontWeight:'800', color: theme.text, textAlign:'right' }}>{user?.name}</Text>
          <Text style={{ fontSize:11, color: theme.subText, textAlign:'right', marginTop:2 }}>{user?.email}</Text>
          <Text style={{ fontSize:10, color:'#0078FF', textAlign:'right', marginTop:2 }}>{user?.role}</Text>
        </View>
        <View style={{
          width:48, height:48, borderRadius:24, backgroundColor: theme.header,
          alignItems:'center', justifyContent:'center', borderWidth:2, borderColor: theme.border,
        }}>
          <Text style={{ color:'#fff', fontSize:20, fontWeight:'900' }}>{user?.avatar || '?'}</Text>
        </View>
      </View>

      <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal:14 }}>

          <Text style={{ fontSize:11, fontWeight:'700', color: theme.subText, textAlign:'right', marginBottom:8 }}>الحساب</Text>
          <SettingRow icon="✏️" label="تعديل الملف الشخصي" desc="الاسم والجوال والصورة"
            iconBg="#E6F0FF" onPress={() => setSubScreen('editProfile')} theme={theme} />
          <SettingRow icon="📦" label="طلباتي" desc="متابعة حالة الطلبات"
            iconBg="#E6F7EE" onPress={() => { onBack(); onGoOrders?.(); }} theme={theme} />
          <SettingRow icon="🔒" label="تغيير كلمة المرور" desc="تحديث كلمة المرور الحالية"
            iconBg="#F0EAFF" onPress={() => setSubScreen('password')} theme={theme} />
          <SettingRow icon="🔔" label="الإشعارات" desc="إدارة التنبيهات والتذكيرات"
            iconBg="#FFF8E0" onPress={() => setSubScreen('notifications')} theme={theme} />
          <SettingRow icon="🛡️" label="الخصوصية والأمان" desc="إعدادات البيانات والحماية"
            iconBg="#E6F7EE" onPress={() => setSubScreen('privacy')} theme={theme} />

          <Text style={{ fontSize:11, fontWeight:'700', color: theme.subText, textAlign:'right', marginBottom:8, marginTop:16 }}>
            المظهر واللغة
          </Text>
          <SettingRow icon="🌙" label="الوضع الليلي"
            desc={darkMode ? '🌙 مفعّل — الشاشة داكنة' : '☀️ معطّل — الشاشة فاتحة'}
            iconBg={darkMode ? '#1A1A2E' : '#EEF2F7'}
            theme={theme}
            right={
              <Switch value={darkMode} onValueChange={toggleDark}
                trackColor={{ false:'#DDE4EF', true:'#0078FF' }} thumbColor="#fff" />
            }
          />
          <SettingRow icon="🌐" label="اللغة"
            desc={language === 'ar' ? 'العربية — Arabic' : 'English — إنجليزي'}
            iconBg="#E6F0FF" theme={theme}
            onPress={toggleLang}
            right={
              <View style={{
                backgroundColor: language==='ar' ? '#0A2463' : '#0A7A3C',
                borderRadius:8, paddingHorizontal:10, paddingVertical:5,
              }}>
                <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>
                  {language === 'ar' ? '🇸🇦 AR' : '🇺🇸 EN'}
                </Text>
              </View>
            }
          />

          <Text style={{ fontSize:11, fontWeight:'700', color: theme.subText, textAlign:'right', marginBottom:8, marginTop:16 }}>
            حول التطبيق
          </Text>
          <SettingRow icon="📋" label="الشروط والأحكام" desc="اقرأ شروط الاستخدام"
            iconBg="#FFF0E0" onPress={() => setSubScreen('terms')} theme={theme} />
          <SettingRow icon="⭐" label="قيّم التطبيق" desc="شاركنا رأيك لنتحسن معك"
            iconBg="#FFF8E0" onPress={handleRate} theme={theme} />
          <SettingRow icon="💬" label="تواصل معنا" desc="support@atlobni.com"
            iconBg="#E6F0FF" theme={theme}
            onPress={() =>showAlert('تواصل معنا 💬', 'البريد: support@atlobni.com\nالهاتف: 920-XXX-XXX\nساعات الدعم: 9ص - 6م')} />
          <SettingRow icon="📱" label="الإصدار" desc="اطلبني v1.0.0 — بني بـ ❤️" iconBg="#EEF2F7" theme={theme} />

          <View style={{ marginTop:16, marginBottom:14 }}>
            <SettingRow icon="🚪" label="تسجيل الخروج" desc="الخروج من الحساب الحالي"
              danger onPress={handleLogout} theme={theme} />
          </View>
        </View>
        <View style={{ height:90 }} />
      </ScrollView>
    </View>
  );
}
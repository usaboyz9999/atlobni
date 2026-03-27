import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, TextInput, Linking, BackHandler, ActivityIndicator,
} from 'react-native';
import { showAlert } from '../components/alertBridge';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TermsScreen from './TermsScreen';

// ─── بيانات الدول وأكواد الاتصال ──────────────────────────────
const COUNTRIES = [
  { code: 'SA', name: 'المملكة العربية السعودية', dial: '+966' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', dial: '+971' },
  { code: 'EG', name: 'مصر', dial: '+20' },
  { code: 'KW', name: 'الكويت', dial: '+965' },
  { code: 'QA', name: 'قطر', dial: '+974' },
  { code: 'BH', name: 'البحرين', dial: '+973' },
  { code: 'OM', name: 'عمان', dial: '+968' },
  { code: 'JO', name: 'الأردن', dial: '+962' },
  { code: 'IQ', name: 'العراق', dial: '+964' },
  { code: 'YE', name: 'اليمن', dial: '+967' },
  { code: 'SY', name: 'سوريا', dial: '+963' },
  { code: 'LB', name: 'لبنان', dial: '+961' },
  { code: 'PS', name: 'فلسطين', dial: '+970' },
  { code: 'LY', name: 'ليبيا', dial: '+218' },
  { code: 'DZ', name: 'الجزائر', dial: '+213' },
  { code: 'MA', name: 'المغرب', dial: '+212' },
  { code: 'TN', name: 'تونس', dial: '+216' },
  { code: 'SD', name: 'السودان', dial: '+249' },
  { code: 'SO', name: 'الصومال', dial: '+252' },
  { code: 'DJ', name: 'جيبوتي', dial: '+253' },
  { code: 'MR', name: 'موريتانيا', dial: '+222' },
  { code: 'OTHER', name: 'أخرى', dial: '' },
];

// ─── مكون صف الإعداد (خارجي) ───────────────────────────────────────────────
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

// ─── مكون حقل الإدخال الموحد (خارجي) ──────────────────────────────────────
const InputField = ({ label, value, onChange, keyboard, secure, editable = true, hint, placeholder }) => (
  <View style={{ marginBottom:14 }}>
    <Text style={{ fontSize:11, fontWeight:'700', color:'#0A2463', textAlign:'right', marginBottom:6 }}>{label}</Text>
    {editable ? (
      <TextInput
        value={value} 
        onChangeText={onChange}
        keyboardType={keyboard || 'default'}
        secureTextEntry={secure || false}
        placeholder={placeholder}
        placeholderTextColor="#A0ADBF"
        style={{
          backgroundColor:'#F4F7FB', borderRadius:12,
          paddingHorizontal:14, height:46,
          fontSize:13, color:'#0D1B2A', textAlign:'right',
          borderWidth:1, borderColor:'#DDE4EF',
        }}
        underlineColorAndroid="transparent" 
        autoCorrect={false} 
        autoCapitalize="none"
      />
    ) : (
      <View style={{
        backgroundColor:'#EEF2F7', borderRadius:12, paddingHorizontal:14, height:46,
        justifyContent:'center', borderWidth:1, borderColor:'#DDE4EF',
      }}>
        <Text style={{ fontSize:13, color:'#6B7C93', textAlign:'right' }}>{value || '-'}</Text>
      </View>
    )}
    {hint ? <Text style={{ fontSize:9, color:'#A0ADBF', textAlign:'right', marginTop:3 }}>{hint}</Text> : null}
  </View>
);

// ─── مكون اختيار الدولة العائم (Overlay) ───────────────────────────────────
const CountryPickerOverlay = ({ selectedCode, onSelect, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)', // خلفية معتمة للتركيز
    }}>
      {/* منطقة الضغط خارج القائمة للإغلاق */}
      <TouchableOpacity 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
        activeOpacity={1} 
        onPress={onClose} 
      />
      
      {/* القائمة نفسها */}
      <View style={{
        width: '85%',
        maxHeight: 350,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#DDE4EF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
        overflow: 'hidden',
        zIndex: 10000,
      }}>
        <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#F4F7FB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFBFC' }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0A2463' }}>اختر الدولة</Text>
          <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
            <Text style={{ fontSize: 20, color: '#A0ADBF', fontWeight: 'bold', lineHeight: 20 }}>×</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {COUNTRIES.map(c => (
            <TouchableOpacity
              key={c.code}
              onPress={() => { onSelect(c.code); onClose(); }}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F4F7FB',
                backgroundColor: selectedCode === c.code ? '#E6F0FF' : '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#0A2463', fontWeight: selectedCode === c.code ? '800' : '500' }}>{c.name}</Text>
              <Text style={{ fontSize: 13, color: '#6B7C93', fontWeight: '700' }}>{c.dial}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// ─── شاشة تعديل الملف ───────────────────────────────────────
function EditProfileScreen({ onBack }) {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone ? user.phone.replace(/\D/g, '') : '');
  const [countryCode, setCountryCode] = useState('SA');
  const [loadingLocation, setLoadingLocation] = useState(true);
  
  // حالة فتح القائمة
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // تم إصلاح الرابط بإزالة المسافات
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) {
          const found = COUNTRIES.find(c => c.code === data.country_code);
          if (found) {
            setCountryCode(found.code);
          }
        }
      } catch (error) {
        console.log('Failed to fetch location:', error);
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []);

  function save() {
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      showAlert('تنبيه', 'يرجى كتابة الاسم الأول والثاني في حقل الاسم (مثال: أحمد محمد)');
      return;
    }
    
    if (phone.length < 8) {
      showAlert('تنبيه', 'يرجى إدخال رقم جوال صحيح');
      return;
    }

    const country = COUNTRIES.find(c => c.code === countryCode);
    const fullPhone = `${country?.dial || ''}${phone}`;

    updateUser({ 
      name: name.trim(), 
      phone: fullPhone, 
      avatar: name.trim()[0]?.toUpperCase(),
      country: country?.name 
    });
    
    showAlert('✅ تم الحفظ', 'تم تحديث بياناتك بنجاح', [{ text: 'حسناً', onPress: onBack }]);
  }

  const handlePhoneChange = (text) => setPhone(text.replace(/\D/g, ''));

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  return (
    <View style={{ flex:1, backgroundColor:'#EEF2F7' }}>
      {/* Header */}
      <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6 }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>تعديل الملف الشخصي</Text>
      </View>

      <ScrollView style={{ flex:1 }} keyboardShouldPersistTaps="handled">
        <View style={{ padding:16 }}>
          {/* Avatar */}
          <View style={{ alignItems:'center', marginBottom:24, marginTop:8 }}>
            <View style={{ width:80, height:80, borderRadius:40, backgroundColor:'#0A2463', alignItems:'center', justifyContent:'center', borderWidth:3, borderColor:'#E6F0FF' }}>
              <Text style={{ color:'#fff', fontSize:34, fontWeight:'900' }}>{name.trim()[0]?.toUpperCase() || user?.avatar || '?'}</Text>
            </View>
            <Text style={{ fontSize:10, color:'#6B7C93', marginTop:6 }}>الاسم يُحدد أول حرف في الصورة</Text>
          </View>

          <View style={{ backgroundColor:'#fff', borderRadius:16, padding:16, borderWidth:1, borderColor:'#DDE4EF' }}>
            {/* Name Field */}
            <InputField 
              label="الاسم الكامل (الأول والثاني) *" 
              value={name} 
              onChange={setName} 
              placeholder="اكتب الاسم الأول والثاني هنا"
            />
            
            {/* Country Picker Trigger */}
            <View style={{ marginBottom:14 }}>
              <Text style={{ fontSize:11, fontWeight:'700', color:'#0A2463', textAlign:'right', marginBottom:6 }}>دولة الإقامة *</Text>
              <TouchableOpacity 
                onPress={() => setIsCountryPickerOpen(true)}
                style={{
                  backgroundColor:'#F4F7FB', borderRadius:12, paddingHorizontal:14, height:46,
                  flexDirection:'row', alignItems:'center', justifyContent:'space-between',
                  borderWidth:1, borderColor:'#DDE4EF',
                }}
              >
                <Text style={{ fontSize:13, color:'#0D1B2A', textAlign:'right', flex:1 }}>
                  {loadingLocation ? 'جاري التحديد...' : `${selectedCountry.name} (${selectedCountry.dial})`}
                </Text>
                <Text style={{ fontSize:16, color:'#0A2463' }}>▼</Text>
              </TouchableOpacity>
              {loadingLocation && <ActivityIndicator size="small" color="#0A2463" style={{marginTop: 5, alignSelf: 'flex-end'}} />}
            </View>

            {/* Phone Field */}
            <InputField 
              label="رقم الجوال *" 
              value={phone} 
              onChange={handlePhoneChange} 
              keyboard="phone-pad" 
              placeholder="أدخل الرقم بدون رمز الدولة"
              hint={`سيتم إضافة الرمز ${selectedCountry.dial} تلقائياً`}
            />

            {/* Email & Role (Read-only) */}
            <InputField label="البريد الإلكتروني" value={user?.email} onChange={()=>{}} editable={false} hint="لا يمكن تغيير البريد الإلكتروني" />
            <InputField label="المسمى الوظيفي" value={user?.role} onChange={()=>{}} editable={false} />
          </View>

          <TouchableOpacity onPress={save} style={{ backgroundColor:'#0A2463', borderRadius:14, paddingVertical:14, alignItems:'center', marginTop:16, elevation:3, shadowColor:'#0A2463', shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:6 }}>
            <Text style={{ color:'#fff', fontSize:14, fontWeight:'800' }}>حفظ التغييرات</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height:60 }} />
      </ScrollView>

      {/* Render the Picker Overlay Outside ScrollView */}
      <CountryPickerOverlay 
        selectedCode={countryCode} 
        onSelect={setCountryCode} 
        isOpen={isCountryPickerOpen}
        onClose={() => setIsCountryPickerOpen(false)}
      />
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
    updateUser({ password: newPass });
    showAlert('✅ تم التغيير', 'تم تغيير كلمة المرور بنجاح', [{ text: 'حسناً', onPress: onBack }]);
  }

  return (
    <View style={{ flex:1, backgroundColor:'#EEF2F7' }}>
      <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6 }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>تغيير كلمة المرور</Text>
      </View>
      <ScrollView style={{ flex:1 }} keyboardShouldPersistTaps="handled">
        <View style={{ padding:16 }}>
          <View style={{ backgroundColor:'#fff', borderRadius:16, padding:16, borderWidth:1, borderColor:'#DDE4EF' }}>
            <InputField label="كلمة المرور الحالية *" value={current} onChange={setCurrent} secure />
            <InputField label="كلمة المرور الجديدة *" value={newPass}  onChange={setNewPass} secure />
            <InputField label="تأكيد كلمة المرور الجديدة *" value={confirm} onChange={setConfirm} secure />
          </View>
          <TouchableOpacity onPress={save} style={{ backgroundColor:'#0A2463', borderRadius:14, paddingVertical:14, alignItems:'center', marginTop:16 }}>
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
        <TouchableOpacity onPress={onBack} style={{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6 }}>
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
        <TouchableOpacity onPress={onBack} style={{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6 }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>الخصوصية والأمان</Text>
      </View>
      <ScrollView style={{ flex:1 }}>
        <View style={{ padding:14 }}>
          <View style={{ backgroundColor:'#E6F7EE', borderRadius:14, padding:14, borderWidth:1, borderColor:'#0A7A3C44', marginBottom:14 }}>
            <Text style={{ fontSize:12, fontWeight:'800', color:'#0A7A3C', textAlign:'right', marginBottom:4 }}>🛡️ خصوصيتك أولويتنا</Text>
            <Text style={{ fontSize:11, color:'#0A2463', textAlign:'right', lineHeight:18 }}>نلتزم بأعلى معايير حماية البيانات الشخصية وفق الأنظمة والتشريعات المعمول بها في المملكة العربية السعودية.</Text>
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
              <View style={{ width:40, height:40, borderRadius:12, backgroundColor:'#EEF2F7', alignItems:'center', justifyContent:'center' }}>
                <Text style={{ fontSize:18 }}>{item.icon}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity onPress={() =>showAlert('طلب حذف الحساب', 'سيتم إرسال طلب حذف حسابك وبياناتك إلى فريق الدعم. سيتم معالجة الطلب خلال 7 أيام عمل.')} style={{ backgroundColor:'#FFF0F0', borderRadius:14, padding:14, marginTop:8, borderWidth:1, borderColor:'#FFD0D0', alignItems:'center' }}>
            <Text style={{ color:'#D32F2F', fontSize:13, fontWeight:'700' }}>🗑️ طلب حذف الحساب والبيانات</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height:60 }} />
      </ScrollView>
    </View>
  );
}

// ─── الشاشة الرئيسية للإعدادات ──────────────────────────────
export default function SettingsScreen({ onBack, onGoOrders, initialScreen }) {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [subScreen, setSubScreen] = useState(initialScreen || null);

  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (subScreen) { 
        if (initialScreen) { onBack(); } else { setSubScreen(null); }
        return true; 
      }
      onBack(); return true;
    });
    return () => sub.remove();
  }, [subScreen]);

  if (subScreen === 'editProfile')  return <EditProfileScreen     onBack={initialScreen ? onBack : () => setSubScreen(null)} />;
  if (subScreen === 'password')     return <ChangePasswordScreen  onBack={() => setSubScreen(null)} />;
  if (subScreen === 'notifications')return <NotificationsScreen   onBack={initialScreen ? onBack : () => setSubScreen(null)} />;
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
      <View style={{ backgroundColor: theme.header, padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6 }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:17, fontWeight:'900', flex:1, textAlign:'right' }}>الإعدادات</Text>
      </View>

      <View style={{ margin:14, backgroundColor: theme.card, borderRadius:16, padding:14, flexDirection:'row', alignItems:'center', gap:12, borderWidth:1, borderColor: theme.border }}>
        <View style={{ flex:1 }}>
          <Text style={{ fontSize:14, fontWeight:'800', color: theme.text, textAlign:'right' }}>{user?.name}</Text>
          <Text style={{ fontSize:11, color: theme.subText, textAlign:'right', marginTop:2 }}>{user?.email}</Text>
          <Text style={{ fontSize:10, color:'#0078FF', textAlign:'right', marginTop:2 }}>{user?.role}</Text>
        </View>
        <View style={{ width:48, height:48, borderRadius:24, backgroundColor: theme.header, alignItems:'center', justifyContent:'center', borderWidth:2, borderColor: theme.border }}>
          <Text style={{ color:'#fff', fontSize:20, fontWeight:'900' }}>{user?.avatar || '?'}</Text>
        </View>
      </View>

      <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal:14 }}>
          <Text style={{ fontSize:11, fontWeight:'700', color: theme.subText, textAlign:'right', marginBottom:8 }}>الحساب</Text>
          <SettingRow icon="✏️" label="تعديل الملف الشخصي" desc="الاسم والجوال والدولة" iconBg="#E6F0FF" onPress={() => setSubScreen('editProfile')} theme={theme} />
          <SettingRow icon="📦" label="طلباتي" desc="متابعة حالة الطلبات" iconBg="#E6F7EE" onPress={() => { onBack(); onGoOrders?.(); }} theme={theme} />
          <SettingRow icon="🔒" label="تغيير كلمة المرور" desc="تحديث كلمة المرور الحالية" iconBg="#F0EAFF" onPress={() => setSubScreen('password')} theme={theme} />
          <SettingRow icon="🔔" label="الإشعارات" desc="إدارة التنبيهات والتذكيرات" iconBg="#FFF8E0" onPress={() => setSubScreen('notifications')} theme={theme} />
          <SettingRow icon="🛡️" label="الخصوصية والأمان" desc="إعدادات البيانات والحماية" iconBg="#E6F7EE" onPress={() => setSubScreen('privacy')} theme={theme} />

          <Text style={{ fontSize:11, fontWeight:'700', color: theme.subText, textAlign:'right', marginBottom:8, marginTop:16 }}>حول التطبيق</Text>
          <SettingRow icon="📋" label="الشروط والأحكام" desc="اقرأ شروط الاستخدام" iconBg="#FFF0E0" onPress={() => setSubScreen('terms')} theme={theme} />
          <SettingRow icon="⭐" label="قيّم التطبيق" desc="شاركنا رأيك لنتحسن معك" iconBg="#FFF8E0" onPress={handleRate} theme={theme} />
          <SettingRow icon="💬" label="تواصل معنا" desc="support@atlobni.com" iconBg="#E6F0FF" theme={theme} onPress={() =>showAlert('تواصل معنا 💬', 'البريد: support@atlobni.com\nالهاتف: 920-XXX-XXX\nساعات الدعم: 9ص - 6م')} />
          <SettingRow icon="📱" label="الإصدار" desc="اطلبني v1.0.0 — بني بـ ❤️" iconBg="#EEF2F7" theme={theme} />

          <View style={{ marginTop:16, marginBottom:14 }}>
            <SettingRow icon="🚪" label="تسجيل الخروج" desc="الخروج من الحساب الحالي" danger onPress={handleLogout} theme={theme} />
          </View>
        </View>
        <View style={{ height:90 }} />
      </ScrollView>
    </View>
  );
}
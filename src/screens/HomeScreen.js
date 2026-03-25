import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ImageBackground,
  TextInput, KeyboardAvoidingView, Platform, Keyboard,
  Dimensions, Animated, Easing, StatusBar as RNStatusBar, PanResponder,
} from 'react-native';
import { showAlert } from '../components/alertBridge';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useAppAlert } from '../components/AppAlert';
import { Badge, SHead } from '../components/shared';
import s, { CARD_W } from '../styles';
import { showAppAlert } from '../../App';
import { CATEGORIES } from '../data/categories';
import { STORE_ITEMS, HOME_PRODUCTS } from '../data/storeData';
import UserBar from '../components/UserBar';

// ─── اسم المستخدم المسجل (null = غير مسجل) ─────────────────
// LOGGED_IN_USER now comes from useAuth()

const SCREEN_W      = Dimensions.get('window').width;
const CARD_REVIEW_W = SCREEN_W * 0.72;
const BANNER_W      = SCREEN_W;           // البانر بعرض كامل
const BANNERS_COUNT = 3;

// ─── بيانات الآراء الأولية ───────────────────────────────────
const INITIAL_REVIEWS = [
  { id:1,  name:'أحمد العتيبي',    rating:5, text:'تطبيق ممتاز يوفر وقتاً كبيراً في البحث عن إجراءات الصيانة. أنصح به بشدة.' },
  { id:2,  name:'سارة القحطاني',   rating:5, text:'محتوى شامل ومفصل لكل التخصصات. ساعدني كثيراً في إعداد خطط الصيانة.' },
  { id:3,  name:'محمد الشمري',     rating:4, text:'تطبيق رائع وسهل الاستخدام. البيانات منظمة بشكل احترافي.' },
  { id:4,  name:'نورة السبيعي',    rating:5, text:'أفضل مرجع لأعمال التشغيل والصيانة. جداول الصيانة دقيقة وشاملة.' },
  { id:5,  name:'خالد المطيري',    rating:4, text:'مفيد جداً لفريق الصيانة. قطع الغيار المدرجة توفر علينا الكثير.' },
  { id:6,  name:'ريم الدوسري',     rating:5, text:'واجهة جميلة وسلسة. المعلومات دقيقة وموثوقة للمشاريع الكبيرة.' },
  { id:7,  name:'عبدالله الرشيدي', rating:5, text:'استخدمته في مشروع صيانة ضخم وكان مرجعاً أساسياً للفريق بأكمله.' },
  { id:8,  name:'منى الحربي',      rating:4, text:'جميع التخصصات في مكان واحد. وفّر علينا الرجوع لعشرات الكتيبات.' },
  { id:9,  name:'فيصل الغامدي',    rating:5, text:'برامج الصيانة الوقائية والتصحيحية احترافية جداً. شكراً على هذا العمل.' },
  { id:10, name:'لمياء العنزي',    rating:5, text:'تطبيق متكامل يستحق النجوم الخمس. سهّل عملنا في متابعة أعمال الصيانة.' },
];

// ─── بيانات البانرات ─────────────────────────────────────────
const BANNERS = [
  {
    id: 1,
    img: 'https://khaleejisah.com/wp-content/uploads/2026/02/7336bc23d9822d68fa4c08d4de41c80b0fff38de-780x470.webp',
    overlay: 'rgba(10,36,99,0.25)',
    badge: '⚙️ دليل التشغيل',
    title: 'دليل الصيانة الشامل',
    desc: '14 تخصصاً في مكان واحد — إجراءات وقائية\nوتصحيحية مع جداول دورية معتمدة',
  },
  {
    id: 2,
    img: 'https://cdn.salla.sa/RPNxP/bc730f52-177f-4edd-b920-9e06e5595cc9-1000x562.5-5jxLeADJ5cZekDsQ7GYehMtmXBmcISAqpKrEjK6G.jpg',
    overlay: 'rgba(120,30,0,0.28)',
    badge: '🛒 المتجر',
    title: 'متجر قطع الغيار',
    desc: '+600 قطعة غيار لجميع التخصصات\nتوصيل سريع • ضمان الجودة • أسعار تنافسية',
  },
  {
    id: 3,
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1US8rcfEKHzaUvAu23Nwm3wXq6g-Z6wA7bQ&s',
    overlay: 'rgba(10,90,50,0.28)',
    badge: '📋 البرامج',
    title: 'برامج الصيانة الذكية',
    desc: 'جداول يومية وأسبوعية وشهرية وسنوية\nمع تتبع الطلبات ومؤشرات الأداء KPIs',
  },
];

function StarRow({ rating, size = 14, onPress }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <TouchableOpacity key={i} onPress={() => onPress && onPress(i)} disabled={!onPress} activeOpacity={0.7}>
          <Text style={{ fontSize: size, color: i <= rating ? '#F5A623' : '#DDE4EF' }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function HomeScreen({ onSelectCategory, onGoStore, onLogout, onProfile, onGoProduct }) {
  const { t, dir } = useLang();
  const { user } = useAuth();
  const showAlert = useAppAlert();
  const theme = useTheme();
  const isRTL = dir === 'rtl';
  const [filter, setFilter]       = useState('all');
  const [reviews, setReviews]     = useState(INITIAL_REVIEWS);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText]     = useState('');
  const [guestName, setGuestName] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const scrollRef  = useRef(null);

  const isLoggedIn  = !!user;
  const displayName = isLoggedIn ? user?.name : guestName.trim();
  const avgRating   = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  // ─── نتائج البحث الشاملة ────────────────────────────────────
  const ALL_SEARCH_ITEMS = [
    // التخصصات
    ...CATEGORIES.map(c => ({
      id: c.id, name: c.label, sub: c.count,
      type: 'تخصص', typeColor:'#0043B0', typeBg:'#E6F0FF',
      isCategory: true, icon: '⚙️',
    })),
    // منتجات المتجر الأصلية
    ...STORE_ITEMS.map(i => ({
      id: `store_${i.id}`, name: i.name, sub: `${i.price} ر.س`,
      type: 'متجر', typeColor:'#0A7A3C', typeBg:'#E6F7EE',
      isCategory: false, isStore: true, icon: '🛒',
      fullItem: { id: String(i.id), name: i.name, price: i.price, cat: i.cat, img: i.img, stars: i.stars, code: i.code, desc: null },
    })),
    // المنتجات المنزلية من جميع التخصصات
    ...Object.values(HOME_PRODUCTS || {}).flat().map(p => ({
      id: `home_${p.id}`, name: p.name, sub: `${p.price} ر.س`,
      type: 'منزلي', typeColor:'#5B2D8E', typeBg:'#F0EAFF',
      isCategory: false, isStore: true, icon: '🏠',
      fullItem: { id: p.id, name: p.name, price: p.price, img: p.img, stars: p.stars, desc: p.desc, cat: 'منزلي' },
    })),
  ];

  const searchResults = searchQuery.trim().length > 0
    ? ALL_SEARCH_ITEMS.filter(item => {
        const q = searchQuery.trim();
        return item.name?.includes(q) || item.type?.includes(q) || item.sub?.includes(q);
      }).slice(0, 10)
    : [];

  // ─── Banner Animated ────────────────────────────────────────
  const bannerAnim  = useRef(new Animated.Value(0)).current;
  const currentIdx  = useRef(0);
  const isPaused    = useRef(false);

  const goToSlide = (idx, duration = 600) => {
    currentIdx.current = idx;
    setActiveDot(idx);
    Animated.timing(bannerAnim, {
      toValue: idx * BANNER_W,
      duration,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPaused.current) return;
      const next = (currentIdx.current + 1) % BANNERS_COUNT;
      goToSlide(next, 700);
    }, 4000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filters = [
    { id:'all',    label:t('all')    },
    { id:'elec',   label:t('elec')   },
    { id:'plumb',  label:t('plumb')  },
    { id:'hvac',   label:t('hvac')   },
    { id:'fire',   label:t('fire')   },
    { id:'civil',  label:t('civil')  },
    { id:'safety', label:t('safety') },
  ];
  const filtered = filter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === filter);

  function submitReview() {
    if (hasReviewed) { showAlert('شكراً!', 'لقد قمت بتقديم رأيك مسبقاً'); return; }
    if (!user && !guestName.trim()) { showAlert('تنبيه', 'يرجى إدخال اسمك أولاً'); return; }
    if (newRating === 0) { showAlert('تنبيه', 'يرجى اختيار تقييم بالنجوم'); return; }
    if (!newText.trim()) { showAlert('تنبيه', 'يرجى كتابة رأيك'); return; }
    setReviews(prev => [{ id: Date.now(), name: displayName, rating: newRating, text: newText.trim() }, ...prev]);
    setNewRating(0);
    setNewText('');
    if (!isLoggedIn) setGuestName('');
    Keyboard.dismiss();showAlert('✅ شكراً!', 'تم إرسال رأيك بنجاح');
  }

  const ratingLabel = newRating === 5 ? '🤩 ممتاز!' : newRating === 4 ? '😊 جيد جداً' : newRating === 3 ? '🙂 مقبول' : newRating === 2 ? '😐 يحتاج تحسين' : newRating === 1 ? '😔 ضعيف' : '';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        ref={scrollRef}
        style={[s.screen, { backgroundColor: theme.bg }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── البانر ── */}
        <ImageBackground source={{ uri:'https://online.fliphtml5.com/jqudt/qsnk/files/thumb/7c68645d71b803bf0ba2f22519f73e08.webp?1676063236' }} style={s.heroBanner}>
          <View style={s.heroOverlay}/>
          <View style={[s.heroContent,{alignItems:isRTL?'flex-end':'flex-start'}]}>
            <View style={s.logoRow}>
              <View style={s.logoBox}><Text style={{fontSize:20}}>⚙️</Text></View>
              <View>
                <Text style={[s.appNameSm,{textAlign:isRTL?'right':'left',fontSize:35,fontWeight:'900',letterSpacing:1}]}>{t('appName')}</Text>
                <Text style={[s.appSubSm,{textAlign:isRTL?'right':'left'}]}>{t('appSub')}</Text>
              </View>
            </View>
            <Text style={[s.heroTitle,{textAlign:isRTL?'right':'left'}]}>{t('heroTitle')}</Text>
            <Text style={[s.heroSub,  {textAlign:isRTL?'right':'left'}]}>{t('heroSub')}</Text>
          </View>
        </ImageBackground>

        {/* UserBar تحت الصورة */}
        <UserBar onLogout={onLogout} onProfile={onProfile} />

        {/* ══════════════════════════════════════════
            حقل البحث — Modal approach
        ══════════════════════════════════════════ */}

        {/* زر البحث */}
        <TouchableOpacity
          onPress={() => setSearchFocused(true)}
          activeOpacity={0.85}
          style={{
            marginHorizontal: 14, marginTop: 14, marginBottom: 6,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            height: 48, borderRadius: 14,
            backgroundColor: '#0A2463',
            gap: 10,
            elevation: 4,
            shadowColor: '#0A2463',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
          }}
        >
          <Text style={{ fontSize: 14 }}>🔍</Text>
          <Text style={{ fontSize: 14, color: '#fff', fontWeight: '700' }}>
            ابحث عن تخصص أو قطعة غيار
          </Text>
        </TouchableOpacity>

        {/* Modal البحث الكامل */}
        {searchFocused && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(10,34,99,0.55)',
            zIndex: 999,
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              paddingTop: Platform.OS === 'ios' ? 54 : 40,
              paddingBottom: 16,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
            }}>
              {/* حقل الإدخال في الـ Modal */}
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                marginHorizontal: 16, marginBottom: 12,
                backgroundColor: '#F5F7FA',
                borderRadius: 14, paddingHorizontal: 14, height: 50,
              }}>
                <TouchableOpacity onPress={() => { setSearchFocused(false); setSearchQuery(''); Keyboard.dismiss(); }}>
                  <Text style={{ fontSize: 22, color: '#0A2463', marginLeft: 6 }}>←</Text>
                </TouchableOpacity>
                <TextInput
                  style={{
                    flex: 1, fontSize: 14, color: '#0D1B2A',
                    textAlign: 'right', paddingHorizontal: 10, height: 50,
                    backgroundColor: 'transparent', includeFontPadding: false,
                  }}
                  underlineColorAndroid="transparent"
                  selectionColor="#0078FF"
                  cursorColor="#0078FF"
                  placeholder="ابحث عن تخصص أو قطعة غيار..."
                  placeholderTextColor="#B0BCCF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text style={{ color: '#A0ADBF', fontSize: 20, paddingHorizontal: 4 }}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* النتائج */}
              {searchResults.length > 0 && (
                <View style={{ maxHeight: 320 }}>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    paddingHorizontal: 16, paddingVertical: 6,
                    borderBottomWidth: 1, borderBottomColor: '#EEF2F7',
                  }}>
                    <Text style={{ fontSize: 9, color: '#A0ADBF', fontWeight: '600' }}>{searchResults.length} نتيجة</Text>
                    <Text style={{ fontSize: 10, color: '#0A2463', fontWeight: '700' }}>نتائج البحث</Text>
                  </View>
                  <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    {searchResults.map((item, idx) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                          setSearchQuery(''); setSearchFocused(false); Keyboard.dismiss();
                          if (item.isCategory) onSelectCategory(item.id);
                          else if (onGoProduct && item.fullItem) {
                            onGoProduct(item.fullItem);
                          } else onGoStore && onGoStore();
                        }}
                        activeOpacity={0.7}
                        style={{
                          flexDirection: 'row', alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 16, paddingVertical: 13,
                          borderBottomWidth: idx < searchResults.length - 1 ? 1 : 0,
                          borderBottomColor: '#F4F7FB',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ color: '#C0CADE', fontSize: 16 }}>›</Text>
                          <View style={{ backgroundColor: item.typeBg, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 }}>
                            <Text style={{ fontSize: 9, fontWeight: '700', color: item.typeColor }}>{item.type}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
                          <Text style={{ fontSize: 13, color: '#0A2463', fontWeight: '600', textAlign: 'right' }} numberOfLines={1}>{item.name}</Text>
                          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: item.typeBg, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16 }}>{item.isCategory ? '⚙️' : '🔩'}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* لا توجد نتائج */}
              {searchQuery.trim().length > 0 && searchResults.length === 0 && (
                <View style={{ padding: 30, alignItems: 'center' }}>
                  <Text style={{ fontSize: 30, marginBottom: 10 }}>🔍</Text>
                  <Text style={{ fontSize: 14, color: '#0A2463', fontWeight: '700', marginBottom: 4 }}>لا توجد نتائج</Text>
                  <Text style={{ fontSize: 11, color: '#A0ADBF' }}>جرب كلمة مختلفة</Text>
                </View>
              )}
            </View>

            {/* الخلفية للإغلاق */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => { setSearchFocused(false); setSearchQuery(''); Keyboard.dismiss(); }}
              activeOpacity={1}
            />
          </View>
        )}

        {/* ══════════════════════════════════════════════
            البانرات الترويجية — Animated carousel
        ══════════════════════════════════════════════ */}
        <View style={{ height: 160, marginTop: 6, overflow: 'hidden' }}
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => { isPaused.current = true; }}
          onResponderRelease={e => {
            const dx = e.nativeEvent.locationX - BANNER_W / 2;
            if (Math.abs(dx) > 40) {
              const next = dx < 0
                ? Math.min(currentIdx.current + 1, BANNERS_COUNT - 1)
                : Math.max(currentIdx.current - 1, 0);
              goToSlide(next, 400);
            }
            setTimeout(() => { isPaused.current = false; }, 3000);
          }}
        >
          <Animated.View style={{
            flexDirection: 'row',
            width: SCREEN_W * BANNERS_COUNT,
            height: 160,
            transform: [{ translateX: Animated.multiply(bannerAnim, -1) }],
          }}>
            {BANNERS.map(banner => (
              <View
                key={banner.id}
                style={{
                  width: SCREEN_W,
                  height: 160,
                  paddingHorizontal: 16,
                }}
              >
                <ImageBackground
                  source={{ uri: banner.img }}
                  style={{ flex: 1, borderRadius: 20, overflow: 'hidden' }}
                  imageStyle={{ borderRadius: 20 }}
                >
                  <View style={{
                    flex: 1,
                    backgroundColor: banner.overlay,
                    borderRadius: 20,
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}>
                    {/* شارة علوية */}
                    <View style={{ alignItems: 'flex-end' }}>
                      <View style={{
                        backgroundColor: 'rgba(255,255,255,0.22)',
                        borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
                        borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
                      }}>
                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{banner.badge}</Text>
                      </View>
                    </View>
                    {/* نص البانر */}
                    <View>
                      <Text style={{
                        color: '#fff', fontSize: 18, fontWeight: '900',
                        textAlign: 'right', marginBottom: 5,
                        textShadowColor: 'rgba(0,0,0,0.5)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 5,
                      }}>{banner.title}</Text>
                      <Text style={{
                        color: 'rgba(255,255,255,0.9)', fontSize: 11,
                        textAlign: 'right', lineHeight: 17,
                      }}>{banner.desc}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* نقاط المؤشر */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10, marginBottom: 2 }}>
          {[0, 1, 2].map(i => (
            <TouchableOpacity key={i} onPress={() => { isPaused.current = false; goToSlide(i); }} activeOpacity={0.7}>
              <View style={{
                height: 6, borderRadius: 3,
                width: i === activeDot ? 22 : 6,
                backgroundColor: i === activeDot ? '#0A2463' : '#DDE4EF',
              }} />
            </TouchableOpacity>
          ))}
        </View>



        <View style={s.statsRow}>
          {[['14','تخصص'],['+600','قطعة'],['3','أنواع'],['5','برامج']].map(([v,l],i)=>(
            <View key={i} style={s.statCard}><Text style={s.statVal}>{v}</Text><Text style={s.statLbl}>{l}</Text></View>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow} contentContainerStyle={{paddingHorizontal:14,gap:6}}>
          {filters.map(f=>(
            <TouchableOpacity key={f.id} style={[s.fchip,filter===f.id?s.fchipOn:s.fchipOff]} onPress={()=>setFilter(f.id)}>
              <Text style={[s.fchipTxt,{color:filter===f.id?'#fff':'#6B7C93'}]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── التخصصات ── */}
        <SHead title={t('allCategories')}/>
        <View style={{ paddingHorizontal: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {filtered.map(cat => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.85}
              style={{
                width: (SCREEN_W - 38) / 2,
                height: 72,
                backgroundColor: '#fff',
                borderRadius: 14,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#DDE4EF',
                flexDirection: 'row',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
              }}
            >
              {/* صورة على اليسار */}
              <ImageBackground
                source={{ uri: cat.img }}
                style={{ width: 68, height: '100%' }}
              >
                <View style={{
                  ...require('react-native').StyleSheet.absoluteFillObject,
                  backgroundColor: 'rgba(10,36,99,0.32)',
                }} />
              </ImageBackground>

              {/* محتوى على اليمين */}
              <View style={{
                flex: 1, paddingHorizontal: 9, paddingVertical: 8,
                justifyContent: 'space-between',
              }}>
                <Text style={{
                  fontSize: 11, fontWeight: '800', color: '#0A2463',
                  textAlign: 'right',
                }} numberOfLines={2}>{cat.label}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{
                    backgroundColor: cat.bbg, borderRadius: 6,
                    paddingHorizontal: 5, paddingVertical: 2,
                    borderWidth: 1, borderColor: cat.bc + '33',
                  }}>
                    <Text style={{ fontSize: 7, fontWeight: '700', color: cat.bc }} numberOfLines={1}>
                      {cat.badge}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 8, color: '#6B7C93' }}>{cat.count}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ══════════════════════════════════════════════
            آراء العملاء — أفقي انسيابي
        ══════════════════════════════════════════════ */}
        <View style={{ marginTop: 14 }}>

          {/* رأس القسم — الإطار الاحترافي */}
          <View style={{
            backgroundColor: '#0A2463', marginHorizontal: 14, borderRadius: 16,
            padding: 16, marginBottom: 14,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.18, shadowRadius: 6,
          }}>
            <View style={{ alignItems: 'flex-start', gap: 4 }}>
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '900' }}>آراء العملاء ⭐</Text>
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>
                {reviews.length} رأي — متوسط التقييم
              </Text>
              <StarRow rating={Math.round(Number(avgRating))} size={13} />
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14,
              paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
            }}>
              <Text style={{ color: '#F5A623', fontSize: 34, fontWeight: '900', lineHeight: 38 }}>{avgRating}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, marginTop: 2 }}>من 5.0</Text>
            </View>
          </View>

          {/* سكرول أفقي للبطاقات */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 14, gap: 12, paddingBottom: 4 }}
            decelerationRate="fast"
            snapToInterval={CARD_REVIEW_W + 12}
            snapToAlignment="start"
          >
            {reviews.map(rev => (
              <View key={rev.id} style={{
                width: CARD_REVIEW_W,
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: '#DDE4EF',
                borderTopWidth: 3,
                borderTopColor: rev.rating >= 5 ? '#0A7A3C' : rev.rating >= 4 ? '#0043B0' : '#B05200',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 6,
              }}>
                {/* رأس البطاقة */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <StarRow rating={rev.rating} size={14} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#0A2463' }}>{rev.name}</Text>
                      <Text style={{ fontSize: 8, color: '#6B7C93', marginTop: 1 }}>✓ موثق</Text>
                    </View>
                    <View style={{
                      width: 32, height: 32, borderRadius: 16,
                      backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center',
                      borderWidth: 1, borderColor: '#DDE4EF',
                    }}>
                      <Text style={{ fontSize: 14 }}>👤</Text>
                    </View>
                  </View>
                </View>
                {/* نص الرأي */}
                <Text style={{ fontSize: 11, color: '#0D1B2A', lineHeight: 18, textAlign: 'right' }}>
                  {rev.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* ══════════════════════════════════════════════
              حقل كتابة رأي جديد
          ══════════════════════════════════════════════ */}
          <View style={{
            backgroundColor: '#fff', marginHorizontal: 14, marginTop: 16,
            borderRadius: 16, borderWidth: 1.5, borderColor: '#0A2463', overflow: 'hidden',
          }}>
            {/* رأس الحقل */}
            <View style={{ backgroundColor: '#0A2463', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 18 }}>✍️</Text>
              <View>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>اكتب رأيك بالتطبيق</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 2 }}>رأيك يساعدنا على التحسين المستمر</Text>
              </View>
            </View>

            <View style={{ padding: 14 }}>

              {/* اسم المستخدم */}
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#0A2463', marginBottom: 6, textAlign: 'right' }}>
                الاسم
              </Text>
              {isLoggedIn ? (
                /* مسجل — يظهر اسمه بدون تعديل */
                <View style={{
                  backgroundColor: '#EEF2F7', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  borderWidth: 1, borderColor: '#DDE4EF', marginBottom: 12,
                }}>
                  <View style={{
                    backgroundColor: '#0A7A3C', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>مسجل ✓</Text>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A2463' }}>{user?.name}</Text>
                </View>
              ) : (
                /* غير مسجل — حقل إدخال الاسم */
                <TextInput
                  style={{
                    backgroundColor: '#EEF2F7', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
                    fontSize: 12, color: '#0D1B2A', textAlign: 'right',
                    borderWidth: 1, borderColor: '#DDE4EF', marginBottom: 12,
                  }}
                  placeholder="أدخل اسمك..."
                  placeholderTextColor="#6B7C93"
                  value={guestName}
                  onChangeText={setGuestName}
                />
              )}

              {/* التقييم بالنجوم */}
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#0A2463', marginBottom: 8, textAlign: 'right' }}>
                تقييمك للتطبيق *
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginBottom: 4 }}>
                {[1,2,3,4,5].map(i => (
                  <TouchableOpacity key={i} onPress={() => setNewRating(i)} activeOpacity={0.7}>
                    <Text style={{ fontSize: 32, color: i <= newRating ? '#F5A623' : '#DDE4EF' }}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {ratingLabel ? (
                <Text style={{ textAlign: 'center', fontSize: 11, color: '#6B7C93', marginBottom: 10 }}>{ratingLabel}</Text>
              ) : <View style={{ height: 10 }}/>}

              {/* حقل النص */}
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#0A2463', marginBottom: 6, textAlign: 'right' }}>
                رأيك *
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#EEF2F7', borderRadius: 12, padding: 12,
                  fontSize: 12, color: '#0D1B2A', textAlign: 'right',
                  textAlignVertical: 'top', minHeight: 80,
                  borderWidth: 1, borderColor: '#DDE4EF',
                }}
                placeholder="شاركنا رأيك وتجربتك مع التطبيق..."
                placeholderTextColor="#6B7C93"
                value={newText}
                onChangeText={setNewText}
                multiline
                numberOfLines={4}
                onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 350)}
              />

              {/* زر الإرسال */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#0A2463',
                  borderRadius: 12, paddingVertical: 13,
                  alignItems: 'center', marginTop: 12,
                  opacity: (newRating > 0 && newText.trim() && (isLoggedIn || guestName.trim())) ? 1 : 0.45,
                }}
                onPress={submitReview}
                activeOpacity={0.85}
              >
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>إرسال الرأي ⭐</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
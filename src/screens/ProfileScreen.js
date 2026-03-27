import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, BackHandler, Modal, TextInput } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { usePayment, PAYMENT_METHODS } from '../context/PaymentContext';
import { useTheme } from '../context/ThemeContext';
import { showAlert } from '../components/alertBridge';
import s from '../styles';
import SettingsScreen from './SettingsScreen';
import AuthScreen from './AuthScreen';
import NotificationsScreen from './NotificationsScreen';
import CouponsScreen from './CouponsScreen';
import WalletScreen from './WalletScreen';
import PurchaseDetailScreen from './PurchaseDetailScreen';
import SupportScreen from './SupportScreen';
import ReferralScreen from './ReferralScreen';

export default function ProfileScreen({ cartCount, onGoOrders, onGoProduct, initialTab, onTabSet, onNavigate }) {
  const { user, purchases, wishlist, logout, toggleWishlist, wallet, points } = useAuth();
  const { 
    preferredMethodId, 
    setPreferredMethod, 
    getPreferredMethod, 
    cardDetails, 
    bankDetails,
    updateCardDetails,
    updateBankDetails,
    saveCard,
    saveBankDetails,
    editCard,
    editBank
  } = usePayment();
  
  const theme = useTheme();
  
  // ✅ التعريف الصحيح لـ tab هنا لضمان عدم حدوث خطأ
  const [tab, setTab] = useState(initialTab || 'profile');
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showSupport, setShowSupport] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [fieldsExpanded, setFieldsExpanded] = useState(false);

  useEffect(() => {
    if (initialTab) { setTab(initialTab); onTabSet?.(); }
  }, [initialTab]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showSettings) { setShowSettings(false); return true; }
      if (showEditProfile) { setShowEditProfile(false); return true; }
      if (showNotifications) { setShowNotifications(false); return true; }
      if (showCoupons) { setShowCoupons(false); return true; }
      if (showWallet) { setShowWallet(false); return true; }
      if (selectedPurchase) { setSelectedPurchase(null); return true; }
      if (showSupport) { setShowSupport(false); return true; }
      if (showReferral) { setShowReferral(false); return true; }
      if (showPaymentModal) { setShowPaymentModal(false); return true; }
      return false;
    });
    return () => sub.remove();
  }, [showSettings, showEditProfile, showNotifications, showCoupons, showWallet, selectedPurchase, showSupport, showReferral, showPaymentModal]);

  useEffect(() => {
    if (showPaymentModal) {
      const currentMethod = PAYMENT_METHODS.find(m => m.id === preferredMethodId);
      if (currentMethod && currentMethod.id !== 'card' && currentMethod.id !== 'bank') {
        setFieldsExpanded(false);
      } else {
        setFieldsExpanded(true);
      }
    }
  }, [showPaymentModal, preferredMethodId]);

  if (showSettings) return <SettingsScreen onBack={() => setShowSettings(false)} onGoOrders={onGoOrders} />;
  if (showEditProfile) return <SettingsScreen onBack={() => setShowEditProfile(false)} onGoOrders={onGoOrders} initialScreen="editProfile" />;
  if (showNotifications) return <SettingsScreen onBack={() => setShowNotifications(false)} onGoOrders={onGoOrders} initialScreen="notifications" />;
  if (showCoupons) return <CouponsScreen onBack={() => setShowCoupons(false)} />;
  if (showWallet) return <WalletScreen onBack={() => setShowWallet(false)} />;
  if (selectedPurchase) return <PurchaseDetailScreen purchase={selectedPurchase} onBack={() => setSelectedPurchase(null)} />;
  if (showSupport) return <SupportScreen onBack={() => setShowSupport(false)} onNavigate={onNavigate} />;
  if (showReferral) return <ReferralScreen onBack={() => setShowReferral(false)} />;

  if (!user) return <AuthScreen onSuccess={dest => {
    if (dest === 'settings') setShowSettings(true);
  }} />;

  function handleDeleteWishlist(item) {
    showAlert('🗑️ حذف من المفضلة', `هل تريد حذف "${item.name}" من المفضلة؟`, [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => {
        toggleWishlist(item);
        showAlert('✅ تم الحذف', `تم حذف "${item.name}" من المفضلة`);
      }},
    ]);
  }

  const currentPreferred = getPreferredMethod();

  const menuItems = [
    { icon:'✏️', name:'تعديل الملف الشخصي', desc:'الاسم والبريد والصورة', bg:'#E6F0FF', onPress: () => setShowEditProfile(true) },
    { icon:'📦', name:'طلباتي', desc:'متابعة حالة الطلبات', bg:'#E6F7EE', onPress: onGoOrders },
    { icon:'🔔', name:'الإشعارات', desc:'إدارة التنبيهات', bg:'#FFF8E0', onPress: () => setShowNotifications(true) },
    { icon:'💼', name:'المحفظة والنقاط', desc:`رصيد المحفظة: ${wallet.toFixed(0)} | النقاط: ${points}`, bg:'#E6F7EE', onPress: () => setShowWallet(true) },
    { icon:'💳', name:'طرق الدفع', desc:`المفضل: ${currentPreferred.name}`, bg:'#FFF0E0', onPress: () => setShowPaymentModal(true) },
    { icon:'🎁', name:'نظام الإحالة', desc:'ادعُ أصدقاءك واكسب نقاطاً', bg:'#E6F0FF', onPress: () => setShowReferral(true) },
    { icon:'🏷️', name:'كوبونات الخصم', desc:'كودات الخصم والعروض الخاصة', bg:'#FFF8E0', onPress: () => setShowCoupons(true) },
    { icon:'🎫', name:'تذاكر الدعم', desc:'تواصل مع فريق الدعم', bg:'#F0F0FF', onPress: () => setShowSupport(true) },
    { icon:'⚙️', name:'الإعدادات', desc:'الأمان وكلمة المرور', bg:'#F0F4FF', onPress: () => setShowSettings(true) },
    { icon:'🚪', name:'تسجيل الخروج', desc:'الخروج من الحساب الحالي', bg:'#FFF0F0', danger: true, onPress: () => showAlert('تسجيل الخروج', 'هل تريد الخروج من حسابك؟', [{ text: 'إلغاء', style: 'cancel' }, { text: 'خروج', style: 'destructive', onPress: logout }]) },
  ];

  const TABS = [['profile', 'الملف الشخصي'], ['purchases', '🛒 مشترياتي'], ['wishlist', '❤️ مفضلتي']];

  const handlePaymentMethodPress = (methodId) => {
    const hasFields = (methodId === 'card' || methodId === 'bank');
    if (preferredMethodId === methodId && hasFields) {
      setFieldsExpanded(!fieldsExpanded);
    } else {
      setPreferredMethod(methodId);
      if (hasFields) setFieldsExpanded(true);
      else setFieldsExpanded(false);
    }
  };

  const inputStyle = {
    backgroundColor:'#F4F7FF', 
    paddingVertical: 8, 
    paddingHorizontal: 10,
    borderRadius:8, 
    marginBottom:8, 
    textAlign:'right', 
    color:'#333', 
    fontSize: 14,
    borderWidth:1, 
    borderColor:'#eee',
    underlineColorAndroid: 'transparent',
    height: 45, 
    includeFontPadding: false 
  };

  const getCardLogo = (type) => {
    if (type === 'visa') return 'https://www.globalbrandsmagazine.com/wp-content/uploads/2014/10/visa-1.jpg';
    if (type === 'mastercard') return 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
    return null;
  };

  return (
    <View style={{ flex:1, backgroundColor: theme.bg }}>
      {/* هيرو */}
      <View style={s.profileHero}>
        <View style={s.profileAvatarWrap}>
          <View style={s.profileAvatar}>
            <Text style={{ color:'#fff', fontSize:26, fontWeight:'900' }}>{user?.avatar || user?.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
        </View>
        <Text style={s.profileName}>{user?.name}</Text>
        <Text style={s.profileRole}>{user?.role}</Text>
        <View style={s.profileStatsRow}>
          {[
            [String(cartCount), 'السلة'],
            [String(wallet?.toFixed(0)||'0'), 'محفظة'],
            [String(points||0), 'نقاط'],
          ].map(([v,l],i) => (
            <View key={i} style={[s.pStat, i < 2 && { borderRightWidth:1, borderRightColor:'rgba(255,255,255,0.2)' }]}>
              <Text style={s.pStatVal}>{v}</Text>
              <Text style={s.pStatLbl}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* تبويبات */}
      <View style={{ flexDirection:'row', backgroundColor: theme.card, borderBottomWidth:1, borderBottomColor: theme.border }}>
        {TABS.map(([t,label]) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={{ flex:1, paddingVertical:12, alignItems:'center', borderBottomWidth:2.5, borderBottomColor: tab===t ? '#0078FF' : 'transparent' }}>
            <Text style={{ fontSize:11, fontWeight:'700', color: tab===t ? '#0078FF' : theme.subText }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false}>
        {tab === 'profile' && (
          <View style={{ paddingHorizontal:14, paddingTop:14, gap:8 }}>
            <View style={{ backgroundColor: theme.card, borderRadius:14, padding:14, borderWidth:1, borderColor: theme.border, marginBottom:4 }}>
              {[['📧','البريد الإلكتروني', user?.email], ['📱','رقم الجوال', user?.phone || '—'], ['💼','المسمى الوظيفي', user?.role]].map(([icon,label,val]) => (
                <View key={label} style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:8, borderBottomWidth:1, borderBottomColor: theme.border }}>
                  <Text style={{ fontSize:12, color: theme.text2 || theme.text, fontWeight:'600' }}>{val}</Text>
                  <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                    <Text style={{ fontSize:11, color: theme.subText }}>{label}</Text>
                    <Text style={{ fontSize:16 }}>{icon}</Text>
                  </View>
                </View>
              ))}
            </View>

            {menuItems.map((item,i) => (
              <TouchableOpacity key={i} style={[s.profileMenuItem, { backgroundColor: theme.card, borderColor: theme.border }, item.danger && { borderColor:'#FFD0D0', backgroundColor:'#FFF8F8' }]} activeOpacity={0.8} onPress={item.onPress || (() => {})}>
                <View style={[s.profileMenuIcon, { backgroundColor: item.bg }]}><Text style={{ fontSize:18 }}>{item.icon}</Text></View>
                <View style={{ flex:1 }}>
                  <Text style={[s.profileMenuName, { color: theme.text }, item.danger && { color:'#D32F2F' }]}>{item.name}</Text>
                  {item.desc ? <Text style={[s.profileMenuDesc, { color: theme.subText }]}>{item.desc}</Text> : null}
                </View>
                {!item.danger && <Text style={{ color: theme.subText, fontSize:20 }}>›</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* ✅ تبويب المشتريات المحدث مع عرض النقاط */}
        {tab === 'purchases' && (
          <View style={{ padding:14 }}>
            {!purchases || purchases.length === 0 ? (
              <View style={{ alignItems:'center', paddingVertical:60 }}>
                <Text style={{ fontSize:50, marginBottom:12 }}>🛒</Text>
                <Text style={{ fontSize:14, color: theme.text, fontWeight:'700', marginBottom:6 }}>لا توجد مشتريات</Text>
                <Text style={{ fontSize:11, color: theme.subText }}>اذهب للمتجر وابدأ التسوق</Text>
              </View>
            ) : (
              purchases.map((p, i) => {
                // حساب النقاط المكتسبة (نقطة لكل 100 ريال)
                const earnedPoints = Math.floor((p.price || 0) / 100); 
                
                return (
                  <TouchableOpacity 
                    key={i} 
                    onPress={() => setSelectedPurchase(p)} 
                    activeOpacity={0.85}
                    style={{
                      backgroundColor: theme.card, 
                      borderRadius:14, 
                      padding:12, 
                      borderWidth:1, 
                      borderColor: theme.border, 
                      marginBottom:10,
                      flexDirection:'row', 
                      alignItems:'center', 
                      gap:12,
                    }}
                  >
                    <View style={{ width:52, height:52, borderRadius:12, backgroundColor: theme.bg, overflow:'hidden' }}>
                      {p.img ? (
                        <Image source={{ uri: p.img }} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
                      ) : (
                        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                          <Text style={{ fontSize:22 }}>📦</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ flex:1 }}>
                      <Text style={{ fontSize:12, fontWeight:'700', color: theme.text, textAlign:'right' }} numberOfLines={1}>
                        {p.name}
                      </Text>
                      <Text style={{ fontSize:9, color: theme.subText, textAlign:'right', marginTop:2 }}>
                        {p.cat} • {p.date}
                      </Text>
                      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end', marginTop:6 }}>
                        <View style={{ alignItems:'flex-start', gap:3 }}>
                          <View style={{ backgroundColor: '#FFF8E0', borderRadius:6, paddingHorizontal:7, paddingVertical:2 }}>
                            <Text style={{ fontSize:9, color: '#B05200', fontWeight:'700' }}>🕐 تحت المراجعة</Text>
                          </View>
                          {p.couponCode && (
                            <View style={{ backgroundColor:'#FFF0E0', borderRadius:6, paddingHorizontal:7, paddingVertical:2 }}>
                              <Text style={{ fontSize:9, color:'#B05200', fontWeight:'700' }}>🏷️ {p.couponCode}</Text>
                            </View>
                          )}
                          {/* حاوية موحدة لطريقة الدفع والنقاط */}
                          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                            {p.payMethod && (
                              <View style={{ backgroundColor:'#F0F4FF', borderRadius:6, paddingHorizontal:7, paddingVertical:2, flexDirection:'row', alignItems:'center', gap:4 }}>
                                <Text style={{ fontSize:10 }}>
                                  {p.payMethod === 'wallet' ? '💰' : p.payMethod === 'card' ? '💳' : p.payMethod === 'bank' ? '🏦' : '💵'}
                                </Text>
                                <Text style={{ fontSize:9, color:'#0043B0', fontWeight:'700' }}>
                                  {p.payMethod === 'wallet' ? 'محفظة' : p.payMethod === 'card' ? 'بطاقة' : p.payMethod === 'bank' ? 'بنك' : 'عند الاستلام'}
                                </Text>
                              </View>
                            )}
                            {/* ✅ عرض النقاط المكتسبة */}
                            {earnedPoints > 0 && (
                              <View style={{ backgroundColor:'#FFF8E0', borderRadius:6, paddingHorizontal:7, paddingVertical:2, flexDirection:'row', alignItems:'center', gap:3 }}>
                                <Text style={{ fontSize:10 }}>⭐</Text>
                                <Text style={{ fontSize:9, color:'#B05200', fontWeight:'700' }}>{earnedPoints}</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <View style={{ alignItems:'flex-end' }}>
                          {p.couponDiscount > 0 && (
                            <Text style={{ fontSize:9, color:'#A0ADBF', textDecorationLine:'line-through' }}>
                              {p.originalPrice} ر.س
                            </Text>
                          )}
                          <Text style={{ fontSize:13, fontWeight:'900', color: p.couponDiscount > 0 ? '#0A7A3C' : '#0A2463' }}>
                            {p.price} ر.س
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        {tab === 'wishlist' && (
          <View style={{ padding:14 }}>
            {!wishlist || wishlist.length === 0 ? (
              <View style={{ alignItems:'center', paddingVertical:60 }}>
                <Text style={{ fontSize:50, marginBottom:12 }}>❤️</Text>
                <Text style={{ fontSize:14, color: theme.text, fontWeight:'700', marginBottom:6 }}>المفضلة فارغة</Text>
                <Text style={{ fontSize:11, color: theme.subText, textAlign:'center', lineHeight:18 }}>
                  اضغط على ❤️ بجانب أي منتج{'\n'}في المتجر لإضافته للمفضلة
                </Text>
              </View>
            ) : (
              wishlist.map((item, i) => (
                <View key={i} style={{
                  backgroundColor: theme.card, 
                  borderRadius:14, 
                  padding:12, 
                  borderWidth:1, 
                  borderColor:'#FFD6D6', 
                  marginBottom:10,
                  flexDirection:'row', 
                  alignItems:'center', 
                  gap:12,
                }}>
                  <TouchableOpacity
                    onPress={() => onGoProduct && onGoProduct(item)}
                    activeOpacity={0.85}
                    style={{ width:52, height:52, borderRadius:12, backgroundColor:'#FFF5F5', overflow:'hidden' }}
                  >
                    {item.img ? (
                      <Image source={{ uri:item.img }} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
                    ) : (
                      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
                        <Text style={{ fontSize:22 }}>📦</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex:1 }}
                    onPress={() => onGoProduct && onGoProduct(item)}
                    activeOpacity={0.85}
                  >
                    <Text style={{ fontSize:12, fontWeight:'700', color: theme.text, textAlign:'right' }} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize:9, color: theme.subText, textAlign:'right', marginTop:2 }}>
                      {item.cat}
                    </Text>
                    <Text style={{ fontSize:13, fontWeight:'900', color:'#D32F2F', textAlign:'right', marginTop:4 }}>
                      {item.price} ر.س
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteWishlist(item)}
                    style={{
                      width:34, height:34, borderRadius:17,
                      backgroundColor:'#FFF0F0',
                      alignItems:'center', justifyContent:'center',
                      borderWidth:1, borderColor:'#FFD0D0',
                    }}
                  >
                    <Text style={{ fontSize:14 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
        <View style={{ height:120 }} />
      </ScrollView>

      {/* ── مودال طرق الدفع ── */}
      {showPaymentModal && (
        <Modal visible={true} transparent animationType="slide">
          <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' }}>
            <View style={{ backgroundColor: theme.card, borderTopLeftRadius:20, borderTopRightRadius:20, paddingBottom:20, maxHeight:'90%' }}>
              <View style={{ padding:20, borderBottomWidth:1, borderBottomColor: theme.border, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <Text style={{ fontSize:18, fontWeight:'900', color: theme.text }}>طرق الدفع المتاحة</Text>
                <TouchableOpacity onPress={() => setShowPaymentModal(false)}><Text style={{ fontSize:16, color:'#f00', fontWeight:'700' }}>إغلاق</Text></TouchableOpacity>
              </View>
              
              <ScrollView style={{ padding:20 }}>
                <View style={{ marginBottom:20, padding:15, backgroundColor:'#F4F7FF', borderRadius:12, borderLeftWidth:4, borderLeftColor:'#0A2463' }}>
                  <Text style={{ fontSize:12, color:'#666' }}>رصيد محفظتك الحالي</Text>
                  <Text style={{ fontSize:22, fontWeight:'900', color:'#0A2463' }}>{wallet.toFixed(2)} ر.س</Text>
                </View>

                {PAYMENT_METHODS.map((method) => {
                  const isSelected = preferredMethodId === method.id;
                  const hasFields = (method.id === 'card' || method.id === 'bank');
                  const showFields = isSelected && hasFields && fieldsExpanded;

                  return (
                    <View key={method.id}>
                      <TouchableOpacity
                        onPress={() => handlePaymentMethodPress(method.id)}
                        style={{
                          flexDirection:'row', alignItems:'center', padding:12, marginBottom:0,
                          borderRadius:12, borderWidth:2,
                          borderColor: isSelected ? '#FFD166' : theme.border,
                          backgroundColor: isSelected ? '#FFF8E0' : theme.bg,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 0 }}>
                          <View style={{ 
                            width:50, height:50, borderRadius:12, 
                            backgroundColor: isSelected ? '#fff' : '#f9f9f9', 
                            alignItems:'center', justifyContent:'center', 
                            marginLeft:15,
                            borderWidth: 1,
                            borderColor: '#eee',
                            overflow: 'hidden'
                          }}>
                            {method.logoUrl ? (
                              <Image 
                                source={{ uri: method.logoUrl.trim() }} 
                                style={{ 
                                  width: method.id === 'applepay' ? 25 : 35,
                                  height: 35, 
                                  resizeMode: 'contain',
                                  alignSelf: 'center' 
                                }}
                                onError={() => console.log(`Failed to load icon for ${method.name}`)}
                              />
                            ) : (
                              method.iconLib === 'FontAwesome5' ? (
                                <FontAwesome5 name={method.iconName} size={26} color={isSelected ? '#B05200' : '#666'} />
                              ) : method.iconLib === 'MaterialCommunityIcons' ? (
                                <MaterialCommunityIcons name={method.iconName} size={26} color={isSelected ? '#B05200' : '#666'} />
                              ) : (
                                <Ionicons name={method.iconName} size={26} color={isSelected ? '#B05200' : '#666'} />
                              )
                            )}
                          </View>
                          
                          {isSelected && (
                            <View style={{ 
                              position: 'absolute', 
                              left: -10, 
                              top: -5,
                              backgroundColor: '#0A2463', 
                              borderRadius: 10, 
                              width: 20, 
                              height: 20, 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              borderWidth: 2,
                              borderColor: '#FFF8E0'
                            }}>
                              <Text style={{ color:'#fff', fontSize: 12, fontWeight: '900', lineHeight: 12 }}>✓</Text>
                            </View>
                          )}
                        </View>

                        <View style={{ flex: 1, marginLeft: 15, alignItems: 'flex-end' }}>
                          <Text style={{ 
                            fontSize: 15, 
                            fontWeight: isSelected ? '900' : '600', 
                            color: isSelected ? '#B05200' : theme.text,
                            textAlign: 'right',
                            width: '100%'
                          }}>
                            {method.name}
                          </Text>
                          <Text style={{ fontSize:11, color: theme.subText, textAlign: 'right' }}>{method.desc}</Text>
                          {method.id === 'wallet' && <Text style={{ fontSize:11, color:'#0A7A3C', marginTop:2, fontWeight:'700', textAlign: 'right' }}>الرصيد: {wallet.toFixed(2)} ر.س</Text>}
                        </View>
                      </TouchableOpacity>

                      {/* ── حقول بطاقة الائتمان ── */}
                      {showFields && method.id === 'card' && (
                        <View style={{ padding:15, backgroundColor:'#fff', marginHorizontal:10, marginTop:10, marginBottom:10, borderRadius:10, borderWidth:1, borderColor:'#FFD166' }}>
                          {!cardDetails.isSaved ? (
                            <>
                              <Text style={{ fontSize:12, fontWeight:'700', color:'#0A2463', marginBottom:10, textAlign:'right' }}>بيانات البطاقة الجديدة</Text>
                              <TextInput placeholder="رقم البطاقة" placeholderTextColor="#999" value={cardDetails.cardNumber} onChangeText={(text) => updateCardDetails('cardNumber', text)} keyboardType="number-pad" maxLength={19} style={inputStyle} />
                              
                              {cardDetails.cardType && (
                                <View style={{ alignItems: 'flex-start', marginBottom: 8, marginLeft: 10, height: 35, justifyContent: 'center' }}>
                                  <Image 
                                    source={{ uri: getCardLogo(cardDetails.cardType) }} 
                                    style={{ width: 60, height: 35, resizeMode: 'contain' }} 
                                  />
                                </View>
                              )}

                              <TextInput placeholder="اسم صاحب البطاقة" placeholderTextColor="#999" value={cardDetails.cardHolder} onChangeText={(text) => updateCardDetails('cardHolder', text)} style={inputStyle} />
                              <View style={{ flexDirection:'row', gap:10, marginBottom: 8 }}>
                                <View style={{ flex: 1.2 }}><TextInput placeholder="MM/YY" placeholderTextColor="#999" value={cardDetails.expiryDate} onChangeText={(text) => updateCardDetails('expiryDate', text)} keyboardType="number-pad" maxLength={5} style={{...inputStyle, marginBottom: 0}} /></View>
                                <View style={{ flex: 1 }}><TextInput placeholder="CVV" placeholderTextColor="#999" value={cardDetails.cvv} onChangeText={(text) => updateCardDetails('cvv', text)} keyboardType="number-pad" secureTextEntry maxLength={4} style={{...inputStyle, marginBottom: 0, letterSpacing: 2}} /></View>
                              </View>
                              <TouchableOpacity onPress={() => { const res = saveCard(); if(res.success) showAlert('✅ تم الحفظ بأمان', 'تم تشفير وحفظ بيانات البطاقة'); else showAlert('⚠️ خطأ', res.error); }} style={{ backgroundColor:'#0A2463', padding:12, borderRadius:8, alignItems:'center', marginTop:5 }}><Text style={{ color:'#fff', fontWeight:'700' }}>🔒 حفظ البطاقة بأمان</Text></TouchableOpacity>
                            </>
                          ) : (
                            <View style={{ alignItems:'center', padding:10 }}>
                              <View style={{ width:'100%', backgroundColor:'#0A2463', borderRadius:12, padding:20, marginBottom:10, elevation:5 }}>
                                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                                  {cardDetails.savedData.brandLogo ? (
                                    <Image source={{ uri: cardDetails.savedData.brandLogo }} style={{ width: 70, height: 40, resizeMode: 'contain' }} />
                                  ) : (
                                    <Text style={{ color:'#fff', fontSize:16, fontWeight:'900' }}>{cardDetails.savedData.brand.toUpperCase()}</Text>
                                  )}
                                </View>
                                <Text style={{ color:'#fff', fontSize:18, letterSpacing:2, marginBottom:15, fontFamily:'monospace' }}>{cardDetails.savedData.encryptedNumber}</Text>
                                <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                                  <View><Text style={{ color:'rgba(255,255,255,0.7)', fontSize:10 }}>صاحب البطاقة</Text><Text style={{ color:'#fff', fontSize:14 }}>{cardDetails.savedData.holder}</Text></View>
                                  <View><Text style={{ color:'rgba(255,255,255,0.7)', fontSize:10 }}>تنتهي في</Text><Text style={{ color:'#fff', fontSize:14 }}>{cardDetails.savedData.expiry}</Text></View>
                                </View>
                              </View>
                              <TouchableOpacity onPress={editCard} style={{ padding:8 }}><Text style={{ color:'#0A2463', fontWeight:'700', textDecorationLine:'underline' }}>تعديل البيانات</Text></TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}

                      {/* ── حقول التحويل البنكي ── */}
                      {showFields && method.id === 'bank' && (
                        <View style={{ padding:15, backgroundColor:'#fff', marginHorizontal:10, marginTop:10, marginBottom:10, borderRadius:10, borderWidth:1, borderColor:'#FFD166' }}>
                          {!bankDetails.isSaved ? (
                            <>
                              <Text style={{ fontSize:12, fontWeight:'700', color:'#0A2463', marginBottom:10, textAlign:'right' }}>بيانات التحويل البنكي</Text>
                              <TextInput placeholder="اسم البنك" placeholderTextColor="#999" value={bankDetails.bankName} onChangeText={(text) => updateBankDetails('bankName', text)} style={inputStyle} />
                              <TextInput placeholder="اسم صاحب الحساب" placeholderTextColor="#999" value={bankDetails.accountHolder} onChangeText={(text) => updateBankDetails('accountHolder', text)} style={inputStyle} />
                              <TextInput placeholder="رقم الحساب" placeholderTextColor="#999" value={bankDetails.accountNumber} onChangeText={(text) => updateBankDetails('accountNumber', text)} keyboardType="number-pad" style={inputStyle} />
                              <TouchableOpacity onPress={() => { const res = saveBankDetails(); if(res.success) showAlert('✅ تم الحفظ', 'تم حفظ بيانات البنك'); else showAlert('⚠️ خطأ', res.error); }} style={{ backgroundColor:'#0A2463', padding:12, borderRadius:8, alignItems:'center' }}><Text style={{ color:'#fff', fontWeight:'700' }}>حفظ بيانات البنك</Text></TouchableOpacity>
                            </>
                          ) : (
                            <View style={{ alignItems:'center', padding:10 }}>
                              <View style={{ width:'100%', backgroundColor:'#F4F7FF', borderRadius:12, padding:20, marginBottom:10, borderWidth:1, borderColor:'#0A2463' }}>
                                <View style={{ flexDirection:'row', alignItems:'center', marginBottom:15, justifyContent: 'flex-start' }}>
                                  <Text style={{ fontSize:24, marginLeft:10 }}>🏦</Text>
                                  <Text style={{ fontSize:18, fontWeight:'900', color:'#0A2463', textAlign: 'right' }}>{bankDetails.bankName}</Text>
                                </View>
                                <View style={{ marginBottom:10, alignItems: 'flex-end' }}>
                                  <Text style={{ fontSize:11, color:'#666' }}>اسم صاحب الحساب</Text>
                                  <Text style={{ fontSize:14, fontWeight:'700', color:'#333' }}>{bankDetails.accountHolder}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                  <Text style={{ fontSize:11, color:'#666' }}>رقم الحساب</Text>
                                  <Text style={{ fontSize:14, fontWeight:'700', color:'#333', fontFamily:'monospace' }}>{bankDetails.accountNumber}</Text>
                                </View>
                              </View>
                              <TouchableOpacity onPress={editBank} style={{ padding:8 }}><Text style={{ color:'#0A2463', fontWeight:'700', textDecorationLine:'underline' }}>تعديل البيانات</Text></TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
                
                <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={{ marginTop:20, backgroundColor:'#0A2463', padding:15, borderRadius:12, alignItems:'center' }}><Text style={{ color:'#fff', fontSize:16, fontWeight:'900' }}>حفظ وإغلاق</Text></TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
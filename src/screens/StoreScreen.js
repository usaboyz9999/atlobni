import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ImageBackground, Image, StyleSheet, Dimensions, Alert,
} from 'react-native';
import { useLang } from '../context/LangContext';
import { Stars } from '../components/shared';
import s from '../styles';
import { DETAIL_DATA } from '../data/detailData';
import { SPARE_PARTS_MAP } from '../data/sparePartsData';
import { STORE_CATS, STORE_ITEMS, getItemPrice, getPartPrice, HOME_PRODUCTS } from '../data/storeData';
import UserBar from '../components/UserBar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SCREEN_W = Dimensions.get('window').width;

// ─── شاشة تفاصيل المنتج ──────────────────────────────────────
function ProductDetailScreen({ item, color, bg, onBack, onAddToCart }) {
  const { toggleWishlist, isWishlisted, user } = useAuth();
  const wished = isWishlisted(item.id);
  const [added, setAdded] = useState(false);

  function handleWishlist() {
    if (!user) {
      Alert.alert('🔐 تسجيل الدخول مطلوب', 'يجب تسجيل الدخول أولاً لإضافة المنتجات للمفضلة', [
        { text: 'إلغاء', style: 'cancel' },
      ]);
      return;
    }
    toggleWishlist(item);
    if (!wished) Alert.alert('❤️ تمت الإضافة', `تم إضافة "${item.name}" إلى المفضلة`);
  }

  function handleAdd() {
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <View style={{ flex:1, backgroundColor:'#EEF2F7' }}>
      {/* صورة + رجوع */}
      <View style={{ height: 200, backgroundColor: bg || '#EEF2F7' }}>
        {item.img
          ? <Image source={{ uri: item.img }} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
          : <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
              <Text style={{ fontSize:64 }}>📦</Text>
            </View>
        }
        {/* overlay شفاف في الأسفل */}
        <View style={{
          position:'absolute', bottom:0, left:0, right:0, height:80,
          backgroundColor:'rgba(10,36,99,0.45)',
          justifyContent:'flex-end', paddingHorizontal:16, paddingBottom:12,
        }}>
          <Text style={{ color:'#fff', fontSize:15, fontWeight:'900' }} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
        {/* زر رجوع */}
        <TouchableOpacity onPress={onBack} style={{
          position:'absolute', top:14, right:14,
          backgroundColor:'rgba(255,255,255,0.9)', borderRadius:20,
          paddingHorizontal:14, paddingVertical:7, elevation:3,
        }}>
          <Text style={{ color:'#0A2463', fontSize:12, fontWeight:'700' }}>← رجوع</Text>
        </TouchableOpacity>
        {/* زر مفضلة */}
        <TouchableOpacity onPress={handleWishlist} style={{
          position:'absolute', top:14, left:14,
          width:40, height:40, borderRadius:20,
          backgroundColor: wished ? '#FFE0E0' : 'rgba(255,255,255,0.9)',
          alignItems:'center', justifyContent:'center', elevation:3,
        }}>
          <Text style={{ fontSize:20, opacity: user ? 1 : 0.4 }}>{wished ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding:16 }}>

          {/* السعر والكود */}
          <View style={{
            backgroundColor:'#fff', borderRadius:16, padding:14,
            borderWidth:1, borderColor:'#DDE4EF', marginBottom:12,
            flexDirection:'row', justifyContent:'space-between', alignItems:'center',
          }}>
            <View style={{ alignItems:'flex-start' }}>
              {item.code && <Text style={{ fontSize:10, color:'#A0ADBF', marginBottom:4 }}>{item.code}</Text>}
              {item.cat && (
                <View style={{ backgroundColor:(color||'#0A2463')+'20', borderRadius:8, paddingHorizontal:10, paddingVertical:4 }}>
                  <Text style={{ fontSize:10, fontWeight:'700', color: color||'#0A2463' }}>{item.cat}</Text>
                </View>
              )}
            </View>
            <View style={{ alignItems:'flex-end' }}>
              <Text style={{ fontSize:22, fontWeight:'900', color: color||'#0A2463' }}>{item.price} ر.س</Text>
              {item.stars && <Stars count={item.stars} />}
            </View>
          </View>

          {/* الوصف */}
          {item.desc && (
            <View style={{
              backgroundColor:'#fff', borderRadius:16, padding:14,
              borderWidth:1, borderColor:'#DDE4EF', marginBottom:12,
            }}>
              <Text style={{ fontSize:12, fontWeight:'800', color:'#0A2463', textAlign:'right', marginBottom:8 }}>
                وصف المنتج
              </Text>
              <Text style={{ fontSize:12, color:'#444', textAlign:'right', lineHeight:20 }}>{item.desc}</Text>
            </View>
          )}

          {/* مميزات */}
          <View style={{
            backgroundColor:'#fff', borderRadius:16, padding:14,
            borderWidth:1, borderColor:'#DDE4EF', marginBottom:12,
          }}>
            <Text style={{ fontSize:12, fontWeight:'800', color:'#0A2463', textAlign:'right', marginBottom:10 }}>
              مميزات المنتج
            </Text>
            {['ضمان الجودة', 'توصيل سريع', 'إرجاع مجاني خلال 7 أيام', 'دعم فني 24/7'].map((f, i) => (
              <View key={i} style={{ flexDirection:'row', alignItems:'center', justifyContent:'flex-end', gap:8, marginBottom:8 }}>
                <Text style={{ fontSize:12, color:'#444' }}>{f}</Text>
                <View style={{ width:22, height:22, borderRadius:11, backgroundColor:'#E6F7EE', alignItems:'center', justifyContent:'center' }}>
                  <Text style={{ fontSize:11 }}>✓</Text>
                </View>
              </View>
            ))}
          </View>

        </View>
        <View style={{ height:100 }} />
      </ScrollView>

      {/* زر إضافة للسلة */}
      <View style={{ padding:14, backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#EEF2F7' }}>
        <TouchableOpacity onPress={handleAdd} activeOpacity={0.85} style={{
          backgroundColor: added ? '#0A7A3C' : (color || '#0A2463'),
          borderRadius:14, paddingVertical:15, alignItems:'center',
          elevation:3, shadowColor: color||'#0A2463',
          shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:6,
        }}>
          <Text style={{ color:'#fff', fontSize:14, fontWeight:'800' }}>
            {added ? '✅ تمت الإضافة للسلة' : '🛒 أضف إلى السلة — ' + item.price + ' ر.س'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── بطاقة منتج ──────────────────────────────────────────────
function ProductCard({ name, desc, img, price, color, bg, code, stars, onAdd, item, onPress }) {
  const { toggleWishlist, isWishlisted, user } = useAuth();
  const wished = item ? isWishlisted(item.id) : false;

  function handleWishlist() {
    if (!user) {
      Alert.alert('🔐 تسجيل الدخول مطلوب', 'يجب تسجيل الدخول أولاً لإضافة المنتجات للمفضلة', [
        { text: 'إلغاء', style: 'cancel' },
      ]);
      return;
    }
    toggleWishlist(item);
    if (!wished) Alert.alert('❤️ تمت الإضافة', `تم إضافة "${name}" إلى المفضلة`);
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      style={{
        width: (SCREEN_W - 42) / 2,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#DDE4EF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 5,
      }}>
      {/* صورة */}
      <View style={{ height: 110, backgroundColor: bg || '#EEF2F7' }}>
        {img
          ? <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 32 }}>📦</Text>
            </View>
        }
        {/* Badge سعر */}
        <View style={{
          position: 'absolute', bottom: 6, left: 6,
          backgroundColor: color || '#0A2463',
          borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
        }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{price} ر.س</Text>
        </View>

      </View>

      {/* محتوى */}
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 11, fontWeight: '800', color: '#0A2463', textAlign: 'right', marginBottom: 3 }}
          numberOfLines={2}>{name}</Text>
        {desc
          ? <Text style={{ fontSize: 9, color: '#6B7C93', textAlign: 'right', lineHeight: 13, marginBottom: 4 }}
              numberOfLines={2}>{desc}</Text>
          : null
        }
        {code && <Text style={{ fontSize: 8, color: '#B0BEC5', textAlign: 'right', marginBottom: 4 }}>{code}</Text>}
        {stars && <Stars count={stars} />}

        {/* أزرار: أضف للسلة + مفضلة */}
        <View style={{ flexDirection:'row', gap:6, marginTop:8 }}>
          {/* زر المفضلة */}
          {item && (
            <TouchableOpacity
              onPress={handleWishlist}
              activeOpacity={0.8}
              style={{
                width: 38, height: 38, borderRadius: 10,
                backgroundColor: wished ? '#FFE0E0' : user ? '#F4F7FB' : '#F8F8F8',
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: wished ? '#FF6B6B' : user ? '#DDE4EF' : '#E8E8E8',
              }}
            >
              <Text style={{ fontSize: 17, opacity: user ? 1 : 0.4 }}>
                {wished ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          )}
          {/* زر إضافة للسلة */}
          <TouchableOpacity
            onPress={onAdd}
            activeOpacity={0.85}
            style={{
              flex: 1, backgroundColor: color || '#0A2463',
              borderRadius: 10, paddingVertical: 8, alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>+ أضف للسلة</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
function SectionTitle({ label, color, count }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 14, paddingVertical: 10,
      borderLeftWidth: 4, borderLeftColor: color || '#0A2463',
      backgroundColor: color ? color + '10' : '#F7F9FC',
      marginBottom: 10, marginTop: 6,
    }}>
      <Text style={{ fontSize: 10, color: color, fontWeight: '600' }}>{count} منتج</Text>
      <Text style={{ fontSize: 13, fontWeight: '900', color: color || '#0A2463' }}>{label}</Text>
    </View>
  );
}

export default function StoreScreen({ onAddToCart, initialProduct, onClearInitialProduct }) {
  const { t } = useLang();
  const theme = useTheme();
  const [selCatId,         setSelCatId]         = useState(null);
  const [selSubId,         setSelSubId]          = useState(null);
  const [selectedProduct,  setSelectedProduct]   = useState(
    initialProduct ? { item: initialProduct, color: '#0A2463', bg: '#EEF2F7' } : null
  );

  // مسح الـ initialProduct بعد الاستخدام
  React.useEffect(() => {
    if (initialProduct) {
      setSelectedProduct({ item: initialProduct, color: '#0A2463', bg: '#EEF2F7' });
      onClearInitialProduct?.();
    }
  }, [initialProduct]);

  const catData = selCatId ? DETAIL_DATA[selCatId] : null;
  const subCats = catData?.subCategories || [];
  const selSub  = subCats.find(s => s.id === selSubId);
  const spareParts = selCatId ? (SPARE_PARTS_MAP[selCatId] || []) : [];
  const cat = STORE_CATS.find(c => c.id === selCatId);

  // ─── شاشة تفاصيل المنتج ──────────────────────────────────
  if (selectedProduct) {
    return (
      <ProductDetailScreen
        item={selectedProduct.item}
        color={selectedProduct.color}
        bg={selectedProduct.bg}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    );
  }

  function handleSelectCat(id) {
    if (selCatId === id) { setSelCatId(null); setSelSubId(null); }
    else { setSelCatId(id); setSelSubId(null); }
  }

  return (
    <ScrollView style={[s.screen, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>

      {/* ── هيرو ── */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=700&q=80' }}
        style={{ height: 150 }}
      >
        <View style={{ flex:1, backgroundColor:'rgba(120,30,0,0.45)', justifyContent:'flex-end', padding:18 }}>
          <View style={{
            alignSelf:'flex-end', backgroundColor:'rgba(255,255,255,0.15)',
            borderRadius:20, paddingHorizontal:12, paddingVertical:5,
            borderWidth:1, borderColor:'rgba(255,255,255,0.25)', marginBottom:8,
          }}>
            <Text style={{ color:'#fff', fontSize:10, fontWeight:'700' }}>🛒 12 تخصص • +600 قطعة</Text>
          </View>
          <Text style={{ color:'#fff', fontSize:20, fontWeight:'900', textAlign:'right', marginBottom:3 }}>
            متجر قطع الغيار
          </Text>
          <Text style={{ color:'rgba(255,255,255,0.85)', fontSize:11, textAlign:'right' }}>
            توصيل سريع • ضمان الجودة • أسعار تنافسية
          </Text>
        </View>
      </ImageBackground>

      <UserBar />

      {/* ══════════════════════════════════════════════
          دوائر التخصصات
      ══════════════════════════════════════════════ */}
      <View style={{ paddingHorizontal:14, paddingTop:14, marginBottom:4 }}>
        <Text style={{ fontSize:14, fontWeight:'900', color:'#0A2463', textAlign:'right', marginBottom:10 }}>
          التخصصات
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal:14, gap:14, paddingBottom:10 }}
      >
        {STORE_CATS.map(c => {
          const on = selCatId === c.id;
          return (
            <TouchableOpacity key={c.id} onPress={() => handleSelectCat(c.id)}
              activeOpacity={0.85} style={{ alignItems:'center', gap:6 }}
            >
              <View style={{
                width:76, height:76, borderRadius:20, overflow:'hidden',
                borderWidth:2.5, borderColor: on ? c.color : c.color+'55',
                elevation: on ? 5 : 1,
                shadowColor: c.color, shadowOffset:{width:0,height:2},
                shadowOpacity: on ? 0.35 : 0.08, shadowRadius:6,
              }}>
                <Image source={{ uri:c.img }} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
                <View style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: on ? c.color+'CC' : c.color+'77',
                  alignItems:'center', justifyContent:'center',
                }}>
                  <Text style={{ fontSize:26 }}>{c.icon}</Text>
                </View>
              </View>
              <Text style={{
                fontSize:10, fontWeight:'700', textAlign:'center',
                color: on ? c.color : '#0A2463',
              }}>{c.label}</Text>
              {on && <View style={{ width:20, height:3, borderRadius:2, backgroundColor:c.color }} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ══════════════════════════════════════════════
          القوائم الفرعية للتخصص المختار
      ══════════════════════════════════════════════ */}
      {selCatId && subCats.length > 0 && (
        <View>
          <View style={{
            flexDirection:'row', alignItems:'center', justifyContent:'space-between',
            paddingHorizontal:14, paddingVertical:10,
          }}>
            <Text style={{ fontSize:10, color:'#6B7C93' }}>{subCats.length} قوائم</Text>
            <Text style={{ fontSize:13, fontWeight:'900', color: cat?.color || '#0A2463' }}>
              {cat?.icon}  قوائم {cat?.label}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal:14, gap:10, paddingBottom:8 }}
          >
            {subCats.map(sub => {
              const on = selSubId === sub.id;
              return (
                <TouchableOpacity key={sub.id} onPress={() => setSelSubId(on ? null : sub.id)}
                  activeOpacity={0.85}
                  style={{
                    width:130, borderRadius:16, overflow:'hidden',
                    borderWidth:2, borderColor: on ? sub.color : '#DDE4EF',
                    backgroundColor:'#fff',
                    elevation: on ? 4 : 1,
                  }}
                >
                  <View style={{ height:70 }}>
                    <Image source={{ uri:sub.img }} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
                    <View style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: on ? sub.color+'AA' : 'rgba(0,0,0,0.2)',
                      alignItems:'center', justifyContent:'center',
                    }}>
                      {on && <Text style={{ color:'#fff', fontSize:20, fontWeight:'900' }}>✓</Text>}
                    </View>
                  </View>
                  <View style={{ padding:8, backgroundColor: on ? sub.color : '#fff' }}>
                    <Text style={{ fontSize:10, fontWeight:'800', textAlign:'right',
                      color: on ? '#fff' : '#0A2463' }} numberOfLines={1}>{sub.label}</Text>
                    <Text style={{ fontSize:8, textAlign:'right', marginTop:2,
                      color: on ? 'rgba(255,255,255,0.8)' : '#6B7C93' }} numberOfLines={1}>{sub.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* ══════════════════════════════════════════════
          منتجات القائمة المختارة
      ══════════════════════════════════════════════ */}
      {selSub && selSub.items?.length > 0 && (
        <View>
          <SectionTitle
            label={`منتجات ${selSub.label}`}
            color={selSub.color}
            count={selSub.items.length}
          />
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:14 }}>
            {selSub.items.map((item, i) => {
              const subItem = { id: `${selSub.id}_item_${i}`, name: item.title, price: getItemPrice(selCatId, i), cat: cat?.label, img: item.img, stars: 4 };
              return (
              <ProductCard
                key={i}
                name={item.title}
                desc={item.desc}
                img={item.img}
                price={getItemPrice(selCatId, i)}
                color={selSub.color}
                bg={selSub.bg}
                item={subItem}
                onPress={() => setSelectedProduct({ item: subItem, color: selSub.color, bg: selSub.bg })}
                onAdd={() => onAddToCart(subItem)}
              />
            );})}
          </View>
        </View>
      )}

      {/* ══════════════════════════════════════════════
          قطع الغيار الأساسية للتخصص
      ══════════════════════════════════════════════ */}
      {selCatId && spareParts.length > 0 && (
        <View style={{ marginTop:8 }}>
          <SectionTitle
            label={`قطع غيار ${cat?.label}`}
            color={cat?.color}
            count={spareParts.length}
          />
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:14 }}>
            {spareParts.map((part, i) => {
              const partItem = { id: part.id || `part_${i}`, name: part.title, price: getPartPrice(selCatId, i), cat: cat?.label, img: part.images?.[0], stars: 4 };
              return (
              <ProductCard
                key={part.id || i}
                name={part.title}
                desc={part.desc}
                img={part.images?.[0]}
                price={getPartPrice(selCatId, i)}
                color={part.color}
                bg={part.bg}
                item={partItem}
                onPress={() => setSelectedProduct({ item: partItem, color: part.color, bg: part.bg })}
                onAdd={() => onAddToCart(partItem)}
              />
            );
            })}
          </View>
        </View>
      )}

      {/* ══════════════════════════════════════════════
          المنتجات المنزلية للتخصص
      ══════════════════════════════════════════════ */}
      {selCatId && HOME_PRODUCTS[selCatId]?.length > 0 && (
        <View style={{ marginTop:8 }}>
          {/* رأس قسم مميز للمنتجات المنزلية */}
          <View style={{
            marginHorizontal:14, marginBottom:12, marginTop:6,
            borderRadius:16, overflow:'hidden',
          }}>
            <View style={{
              backgroundColor:'#0A2463',
              flexDirection:'row', alignItems:'center', justifyContent:'space-between',
              paddingHorizontal:16, paddingVertical:12,
            }}>
              <View style={{
                backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10,
                paddingHorizontal:10, paddingVertical:4,
              }}>
                <Text style={{ color:'#fff', fontSize:10, fontWeight:'700' }}>
                  {HOME_PRODUCTS[selCatId].length} منتج
                </Text>
              </View>
              <View style={{ alignItems:'flex-end' }}>
                <Text style={{ color:'#fff', fontSize:14, fontWeight:'900' }}>
                  🏠 المنتجات المنزلية
                </Text>
                <Text style={{ color:'rgba(255,255,255,0.7)', fontSize:10, marginTop:2 }}>
                  مستلزمات وأدوات {cat?.label} للمنزل
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:14 }}>
            {HOME_PRODUCTS[selCatId].map((item, i) => {
              const homeItem = { id: item.id, name: item.name, price: item.price, cat: `منزلي - ${cat?.label}`, img: item.img, stars: item.stars };
              return (
              <ProductCard
                key={item.id}
                name={item.name}
                desc={item.desc}
                img={item.img}
                price={item.price}
                color={cat?.color}
                bg={cat?.bg}
                stars={item.stars}
                item={homeItem}
                onPress={() => setSelectedProduct({ item: homeItem, color: cat?.color, bg: cat?.bg })}
                onAdd={() => onAddToCart(homeItem)}
              />
            );
            })}
          </View>
        </View>
      )}

      {!selCatId && (
        <View>
          <SectionTitle label="المنتجات المميزة" color="#0A2463" count={STORE_ITEMS.length} />
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:14 }}>
            {STORE_ITEMS.map(item => {
              const storeItem = { ...item, cat: STORE_CATS.find(c=>c.id===item.cat)?.label };
              return (
              <ProductCard
                key={item.id}
                name={item.name}
                img={item.img}
                price={item.price}
                code={item.code}
                stars={item.stars}
                color={STORE_CATS.find(c=>c.id===item.cat)?.color || '#0A2463'}
                bg={STORE_CATS.find(c=>c.id===item.cat)?.bg}
                item={storeItem}
                onPress={() => setSelectedProduct({ item: storeItem, color: STORE_CATS.find(c=>c.id===item.cat)?.color, bg: STORE_CATS.find(c=>c.id===item.cat)?.bg })}
                onAdd={() => onAddToCart(storeItem)}
              />
            );
            })}
          </View>
        </View>
      )}

      <View style={{ height:100 }} />
    </ScrollView>
  );
}
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, Image,
} from 'react-native';
import s, { SAFE_BOTTOM } from '../styles';
import { DETAIL_DATA } from '../data/detailData';
import { SPARE_PARTS_MAP } from '../data/sparePartsData';

const CATS = [
  { id:'elec',    label:'الكهرباء',  icon:'⚡' },
  { id:'plumb',   label:'السباكة',   icon:'💧' },
  { id:'hvac',    label:'التكييف',   icon:'❄️' },
  { id:'fire',    label:'الحريق',    icon:'🔥' },
  { id:'civil',   label:'المدني',    icon:'🏗️' },
  { id:'elv',     label:'ELV',       icon:'📡' },
  { id:'elev',    label:'المصاعد',   icon:'🛗' },
  { id:'garden',  label:'الحدائق',   icon:'🌿' },
  { id:'parking', label:'المواقف',   icon:'🅿️' },
  { id:'clean',   label:'النظافة',   icon:'🧹' },
  { id:'tools',   label:'الأدوات',   icon:'🔧' },
  { id:'safety',  label:'السلامة',   icon:'🦺' },
  { id:'kitchen', label:'المطابخ',   icon:'🍳' },
  { id:'medical', label:'الطبي',     icon:'🏥' },
];

const PRIOS = ['عاجل', 'عالي', 'عادي', 'منخفض'];
const PRIO_COLOR = { 'عاجل':'#D32F2F','عالي':'#B05200','عادي':'#0043B0','منخفض':'#0A7A3C' };

// ─── بطاقة انسيابية صغيرة ───────────────────────────────────
function SlideCard({ label, desc, img, color, bg, checked, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 120,
        borderRadius: 14,
        backgroundColor: checked ? color : '#fff',
        borderWidth: 2,
        borderColor: checked ? color : '#DDE4EF',
        overflow: 'hidden',
        elevation: checked ? 4 : 1,
        shadowColor: color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: checked ? 0.25 : 0.05,
        shadowRadius: 6,
      }}
    >
      {/* صورة أو لون */}
      <View style={{ height: 64, backgroundColor: checked ? color + 'BB' : bg || '#EEF2F7', alignItems: 'center', justifyContent: 'center' }}>
        {img
          ? <Image source={{ uri: img }} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />
          : null
        }
        <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: checked ? 'rgba(0,0,0,0.3)' : img ? 'rgba(0,0,0,0.18)' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {checked && <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>✓</Text>}
        </View>
      </View>
      {/* نص */}
      <View style={{ padding: 8 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', color: checked ? '#fff' : '#0A2463', lineHeight: 13 }} numberOfLines={2}>{label}</Text>
        {desc
          ? <Text style={{ fontSize: 8, color: checked ? 'rgba(255,255,255,0.8)' : '#6B7C93', marginTop: 3, lineHeight: 11 }} numberOfLines={2}>{desc}</Text>
          : null
        }
      </View>
    </TouchableOpacity>
  );
}

// ─── رأس قسم مع عداد ─────────────────────────────────────────
function SectionHeader({ title, count, color }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 14 }}>
      {count > 0
        ? <View style={{ backgroundColor: color, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{count} مختار</Text>
          </View>
        : <View />
      }
      <Text style={[s.fieldLabel, { margin: 0 }]}>{title}</Text>
    </View>
  );
}

// theme applied inside
export default function NewOrderModal({ visible, onClose, onSubmit }) {
  const [title,     setTitle]     = useState('');
  const [desc,      setDesc]      = useState('');
  const [catId,     setCatId]     = useState(null);
  const [selCats,   setSelCats]   = useState([]);   // تخصصات متعددة
  const [selSubs,   setSelSubs]   = useState([]);   // القوائم
  const [selParts,  setSelParts]  = useState([]);   // قطع الغيار
  const [withParts, setWithParts] = useState(null);
  const [priority,  setPriority]  = useState('عادي');
  const [assign,    setAssign]    = useState('');

  // القوائم الفرعية لكل تخصص مختار
  const subsByCat = selCats
    .map(id => {
      const data = DETAIL_DATA[id];
      const subs = data?.subCategories || [];
      const cat  = CATS.find(c => c.id === id);
      return subs.length > 0 ? { id, label: cat?.label || id, icon: cat?.icon || '⚙️', color: cat?.color || '#0043B0', subs } : null;
    })
    .filter(Boolean);

  // قطع الغيار مجمّعة حسب كل قائمة مختارة (من جميع التخصصات)
  const allSubCats = subsByCat.flatMap(c => c.subs);
  const partsBySub = selSubs
    .map(subId => {
      const sub = allSubCats.find(s => s.id === subId);
      if (!sub) return null;
      const subItems = (sub.items || []).map(item => ({
        id: `${subId}_${item.icon || item.title}`,
        title: item.title,
        desc: item.desc,
        images: [item.img],
        color: sub.color,
        bg: sub.bg,
      }));
      return subItems.length > 0
        ? { id: subId, label: sub.label, color: sub.color, parts: subItems }
        : null;
    })
    .filter(Boolean);

  function toggleSub(id) {
    const isRemoving = selSubs.includes(id);
    setSelSubs(p => isRemoving ? p.filter(x => x !== id) : [...p, id]);
    if (isRemoving) {
      const sub = allSubCats.find(s => s.id === id);
      const subItemIds = (sub?.items || []).map(item => `${id}_${item.icon || item.title}`);
      setSelParts(p => p.filter(pid => !subItemIds.includes(pid)));
    }
  }
  function togglePart(id) {
    setSelParts(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }
  function reset() {
    setTitle(''); setDesc(''); setCatId(null); setSelCats([]);
    setSelSubs([]); setSelParts([]); setWithParts(null);
    setPriority('عادي'); setAssign('');
  }
  function handleSubmit() {
    if (!title.trim()) { Alert.alert('تنبيه', 'يرجى إدخال عنوان الطلب'); return; }
    if (selCats.length === 0) { Alert.alert('تنبيه', 'يرجى اختيار التخصص'); return; }
    const catLabels = selCats.map(id => CATS.find(c => c.id === id)?.label || id).join('، ');
    onSubmit({
      title: title.trim(), desc: desc.trim(),
      category: catLabels,
      catId:    selCats[0] || null,
      priority, assign: assign || 'غير محدد',
      status: 'pending',
      date: new Date().toLocaleDateString('ar-SA'),
      subCategories: selSubs,
      withParts: withParts || false,
      spareParts: withParts
        ? availableParts.filter(p => selParts.includes(p.id || p.title)).map(p => p.title)
        : [],
    });
    reset(); onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={[s.modalContainer, { maxHeight: '93%', paddingBottom: 0 }]}>

          {/* رأس */}
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>+ إنشاء طلب جديد</Text>
            <TouchableOpacity onPress={() => { reset(); onClose(); }} style={s.modalClose}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={s.modalBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* عنوان */}
            <Text style={s.fieldLabel}>عنوان الطلب *</Text>
            <TextInput style={s.fieldInput}
              placeholder="مثال: إصلاح عطل في لوحة الكهرباء"
              placeholderTextColor="#6B7C93" value={title} onChangeText={setTitle}
              textAlign="right" underlineColorAndroid="transparent" />

            {/* وصف */}
            <Text style={s.fieldLabel}>الوصف</Text>
            <TextInput style={[s.fieldInput, { height: 70, textAlignVertical: 'top', paddingTop: 10 }]}
              placeholder="اذكر تفاصيل المشكلة..." placeholderTextColor="#6B7C93"
              value={desc} onChangeText={setDesc} multiline textAlign="right"
              underlineColorAndroid="transparent" />

            {/* ══ التخصص (اختيار متعدد) ══ */}
            <Text style={s.fieldLabel}>التخصص * (يمكن اختيار أكثر من واحد)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingVertical: 4, paddingBottom: 8 }}
            >
              {CATS.map(c => {
                const on = selCats.includes(c.id) || catId === c.id;
                return (
                  <TouchableOpacity key={c.id} activeOpacity={0.8}
                    onPress={() => {
                      const isOn = selCats.includes(c.id);
                      const newCats = isOn
                        ? selCats.filter(x => x !== c.id)
                        : [...selCats, c.id];
                      setSelCats(newCats);
                      // catId = أول تخصص للقوائم الفرعية
                      if (!isOn) {
                        if (!catId) setCatId(c.id);
                      } else {
                        const next = newCats.find(x => x !== c.id) || null;
                        setCatId(newCats.length > 0 ? (catId === c.id ? next : catId) : null);
                        // مسح القوائم المرتبطة بهذا التخصص
                        setSelSubs([]);
                        setSelParts([]);
                      }
                    }}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 5,
                      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 22,
                      backgroundColor: on ? '#0A2463' : '#F0F4FF',
                      borderWidth: 1.5, borderColor: on ? '#0A2463' : '#DDE4EF',
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{c.icon}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: on ? '#fff' : '#0A2463' }}>{c.label}</Text>
                    {on && <Text style={{ color: '#6CF', fontSize: 10, fontWeight: '900' }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ══ القوائم الفرعية — قسم لكل تخصص ══ */}
            {subsByCat.map(catGroup => (
              <View key={catGroup.id}>
                {/* رأس التخصص */}
                <View style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  marginTop: 14, marginBottom: 8,
                }}>
                  {selSubs.filter(id => catGroup.subs.map(s => s.id).includes(id)).length > 0 && (
                    <View style={{ backgroundColor: catGroup.color || '#0043B0', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                        {selSubs.filter(id => catGroup.subs.map(s => s.id).includes(id)).length} مختار
                      </Text>
                    </View>
                  )}
                  <Text style={[s.fieldLabel, { margin: 0 }]}>
                    {catGroup.icon}  قوائم {catGroup.label}
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10, paddingBottom: 4, paddingHorizontal: 2 }}
                >
                  {catGroup.subs.map(sub => (
                    <SlideCard
                      key={sub.id}
                      label={sub.label}
                      desc={sub.desc}
                      img={sub.img}
                      color={sub.color}
                      bg={sub.bg}
                      checked={selSubs.includes(sub.id)}
                      onPress={() => toggleSub(sub.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            ))}

            {/* ══ خيار قطع الغيار ══ */}
            {selSubs.length > 0 && partsBySub.length > 0 && (
              <>
                <Text style={[s.fieldLabel, { marginTop: 14 }]}>هل الطلب مع قطع غيار؟</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
                  {[{ v: true, label: '✅ مع قطع غيار' }, { v: false, label: '🔧 بدون قطع غيار' }].map(opt => (
                    <TouchableOpacity key={String(opt.v)} onPress={() => { setWithParts(opt.v); setSelParts([]); }}
                      style={{
                        flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center',
                        backgroundColor: withParts === opt.v ? '#0A2463' : '#F0F4FF',
                        borderWidth: 1.5, borderColor: withParts === opt.v ? '#0A2463' : '#DDE4EF',
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: withParts === opt.v ? '#fff' : '#0A2463' }}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* ══ بطاقات قطع الغيار — صف منفصل لكل قائمة مختارة ══ */}
            {withParts === true && partsBySub.map(subGroup => (
              <View key={subGroup.id}>
                {/* رأس القائمة */}
                <View style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  marginTop: 12, marginBottom: 8,
                  paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#EEF2F7',
                }}>
                  {selParts.filter(p => subGroup.parts.map(x => x.id).includes(p)).length > 0 && (
                    <View style={{ backgroundColor: subGroup.color, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                        {selParts.filter(p => subGroup.parts.map(x => x.id).includes(p)).length} مختار
                      </Text>
                    </View>
                  )}
                  <Text style={{ fontSize: 12, fontWeight: '800', color: subGroup.color, textAlign: 'right' }}>
                    بطاقات {subGroup.label}
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10, paddingBottom: 6, paddingHorizontal: 2 }}
                >
                  {subGroup.parts.map(part => (
                    <SlideCard
                      key={part.id}
                      label={part.title}
                      desc={part.desc}
                      img={part.images?.[0]}
                      color={part.color}
                      bg={part.bg}
                      checked={selParts.includes(part.id)}
                      onPress={() => togglePart(part.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            ))}

            {/* ══ الأولوية ══ */}
            <Text style={[s.fieldLabel, { marginTop: 14 }]}>الأولوية</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              {PRIOS.map(p => (
                <TouchableOpacity key={p}
                  style={[s.prioChip, { borderColor: PRIO_COLOR[p] }, priority === p && { backgroundColor: PRIO_COLOR[p] }]}
                  onPress={() => setPriority(p)}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: priority === p ? '#fff' : PRIO_COLOR[p] }}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ══ المسؤول ══ */}
            <Text style={s.fieldLabel}>المسؤول عن التنفيذ</Text>
            <TextInput style={s.fieldInput} placeholder="اسم الفني أو القسم"
              placeholderTextColor="#6B7C93" value={assign} onChangeText={setAssign}
              textAlign="right" underlineColorAndroid="transparent" />

            <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={s.submitBtnTxt}>إرسال الطلب</Text>
            </TouchableOpacity>
            <View style={{ height: 24 + SAFE_BOTTOM }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
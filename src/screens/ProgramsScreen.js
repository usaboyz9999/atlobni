import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { useLang } from '../context/LangContext';
import s from '../styles';
import { useTheme } from '../context/ThemeContext';
import UserBar from '../components/UserBar';
import {
  PROGRAMS,
  PLUMB_MAINT_TABLE,
  ELEC_MAINT_TABLE,
  ELEC_CORRECTIVE,
  HVAC_MAINT_TABLE,
  HVAC_CORRECTIVE,
  ELV_MAINT_TABLE,
  ELV_CORRECTIVE,
  CIVIL_MAINT_TABLE,
  CIVIL_CORRECTIVE,
  FIRE_MAINT_TABLE,
  FIRE_CORRECTIVE,
  ELEV_MAINT_TABLE,
  ELEV_CORRECTIVE,
  GARDEN_MAINT_TABLE,
  GARDEN_CORRECTIVE,
  PARKING_MAINT_TABLE,
  PARKING_CORRECTIVE,
  CLEAN_MAINT_TABLE,
  CLEAN_CORRECTIVE,
  TOOLS_MAINT_TABLE,
  TOOLS_CORRECTIVE,
  SAFETY_MAINT_TABLE,
  SAFETY_CORRECTIVE,
} from '../data/programsData';

// ─────────────────────────────────────────────────────────────
// بيانات السباكة
// ─────────────────────────────────────────────────────────────
const PLUMB_CORRECTIVE = [
  { task:'اصلاح تسربات الانابيب والوصلات',    desc:'فحص وعزل مواقع التسرب واستبدال الوصلات التالفة'      },
  { task:'استبدال الحنفيات والصنابير التالفة', desc:'تغيير نقاط الاستهلاك المتآكلة او المكسورة'             },
  { task:'فك انسداد شبكات الصرف',              desc:'Spiral / Jet Cleaning لخطوط الصرف الداخلية'           },
  { task:'اصلاح او استبدال المضخات المعطلة',   desc:'تشخيص العطل واستبدال القطع او المضخة كاملة'            },
  { task:'معالجة مشاكل ضعف ضغط المياه',        desc:'فحص الشبكة والمضخات وضبط وحدة التحكم في الضغط'        },
  { task:'اصلاح اعطال السخانات',                desc:'استبدال عناصر التسخين والترموستات وصمامات الامان'      },
];

// ─────────────────────────────────────────────────────────────
// مكوّنات مشتركة
// ─────────────────────────────────────────────────────────────
function CollapseCard({ card, isOpen, onToggle, children }) {
  return (
    <View>
      <TouchableOpacity
        style={[s.progDetailCard, { borderColor: card.color + '55' }]}
        onPress={onToggle}
        activeOpacity={0.85}
      >
        <View style={[s.progDetailIconBox, { backgroundColor: card.bg }]}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: card.color }}>{card.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.progDetailTitle, { color: card.color }]}>{card.title}</Text>
          <Text style={s.progDetailDesc}>{card.desc}</Text>
        </View>
        <Text style={{ color: card.color, fontSize: 20, fontWeight: '700' }}>
          {isOpen ? '\u25B2' : '\u25BC'}
        </Text>
      </TouchableOpacity>
      {isOpen && children}
    </View>
  );
}

function MaintenanceTable({ tableData, color }) {
  const freqColor = {
    'يومي':'#0A7A3C','اسبوعي':'#0043B0','شهري':'#B05200',
    'ربع سنوي':'#5B2D8E','نصف سنوي':'#B83200','سنوي':'#B83200',
  };
  const freqBg = {
    'يومي':'#E6F7EE','اسبوعي':'#E6F0FF','شهري':'#FFF0E0',
    'ربع سنوي':'#F0EAFF','نصف سنوي':'#FFF0F0','سنوي':'#FFF0F0',
  };
  return (
    <View style={[s.tableContainer, { borderColor: color + '33' }]}>
      <View style={[s.tableHeader, { backgroundColor: color }]}>
        <Text style={[s.tableHeaderTxt, { flex: 0.8, textAlign: 'center' }]}>التكرار</Text>
        <Text style={[s.tableHeaderTxt, { flex: 1.2, textAlign: 'center' }]}>المهمة</Text>
        <Text style={[s.tableHeaderTxt, { flex: 2,   textAlign: 'right'  }]}>التفاصيل</Text>
      </View>
      {tableData.map((row, i) => (
        <View key={i} style={[s.tableRow, { backgroundColor: i % 2 === 0 ? '#fff' : '#F8FAFF' }]}>
          <View style={{ flex: 0.8, alignItems: 'center' }}>
            <View style={[s.freqBadge, { backgroundColor: freqBg[row.freq] || '#EEF2F7' }]}>
              <Text style={[s.freqBadgeTxt, { color: freqColor[row.freq] || '#333' }]}>{row.freq}</Text>
            </View>
          </View>
          <Text style={[s.tableCellSub,  { flex: 1.2, textAlign: 'center' }]}>{row.task}</Text>
          <Text style={[s.tableCellMain, { flex: 2,   textAlign: 'right'  }]}>{row.details}</Text>
        </View>
      ))}
    </View>
  );
}

function CorrectiveList({ items, color }) {
  return (
    <View style={[s.tableContainer, { borderColor: color + '33', padding: 12, gap: 10 }]}>
      {items.map((item, i) => (
        <View key={i} style={{
          backgroundColor: '#fff', borderRadius: 12, padding: 12,
          borderWidth: 1, borderColor: '#DDE4EF',
          borderRightWidth: 4, borderRightColor: color,
        }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#0A2463', textAlign: 'right', marginBottom: 4 }}>
            {item.task}
          </Text>
          <Text style={{ fontSize: 10, color: '#6B7C93', textAlign: 'right', lineHeight: 16 }}>
            {item.desc}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج الكهرباء — بدون قطع الغيار
// ─────────────────────────────────────────────────────────────
export function ElecProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0043B0', bg:'#E6F0FF' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'أعطال متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>الكهرباء والانظمة الكهربائية</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={ELEC_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={ELEC_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج التكييف — بدون قطع الغيار
// ─────────────────────────────────────────────────────────────
export function HvacProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0043B0', bg:'#E6F0FF' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'أعطال متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>التكييف والتهوية HVAC</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={HVAC_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={HVAC_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج السباكة — بدون قطع الغيار
// ─────────────────────────────────────────────────────────────
export function PlumbProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0043B0', bg:'#E6F0FF' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'أعطال متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>السباكة والصرف الصحي</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={PLUMB_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={PLUMB_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج الأنظمة منخفضة التيار
// ─────────────────────────────────────────────────────────────
export function ElvProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0043B0', bg:'#E6F0FF' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'أعطال متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>الأنظمة منخفضة التيار ELV</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={ELV_MAINT_TABLE}  color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={ELV_CORRECTIVE}       color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج السلامة المهنية ومعدات الحماية
// ─────────────────────────────────────────────────────────────
export function SafetyProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0A7A3C', bg:'#E6F7EE' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'مشاكل متكررة وأساليب المعالجة', color:'#B83200', bg:'#FFF0F0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>السلامة المهنية ومعدات الحماية</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={SAFETY_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={SAFETY_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج الأدوات ومعدات الورشة
// ─────────────────────────────────────────────────────────────
export function ToolsProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#B05200', bg:'#FFF0E0' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'اعطال متكررة واساليب المعالجة', color:'#B83200', bg:'#FFF0F0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>الأدوات ومعدات الورشة</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={TOOLS_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={TOOLS_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج خدمات النظافة
// ─────────────────────────────────────────────────────────────
export function CleanProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0A7A3C', bg:'#E6F7EE' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'مشاكل متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>خدمات النظافة وإدارة المرافق</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={CLEAN_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={CLEAN_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج المواقف والطرق الداخلية
// ─────────────────────────────────────────────────────────────
export function ParkingProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0043B0', bg:'#E6F0FF' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'أعطال متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>المواقف والطرق الداخلية</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={PARKING_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={PARKING_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج الحدائق والري
// ─────────────────────────────────────────────────────────────
export function GardenProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0A7A3C', bg:'#E6F7EE' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'أعطال متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>الحدائق والري الخارجي</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={GARDEN_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={GARDEN_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج المصاعد والأبواب الأوتوماتيكية
// ─────────────────────────────────────────────────────────────
export function ElevProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0A7A3C', bg:'#E6F7EE' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'أعطال متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>المصاعد والأبواب الأوتوماتيكية</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={ELEV_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={ELEV_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج الحماية من الحريق
// ─────────────────────────────────────────────────────────────
export function FireProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#B83200', bg:'#FFF0F0' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'أعطال متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>أنظمة الحماية من الحريق</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={FIRE_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={FIRE_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// شاشة برامج الأعمال المدنية والمباني
// ─────────────────────────────────────────────────────────────
export function CivilProgramScreen({ onBack }) {
  const [openCard, setOpenCard] = useState(null);
  const toggle = (id) => setOpenCard(openCard === id ? null : id);

  const cards = [
    { id:'prev', icon:'🛡️', title:'برنامج الصيانة الوقائية',    desc:'جدول الصيانة الدورية المنتظمة', color:'#0043B0', bg:'#E6F0FF' },
    { id:'corr', icon:'🔧', title:'الصيانة التصحيحية الشائعة', desc:'أعطال متكررة وأساليب المعالجة', color:'#B05200', bg:'#FFF0E0' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.programsHeader, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Text style={s.backBtnTxt}>رجوع</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.programsTitle}>الأعمال المدنية والمباني</Text>
          <Text style={s.programsSub}>برامج الصيانة</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 14, gap: 12 }}>
          {cards.map(card => (
            <CollapseCard key={card.id} card={card} isOpen={openCard === card.id} onToggle={() => toggle(card.id)}>
              {card.id === 'prev' && <MaintenanceTable tableData={CIVIL_MAINT_TABLE} color={card.color} />}
              {card.id === 'corr' && <CorrectiveList   items={CIVIL_CORRECTIVE}      color={card.color} />}
            </CollapseCard>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// الشاشة الرئيسية للبرامج
// ─────────────────────────────────────────────────────────────
export default function ProgramsScreen() {
  const { t } = useLang();
  const theme = useTheme();
  const [selected,  setSelected]  = useState(null);
  const [subScreen, setSubScreen] = useState(null);

  if (subScreen === 'elec')    return <ElecProgramScreen    onBack={() => setSubScreen(null)} />;
  if (subScreen === 'hvac')    return <HvacProgramScreen    onBack={() => setSubScreen(null)} />;
  if (subScreen === 'plumb')   return <PlumbProgramScreen   onBack={() => setSubScreen(null)} />;
  if (subScreen === 'elv')     return <ElvProgramScreen     onBack={() => setSubScreen(null)} />;
  if (subScreen === 'civil')   return <CivilProgramScreen   onBack={() => setSubScreen(null)} />;
  if (subScreen === 'fire')    return <FireProgramScreen    onBack={() => setSubScreen(null)} />;
  if (subScreen === 'elev')    return <ElevProgramScreen    onBack={() => setSubScreen(null)} />;
  if (subScreen === 'garden')  return <GardenProgramScreen  onBack={() => setSubScreen(null)} />;
  if (subScreen === 'parking') return <ParkingProgramScreen onBack={() => setSubScreen(null)} />;
  if (subScreen === 'clean')   return <CleanProgramScreen   onBack={() => setSubScreen(null)} />;
  if (subScreen === 'tools')   return <ToolsProgramScreen   onBack={() => setSubScreen(null)} />;
  if (subScreen === 'safety')  return <SafetyProgramScreen  onBack={() => setSubScreen(null)} />;

  const specialties = [
    { id:'elec',    label:'الكهرباء',         icon:'⚡', color:'#0043B0', bg:'#E6F0FF', img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=70' },
    { id:'hvac',    label:'التكييف',           icon:'❄️', color:'#0A7A3C', bg:'#E6F7EE', img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=70' },
    { id:'plumb',   label:'السباكة',           icon:'💧', color:'#5B2D8E', bg:'#F0EAFF', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70' },
    { id:'elv',     label:'ELV',               icon:'📡', color:'#B05200', bg:'#FFF0E0', img:'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&q=70' },
    { id:'civil',   label:'المدني',            icon:'🏗️', color:'#0043B0', bg:'#E6F0FF', img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=70' },
    { id:'fire',    label:'الحريق',            icon:'🔥', color:'#B83200', bg:'#FFF0F0', img:'https://cdn.salla.sa/WxOwP/LjR0VieekqHnZTYDjovTkV1VeERw0cokGVWIM9Qm.jpg' },
    { id:'elev',    label:'المصاعد',           icon:'🛗', color:'#0A7A3C', bg:'#E6F7EE', img:'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=70' },
    { id:'garden',  label:'الحدائق',           icon:'🌿', color:'#0A7A3C', bg:'#E6F7EE', img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=70' },
    { id:'parking', label:'المواقف',           icon:'🅿️', color:'#0043B0', bg:'#E6F0FF', img:'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300&q=70' },
    { id:'clean',   label:'النظافة',           icon:'🧹', color:'#0A7A3C', bg:'#E6F7EE', img:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=70' },
    { id:'tools',   label:'الأدوات',           icon:'🔧', color:'#B05200', bg:'#FFF0E0', img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=70' },
    { id:'safety',  label:'السلامة',           icon:'🦺', color:'#0A7A3C', bg:'#E6F7EE', img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=70' },
  ];

  return (
    <View style={[s.screen, { backgroundColor: theme.bg }]}>

      {/* ── صورة الهيرو ── */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80' }}
        style={{ width: '100%', height: 160 }}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(10,36,99,0.45)',
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}>
          {/* شارة علوية */}
          <View style={{
            alignSelf: 'flex-end',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
            marginBottom: 10,
          }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
              📋 12 تخصص • 5 برامج
            </Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', textAlign: 'right', marginBottom: 4 }}>
            برامج الصيانة
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, textAlign: 'right' }}>
            اختر التخصص أو البرنامج الزمني المناسب
          </Text>
        </View>
      </ImageBackground>

      <UserBar />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* ── التخصصات ── */}
        <Text style={[s.secHeadTxt, { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 }]}>
          التخصصات
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14, gap: 12, paddingBottom: 10 }}
        >
          {specialties.map(sp => (
            <TouchableOpacity
              key={sp.id}
              onPress={() => setSubScreen(sp.id)}
              activeOpacity={0.85}
              style={{
                width: 90, alignItems: 'center', gap: 8,
              }}
            >
              {/* البطاقة بالصورة */}
              <View style={{
                width: 90, height: 90, borderRadius: 20, overflow: 'hidden',
                borderWidth: 2, borderColor: sp.color + '55',
                elevation: 3, shadowColor: sp.color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2, shadowRadius: 6,
              }}>
                <Image
                  source={{ uri: sp.img }}
                  style={{ width: 90, height: 90 }}
                  resizeMode="cover"
                />
                {/* تعتيم */}
                <View style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: sp.color + 'BB',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 28 }}>{sp.icon}</Text>
                </View>
              </View>
              {/* الاسم */}
              <Text style={{
                fontSize: 11, fontWeight: '700', color: sp.color,
                textAlign: 'center',
              }}>{sp.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── البرامج العامة ── */}
        <Text style={[s.secHeadTxt, { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 }]}>
          البرامج العامة
        </Text>
        {PROGRAMS.map(prog => (
          <View key={prog.id}>
            <TouchableOpacity
              style={[s.programCard, { borderLeftColor: prog.color, backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => setSelected(selected === prog.id ? null : prog.id)}
              activeOpacity={0.85}
            >
              <View style={[s.programIconWrap, { backgroundColor: prog.bg }]}>
                <Text style={{ fontSize: 22 }}>{prog.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.programTitle, { color: prog.color }]}>{prog.title}</Text>
                <Text style={s.programCount}>{prog.tasks.length} مهام</Text>
              </View>
              <Text style={{ color: prog.color, fontSize: 18 }}>
                {selected === prog.id ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {selected === prog.id && (
              <View style={[s.tasksContainer, { borderColor: prog.color + '55', backgroundColor: theme.card }]}>
                <Text style={[s.tasksSectionTitle, { color: prog.color }]}>مهام {prog.title}</Text>
                {prog.tasks.map((task, i) => (
                  <View key={i} style={s.taskRow}>
                    <View style={[s.taskDot, { backgroundColor: prog.color }]} />
                    <Text style={s.taskText}>{task}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}
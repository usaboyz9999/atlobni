import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { Badge, Chip, SHead } from '../components/shared';
import s, { CARD_W } from '../styles';
import { DETAIL_DATA } from '../data/detailData';

const { width } = Dimensions.get('window');
const GRID_W = (width - 42) / 2;

// ─────────────────────────────────────────────────────────────
// قطع غيار الكهرباء
// ─────────────────────────────────────────────────────────────
const ELEC_SPARE_PARTS = [
  { id:'breakers',     title:'قواطع كهربائية بأحجام مختلفة',    desc:'MCB احادي وثلاثي الطور - MCCB للأحمال الكبيرة',     color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'fuses',        title:'فيوزات واحتياطيات',                desc:'Fuses بأحجام متعددة - قواعد فيوز',                  color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'relays',       title:'ريلات وكنتاكتورات',                desc:'Relays 24V/220V - Contactors للمحركات - Timers',     color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'lighting',     title:'وحدات اضاءة',                      desc:'LED Drivers - LED Bulbs - Fluorescent Tubes',        color:'#B07800', bg:'#FFF8E0', images:['https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'cables',       title:'كابلات واسلاك بأقطار قياسية',      desc:'Power Cables 4mm-300mm - Control Cables',            color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'ups',          title:'بطاريات UPS ومولدات',               desc:'VRLA Batteries 12V - مولدات ديزل - ATS Panels',     color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'transformers', title:'محولات تيار وجهد',                  desc:'Current Transformers CT - Voltage Transformers VT',  color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80'] },
  { id:'meters',       title:'ادوات قياس محمولة',                  desc:'Digital Multimeter - Clamp Meter - Insulation Tester', color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// قطع غيار السباكة
// ─────────────────────────────────────────────────────────────
const PLUMB_SPARE_PARTS = [
  { id:'faucets',   title:'حنفيات وصنابير احتياطية',     desc:'حنفيات مياه باردة وساخنة - صنابير خارجية',           color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1565190939947-76b1bbe8cb8e?w=300&q=80'] },
  { id:'floats',    title:'عوامات خزانات ومحابس تعويم',  desc:'عوامات بلاستيكية - محابس تعويم نحاس',               color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1565190939947-76b1bbe8cb8e?w=300&q=80','https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'gaskets',   title:'جوانات وأربطة انابيب',         desc:'Gaskets مطاطية - شريط تيفلون - O-Ring',             color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'impellers', title:'ريش مضخات واختام ميكانيكية',   desc:'Impellers - Mechanical Seals - بلبيرينجات',         color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80'] },
  { id:'heaters',   title:'عناصر تسخين وترموستات',        desc:'Heating Elements - ترموستات - صمامات امان',         color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'filters',   title:'فلاتر مياه ومواد تنقية',       desc:'فلاتر رواسب - كربون - غشاء RO',                     color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80','https://images.unsplash.com/photo-1565190939947-76b1bbe8cb8e?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&q=80'] },
  { id:'pipes',     title:'مواسير ووصلات بأقطار مختلفة', desc:'PPR - PVC - HDPE - نحاس - وصلات',                   color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1565190939947-76b1bbe8cb8e?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// قطع غيار التكييف
// ─────────────────────────────────────────────────────────────
const HVAC_SPARE_PARTS = [
  { id:'hvac_filters',  title:'فلاتر هواء بأحجام وأنواع مختلفة', desc:'G4 - F7 - HEPA H13/H14 - Carbon Filters',            color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80'] },
  { id:'belts',         title:'أحزمة مراوح',                       desc:'V-Belts مقاسات A/B/C - Timing Belts',               color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'motors',        title:'محركات مراوح بأحجام قياسية',        desc:'Fan Motors 0.18kW-11kW - AC/DC - ECM Motors',       color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80'] },
  { id:'compressors',   title:'ضواغط صغيرة للإصلاحات العاجلة',    desc:'Hermetic Compressors 1-5 HP - Scroll - Rotary',     color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'gas',           title:'غاز تبريد',                          desc:'R410A - R134a - R407C - R32 - اسطوانات 11.3kg',    color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'valves',        title:'صمامات توسع وفلاتر مجففة',           desc:'TXV/EEV Expansion Valves - Filter Driers',          color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80'] },
  { id:'hvac_sensors',  title:'مستشعرات حرارة ورطوبة احتياطية',    desc:'Temperature Sensors NTC/PT100 - Humidity Sensors',  color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'oils',          title:'زيوت ضواغط ومواد تنظيف كيميائية',   desc:'Compressor Oil POE 68/100 - Coil Cleaner',          color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// قطع غيار الحدائق والري الخارجي
// ─────────────────────────────────────────────────────────────
const GARDEN_SPARE_PARTS = [
  { id:'sprinklers', title:'رشاشات بأنواع وأحجام مختلفة',          desc:'Pop-up Sprinklers 4"/6"، Rotor، Drip Emitters 2/4/8 LPH',      color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'valves',     title:'صمامات كهربائية 24V احتياطية',          desc:'Solenoid Valves 3/4" - 2" ، صمامات نهاية الخط وتنظيم الضغط',  color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80'] },
  { id:'pipes',      title:'أنابيب ووصلات بأقطار قياسية',           desc:'PVC/HDPE/PE من 20mm إلى 110mm، كوع، تيه، وصلات سريعة',        color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'filters',    title:'فلاتر وشبكات تنقية احتياطية',            desc:'Disc Filters، Screen Filters، فلاتر رمل للأنظمة الكبيرة',     color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'fertilizer', title:'أسمدة ومبيدات مرخصة',                    desc:'سماد NPK، Foliar Feed، مبيدات حشرية وفطرية - مخزنة بأمان',    color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'plants',     title:'بذور وشتلات احتياطية',                    desc:'بذور عشب موسمي، شتلات زهور، نباتات تعويض للفراغات',            color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'hoses',      title:'أدوات ري يدوية',                          desc:'خراطيم بأطوال 15/25/50م، فوهات متعددة الأنماط، وصلات سريعة',  color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'pump_parts', title:'قطع غيار مضخات الري',                    desc:'أختام ميكانيكية، ريش مضخة، جوانات، بلبيرينجات، أغطية تشغيل',  color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// قطع غيار المصاعد والأبواب الأوتوماتيكية
// ─────────────────────────────────────────────────────────────
const ELEV_SPARE_PARTS = [
  { id:'sensors',   title:'مستشعرات حركة وأجهزة كاشفة',            desc:'Photoelectric Sensors، PIR، حساسات أبواب، Proximity Switches',   color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'belts',     title:'أحزمة وبكرات للأبواب الأوتوماتيكية',     desc:'Drive Belts، Timing Belts، بكرات توجيه وإرشاد بأقطار مختلفة',    color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'relays',    title:'ريلات وكنتاكتورات للوحات التحكم',         desc:'Relays 24V/220V، Contactors، Timer Relays، مصهرات احتياطية',    color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'ropes',     title:'كابلات فولاذية احتياطية للمصاعد',          desc:'Steel Wire Ropes 8/10/12مم بأطوال قياسية - مطابقة لمعايير EN81', color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'emergency', title:'مفاتيح طوارئ وأزرار استدعاء',              desc:'Emergency Stop Switches، Call Buttons، لوحات تحكم كابينة',       color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'grease',    title:'زيوت تشحيم متخصصة',                        desc:'Lithium Grease للمرشحات، Silicone Oil للأختام، Gear Oil ISO 220', color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'motors',    title:'محركات صغيرة للطوارئ',                     desc:'DC Motors 12/24V للبوابات - محركات احتياطية للأبواب الأوتوماتيكية', color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'tools',     title:'أدوات ضبط ومعايرة ميدانية',                desc:'Speed Tester، Load Cell، أدوات معايرة Governor، مقياس ميلان',    color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// قطع غيار ومواد السلامة المهنية
// ─────────────────────────────────────────────────────────────
const SAFETY_SPARE_PARTS = [
  { id:'helmets',   title:'خوذات ونظارات وكمامات احتياطية',            desc:'خوذات بيضاء/صفراء/حمراء، نظارات واضحة وداكنة، كمامات N95/FFP2', color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'gloves',    title:'قفازات بأنواع متعددة',                       desc:'نتريل، جلد طبيعي، كيماوي، حراري، عزل كهربائي - بأحجام S/M/L/XL', color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'boots',     title:'أحذية سلامة بأرقام قياسية',                  desc:'أحذية فولاذية مضادة للثقب وللانزلاق - مقاسات 38 إلى 47',        color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'aed',       title:'بطاريات وأقطاب لأجهزة AED',                  desc:'بطاريات AED بعمر 4-5 سنوات، Electrode Pads للبالغين والأطفال',   color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1584982751601-97ddc0501b0e?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'gasdet',    title:'غازات معايرة لأجهزة الكشف',                   desc:'Calibration Gas H2S/CO/O2/LEL، Multi Gas - اسطوانات بتركيزات معتمدة', color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'harness',   title:'حبال وأحزمة أمان احتياطية',                   desc:'Full Body Harness معايير EN361/ANSI، Lanyards Shock Absorbing',  color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'firstaid',  title:'مستلزمات إسعافات أولية',                      desc:'ضمادات معقمة، مطهرات، مسكنات، جبائر قابلة للطي، بطانيات حرارية', color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1584982751601-97ddc0501b0e?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'signs',     title:'علامات سلامة بلاستيكية/معدنية',               desc:'لافتات تحذير ISO، علامات خطر، ممنوع، لافتات Muster Point',       color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// قطع غيار ومواد الأدوات ومعدات الورشة
// ─────────────────────────────────────────────────────────────
const TOOLS_SPARE_PARTS = [
  { id:'brushes',   title:'فرش محركات لأدوات شائعة',                  desc:'Motor Brushes للدريلات والطاحنات وماكينات اللحام - بأحجام قياسية', color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'batteries', title:'بطاريات احتياطية وشواحن',                   desc:'18V و12V Li-Ion بطاريات لأدوات لاسلكية - شواحن أحادية ومزدوجة', color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'cables',    title:'كابلات كهربائية ومقابس صناعية',              desc:'كابلات تمديد 25م/50م، مقابس صناعية 16A/32A، شرائط عزل',         color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'filters',   title:'فلاتر هواء وزيوت لضواغط صغيرة',             desc:'Air Filters، Oil Separators، Compressor Oil - وفق موديل الضاغط', color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'welding',   title:'أقطاب لحام وأسلاك MIG/TIG',                 desc:'Electrodes E6013/E7018، MIG Wire 0.8/1.0mm، TIG Rods - ألومنيوم وحديد', color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'discs',     title:'شفرات مناشير وأقراص طحن',                   desc:'Cutting Discs 115/125mm، Flap Discs، Saw Blades بأحجام قياسية',  color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'meters',    title:'قطع غيار أدوات قياس',                        desc:'مجسات Probes، بطاريات 9V للملتيمتر، شاشات عرض، مشابك قياس',     color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'lubricate', title:'مواد تشحيم وتنظيف للأدوات',                  desc:'زيوت متعددة الأغراض WD-40، شحوم ليثيوم، منظف قطع، سبراي تشحيم', color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// مواد وقطع غيار خدمات النظافة
// ─────────────────────────────────────────────────────────────
const CLEAN_SPARE_PARTS = [
  { id:'bags',      title:'أكياس نفايات بأحجام وألوان مختلفة',       desc:'أسود 120L، أخضر 80L، أحمر للخطرة، أصفر للطبي - للفرز الصحيح',  color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'cleaners',  title:'منظفات ومطهرات مركزة',                     desc:'منظف أرضيات، مطهر 5% كلور، مزيل حجر، منظف زجاج - مع MSDS',     color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'equip',     title:'قطع غيار معدات التنظيف',                   desc:'فرش غسالة أرضيات، بطاريات مكانس، فلاتر شفاطات، مبدلات',        color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'washroom',  title:'مستلزمات دورات المياه',                     desc:'صابون سائل، مناديل ورقية، معقم يد، معطرات هواء تلقائية',        color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80'] },
  { id:'pest',      title:'مصائد حشرات وقوارض احتياطية',               desc:'لاصق حشرات، فخاخ فئران، بيت صراصير، طعوم قوارض آمنة',          color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80'] },
  { id:'ppe',       title:'معدات حماية شخصية لفريق النظافة',           desc:'قفازات مطاطية ونايلون، كمامات، نظارات، أحذية أمان، سترات عاكسة', color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'tools',     title:'أدوات تنظيف يدوية',                          desc:'مجارف، فرشات سلك وبلاستيك، مساحات زجاج، دلاء، عربات تنظيف',    color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80'] },
  { id:'absorbent', title:'مواد امتصاص للانسكابات',                    desc:'Absorbent Pads للزيوت والمواد الكيميائية، Granules لإعادة التجميع', color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// مواد وقطع غيار المواقف والطرق الداخلية
// ─────────────────────────────────────────────────────────────
const PARKING_SPARE_PARTS = [
  { id:'asphalt',    title:'مواد إصلاح أسفلت سريعة',                  desc:'Cold Patch أسفلت بارد للترقيع، Emulsion، بايمر أسفلتي',         color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'interlock',  title:'بلاط إنترلوك احتياطي',                     desc:'من نفس الدفعة واللون - سُمك 6/8سم - رملية وحمراء وبيضاء',       color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'paint',      title:'دهانات طرق عاكسة',                          desc:'Road Marking Paint: أبيض، أصفر، أزرق - مقاومة للمرور والحرارة', color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'drains',     title:'مصافط مياه بأحجام قياسية',                  desc:'Catch Basins 30x30 و40x40سم - أغطية حديد زهر وبلاستيك',        color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'anchors',    title:'مسامير تثبيت وأوتاد توسعة',                 desc:'Anchors & Expansion Bolts للافتات والمطبات والحواجز بأحجام مختلفة', color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'studs',      title:'أزرار طرق عاكسة احتياطية',                  desc:'Road Studs عاكسة أحادية وثنائية - عيون قطة - أصفر وأحمر وأبيض', color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'sealant',    title:'مواد عزل وتسريب للشقوق',                    desc:'Bitumen Sealant، Polyurethane PU، Crack Filler للشقوق الدقيقة',  color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'tools',      title:'أدوات تطبيق يدوية',                          desc:'مجارف، مداحق آسفلت، فرش دهان، آلات خط، أوعية خلط يدوية',       color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// مواد وقطع غيار الأعمال المدنية
// ─────────────────────────────────────────────────────────────
const CIVIL_SPARE_PARTS = [
  { id:'paint',     title:'معجون حوائط ودهانات بألوان قياسية',       desc:'دهان داخلي بلاستيك وخارجي، معجون جبسي، بايمر - بألوان قياسية',     color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'tiles',     title:'بلاط وسيراميك احتياطي',                    desc:'سيراميك ورخام احتياطي من نفس الدفعة - لاصق بلاط - فيوجات',         color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'glass',     title:'زجاج وأختام مطاطية للنوافذ',               desc:'زجاج مقسى 6/8/10مم - EPDM Rubber Seals - Silicone للنوافذ',        color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'sealants',  title:'حشوات فواصل التمدد',                        desc:'Silicone Sealant، Polyurethane PU Sealant، مسدود الشقوق',          color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'waterproof',title:'مواد عزل مائي',                             desc:'أسمنت عازل، بيتومين، أغشية Bituminous Membrane، Crystalline',     color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'fixings',   title:'مسامير وبراغي ومثبتات',                    desc:'Anchors، Rawl Bolts، مسامير جبس، براغي ستانلس بأحجام متنوعة',     color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'ceiling',   title:'ألواح أسقف معلقة احتياطية',                desc:'ألواح جبس بورد، أرمسترونج، ألمنيوم - بروفيلات معدنية احتياطية',   color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'] },
  { id:'repair',    title:'أدوات إصلاح سريعة',                         desc:'إيبوكسي هيكلي، لاصق بناء قوي، رغوة بولي يوريثان، فيلر خشب',     color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1559825481-12a05cc00344?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// قطع غيار الأنظمة منخفضة التيار
// ─────────────────────────────────────────────────────────────
const ELV_SPARE_PARTS = [
  { id:'cameras',     title:'كاميرات مراقبة IP احتياطية',       desc:'IP Cameras 4MP/8MP - Dome & Bullet - PoE & Non-PoE',          color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'nvr',         title:'مسجلات NVR/DVR وهاردات تخزين',     desc:'NVR 16/32 CH - HDD Surveillance 4TB/8TB - RAID Storage',      color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'access',      title:'قفالات وقارئات بطاقات احتياطية',    desc:'Magnetic Locks 280KG - Card Readers - Fingerprint Modules',   color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&q=80'] },
  { id:'network',     title:'سويتشات وكابلات شبكة',              desc:'POE Switches 8/24 Port - Cable UTP CAT6/6A - Patch Panels',   color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1523475496153-3c6e8ce9db35?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80'] },
  { id:'psu',         title:'وحدات طاقة وUPS صغيرة',             desc:'Power Supply 12V/24V - Mini UPS 1KVA - Battery Backup Units', color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'sensors',     title:'حساسات حركة وأجهزة إنذار',          desc:'PIR Motion Sensors - Door/Window Contacts - Sirens/Strobes',  color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80'] },
  { id:'cables_elv',  title:'كابلات منخفضة التيار متنوعة',        desc:'Coaxial RG59/RG6 - شيلد - HDMI - Fiber Patch Cables',        color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80','https://images.unsplash.com/photo-1523475496153-3c6e8ce9db35?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// قطع غيار الحريق
// ─────────────────────────────────────────────────────────────
const FIRE_SPARE_PARTS = [
  { id:'detectors',    title:'كواشف دخان وحرارة احتياطية',      desc:'Smoke Detectors بصري وأيوني - Heat Detectors ثابت وتفاضلي',    color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'batteries',    title:'بطاريات لوحة الانذار',              desc:'Sealed Lead Acid 12V/7Ah - 12V/12Ah - بطاريات احتياطية FACP',  color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
  { id:'extinguishers',title:'طفايات حريق احتياطية',              desc:'Powder 6kg - CO2 5kg - Foam 9L - Water 9L بأنواع مختلفة',     color:'#B05200', bg:'#FFF0E0', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80'] },
  { id:'sprinklers',   title:'فوهات رشاشات بأحجام قياسية',        desc:'Sprinkler Heads 68°C - 93°C - Upright & Pendent & Sidewall',   color:'#0043B0', bg:'#E6F0FF', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'hoses',        title:'خراطيم حريق وفوهات',                 desc:'Fire Hoses 1.5 - 2.5 بوصة - Nozzles جيت ورذاذ - بكرات',     color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'valves_fire',  title:'صمامات تحكم وقطع حريق',              desc:'Gate Valves - Ball Valves - Check Valves - OS&Y Valves',       color:'#5B2D8E', bg:'#F0EAFF', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'call_points',  title:'مفاتيح يدوية للانذار',               desc:'Manual Call Points - Break Glass - Weatherproof بأنواع مختلفة', color:'#B83200', bg:'#FFF0F0', images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80'] },
  { id:'test_tools',   title:'ادوات اختبار الكواشف',               desc:'Smoke Tester Spray - Heat Gun - FACP Test Equipment',          color:'#0A7A3C', bg:'#E6F7EE', images:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80','https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80','https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&q=80','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80','https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80'] },
];

// ─────────────────────────────────────────────────────────────
// قوائم التكييف
// ─────────────────────────────────────────────────────────────
const HVAC_SUB_LISTS = [
  { id:'central',    label:'انظمة التكييف المركزي',  desc:'Chillers & AHUs & Cooling Towers', color:'#0043B0', bg:'#E6F0FF', img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80', items:[{icon:'A',title:'وحدات المعالجة الهوائية AHUs',desc:'مراوح، فلاتر، ملفات تبريد وتسخين',img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80'},{icon:'B',title:'وحدات التكثيف Chillers',desc:'Chillers هوائية ومائية',img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80'},{icon:'C',title:'ابراج التبريد Cooling Towers',desc:'ابراج تبريد مفتوحة ومغلقة',img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80'},{icon:'D',title:'انظمة توزيع الهواء',desc:'Ducts - مخارج - مشعبات - Dampers',img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80'},{icon:'E',title:'انظمة التحكم',desc:'Thermostats - BMS - VFDs',img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80'}] },
  { id:'split',      label:'انظمة التكييف المنفصلة', desc:'Split & VRF & Window Units',       color:'#0A7A3C', bg:'#E6F7EE', img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80', items:[{icon:'A',title:'مكيفات الشباك Window Units',desc:'وحدات نافذة - تبريد وتدفئة',img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80'},{icon:'B',title:'مكيفات السبليت والمولتي سبليت',desc:'Split & Multi-Split - Cassette - Duct',img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80'},{icon:'C',title:'انظمة VRF/VRV المتقدمة',desc:'Variable Refrigerant Flow',img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80'}] },
  { id:'ventilation',label:'انظمة التهوية',            desc:'Exhaust & Supply & Heat Recovery', color:'#B05200', bg:'#FFF0E0', img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80', items:[{icon:'A',title:'مراوح الشفط والتغذية',desc:'Exhaust & Supply Fans',img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80'},{icon:'B',title:'انظمة استرداد الحرارة',desc:'Heat Recovery Units HRV/ERV',img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80'},{icon:'C',title:'مراوح الحمامات والمطابخ',desc:'مع مصائد الدهون Grease Traps',img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80'},{icon:'D',title:'انظمة ضغط السلالم',desc:'Staircase Pressurization',img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80'}] },
  { id:'control_rh', label:'انظمة التحكم والرطوبة',   desc:'BMS & Sensors & Air Quality',     color:'#5B2D8E', bg:'#F0EAFF', img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80', items:[{icon:'A',title:'اجهزة استشعار الحرارة والرطوبة',desc:'Temperature & Humidity Sensors - CO2',img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80'},{icon:'B',title:'منظمات الرطوبة',desc:'Humidifiers & Dehumidifiers',img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80'},{icon:'C',title:'انظمة تنقية الهواء',desc:'HEPA Filters H13/H14 - UV Sterilizers',img:'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&q=80'}] },
];

// ─────────────────────────────────────────────────────────────
// مكوّن مشترك: شبكة مربعات 2×N
// ─────────────────────────────────────────────────────────────
function SquareGrid({ items, onPress }) {
  return (
    <View style={{ flexDirection:'row', flexWrap:'wrap', gap:12, paddingHorizontal:14, paddingTop:14 }}>
      {items.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={{ width:GRID_W, borderRadius:16, overflow:'hidden', backgroundColor:'#fff', borderWidth:1, borderColor:item.color+'33', elevation:2 }}
          onPress={() => onPress && onPress(item)}
          activeOpacity={0.85}
        >
          <ImageBackground source={{ uri:item.img }} style={{ height:110 }}>
            <View style={{ flex:1, backgroundColor:item.color+'CC', justifyContent:'flex-end', padding:10 }}>
              <Text style={{ color:'#fff', fontSize:11, fontWeight:'900', textAlign:'right', lineHeight:16 }}>
                {item.label || item.title}
              </Text>
            </View>
          </ImageBackground>
          <View style={{ padding:10 }}>
            <Text style={{ fontSize:9, color:'#6B7C93', textAlign:'right', lineHeight:14 }}>{item.desc}</Text>
            <View style={{ marginTop:6, alignItems:'flex-end' }}>
              <View style={{ backgroundColor:item.bg, borderRadius:6, paddingHorizontal:8, paddingVertical:3 }}>
                <Text style={{ fontSize:9, fontWeight:'700', color:item.color }}>
                  {item.items ? item.items.length + ' انواع' : 'عرض المحتوى'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// مكوّن: تفاصيل قائمة مفتوحة (للتكييف والحريق)
// ─────────────────────────────────────────────────────────────
function ListDetail({ list, onBack }) {
  return (
    <View style={{ padding:14, gap:10 }}>
      <TouchableOpacity
        style={{ flexDirection:'row', alignItems:'center', gap:8, backgroundColor:list.bg, borderRadius:12, padding:12, marginBottom:4 }}
        onPress={onBack} activeOpacity={0.8}
      >
        <Text style={{ fontSize:16, color:list.color, fontWeight:'700' }}>{'<'}</Text>
        <Text style={{ fontSize:13, fontWeight:'800', color:list.color }}>{list.label}</Text>
      </TouchableOpacity>
      {list.items.map((item, j) => (
        <View key={j} style={{ backgroundColor:'#fff', borderRadius:12, overflow:'hidden', borderWidth:1, borderColor:list.color+'33' }}>
          <ImageBackground source={{ uri:item.img }} style={{ height:90 }}>
            <View style={{ flex:1, backgroundColor:list.color+'CC', justifyContent:'center', paddingHorizontal:12 }}>
              <Text style={{ color:'#fff', fontSize:13, fontWeight:'800', textAlign:'right' }}>{item.title}</Text>
            </View>
          </ImageBackground>
          <View style={{ padding:10 }}>
            <Text style={{ fontSize:10, color:'#6B7C93', textAlign:'right', lineHeight:16 }}>{item.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// مكوّن قطع الغيار
// ─────────────────────────────────────────────────────────────
function SparePartsSection({ parts, title }) {
  return (
    <View style={{ gap:14, padding:14 }}>
      <Text style={[s.secHeadTxt, { paddingHorizontal:0, paddingTop:4 }]}>
        {title || 'قطع الغيار الاساسية'}
      </Text>
      {parts.map((part, i) => (
        <View key={i} style={{ backgroundColor:'#fff', borderRadius:14, overflow:'hidden', borderWidth:1, borderColor:'#DDE4EF', borderTopWidth:3, borderTopColor:part.color }}>
          <View style={{ padding:12, paddingBottom:8 }}>
            <Text style={{ fontSize:13, fontWeight:'800', color:part.color, textAlign:'right' }}>{part.title}</Text>
            <Text style={{ fontSize:10, color:'#6B7C93', textAlign:'right', marginTop:3, lineHeight:15 }}>{part.desc}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal:10, paddingBottom:12, gap:8 }}>
            {part.images.map((uri, j) => (
              <View key={j} style={{ width:90, height:90, borderRadius:10, overflow:'hidden', borderWidth:1, borderColor:part.color+'44' }}>
                <Image source={{ uri }} style={{ width:90, height:90 }} resizeMode="cover" />
              </View>
            ))}
          </ScrollView>
          <View style={{ paddingHorizontal:12, paddingBottom:10, alignItems:'flex-end' }}>
            <View style={{ backgroundColor:part.bg, borderRadius:8, paddingHorizontal:10, paddingVertical:3 }}>
              <Text style={{ fontSize:9, fontWeight:'700', color:part.color }}>{part.images.length} صور</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// SubDetailScreen
// ─────────────────────────────────────────────────────────────
export function SubDetailScreen({ sub, onBack }) {
  return (
    <View style={{ flex:1 }}>
      <ImageBackground source={{ uri:sub.img }} style={s.detailHero}>
        <View style={[s.heroOverlay, { backgroundColor:sub.color+'CC' }]} />
        <View style={s.detailContent}>
          <TouchableOpacity style={s.backBtn} onPress={onBack}>
            <Text style={s.backBtnTxt}>رجوع</Text>
          </TouchableOpacity>
          <Text style={s.detailTitle}>{sub.label}</Text>
          <Text style={s.detailSub}>{sub.desc}</Text>
        </View>
      </ImageBackground>
      <ScrollView style={{ flex:1, backgroundColor:'#EEF2F7' }} showsVerticalScrollIndicator={false}>
        <View style={{ padding:14, gap:12 }}>
          {(sub.items || []).map((item, i) => (
            <TouchableOpacity key={i} style={s.subItemCard} activeOpacity={0.85}>
              <ImageBackground source={{ uri:item.img }} style={s.subItemImg} imageStyle={{ borderTopLeftRadius:14, borderTopRightRadius:14 }}>
                <View style={[s.subItemImgOverlay, { backgroundColor:sub.color+'BB' }]} />
                <View style={s.subItemImgContent}>
                  <Text style={s.subItemIcon}>{item.icon}</Text>
                  <Text style={s.subItemTitle}>{item.title}</Text>
                </View>
              </ImageBackground>
              <View style={[s.subItemFooter, { borderTopColor:sub.color+'33' }]}>
                <Text style={s.subItemDesc}>{item.desc}</Text>
                <View style={[s.badge, { backgroundColor:sub.bg }]}>
                  <Text style={[s.badgeTxt, { color:sub.color }]}>تفاصيل</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height:20 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// DetailScreen
// ─────────────────────────────────────────────────────────────
export default function DetailScreen({ catId, onBack }) {
  const [tab, setTab]                           = useState('preventive');
  const [selectedSub, setSelectedSub]           = useState(null);
  const [selectedList, setSelectedList]         = useState(null);

  const data = DETAIL_DATA[catId];
  if (!data) return null;

  // ── Sub-detail للكهرباء والسباكة ──
  if (data.isSubCat && selectedSub) {
    return <SubDetailScreen sub={selectedSub} onBack={() => setSelectedSub(null)} />;
  }

  // ── isSubCat: شبكة مربعات ──
  if (data.isSubCat) {

    // تحديد أي قائمة فرعية خاصة
    const isHvac  = catId === 'hvac';
    const isFire  = catId === 'fire';
    const usesExternalLists = isHvac || isFire;
    const externalLists = isHvac ? HVAC_SUB_LISTS : data.subCategories;

    // قطع الغيار حسب التخصص
    const spareParts = catId === 'elec'    ? ELEC_SPARE_PARTS
                     : catId === 'plumb'   ? PLUMB_SPARE_PARTS
                     : catId === 'hvac'    ? HVAC_SPARE_PARTS
                     : catId === 'fire'    ? FIRE_SPARE_PARTS
                     : catId === 'elv'     ? ELV_SPARE_PARTS
                     : catId === 'civil'   ? CIVIL_SPARE_PARTS
                     : catId === 'elev'    ? ELEV_SPARE_PARTS
                     : catId === 'garden'  ? GARDEN_SPARE_PARTS
                     : catId === 'parking' ? PARKING_SPARE_PARTS
                     : catId === 'clean'   ? CLEAN_SPARE_PARTS
                     : catId === 'tools'   ? TOOLS_SPARE_PARTS
                     : catId === 'safety'  ? SAFETY_SPARE_PARTS
                     : null;

    const spareTitle = catId === 'elec'    ? 'قطع الغيار الاساسية للكهرباء'
                     : catId === 'plumb'   ? 'قطع الغيار الاساسية للسباكة'
                     : catId === 'hvac'    ? 'قطع الغيار الاساسية للتكييف'
                     : catId === 'fire'    ? 'قطع الغيار الاساسية للحريق'
                     : catId === 'elv'     ? 'قطع الغيار الاساسية للأنظمة منخفضة التيار'
                     : catId === 'civil'   ? 'مواد وقطع الغيار الأساسية للأعمال المدنية'
                     : catId === 'elev'    ? 'قطع الغيار الأساسية للمصاعد والأبواب'
                     : catId === 'garden'  ? 'قطع الغيار والمواد الأساسية للحدائق والري'
                     : catId === 'parking' ? 'مواد وقطع الغيار الأساسية للمواقف والطرق'
                     : catId === 'clean'   ? 'مواد وقطع الغيار الأساسية لخدمات النظافة'
                     : catId === 'tools'   ? 'قطع الغيار والمواد الاستهلاكية للأدوات والورشة'
                     : catId === 'safety'  ? 'قطع الغيار والمواد الأساسية للسلامة المهنية'
                     : '';

    return (
      <View style={{ flex:1 }}>
        <ImageBackground source={{ uri:data.img }} style={s.detailHero}>
          <View style={s.heroOverlay} />
          <View style={s.detailContent}>
            <TouchableOpacity style={s.backBtn} onPress={onBack}>
              <Text style={s.backBtnTxt}>رجوع</Text>
            </TouchableOpacity>
            <Text style={s.detailTitle}>{data.title}</Text>
            <Text style={s.detailSub}>{data.sub}</Text>
          </View>
        </ImageBackground>

        <ScrollView style={{ flex:1, backgroundColor:'#EEF2F7' }} showsVerticalScrollIndicator={false}>

          {/* ── الكهرباء والسباكة: مربعات القوائم الفرعية مباشرة ── */}
          {!usesExternalLists && (
            <SquareGrid
              items={data.subCategories}
              onPress={(sub) => sub.items ? setSelectedSub(sub) : null}
            />
          )}

          {/* ── التكييف والحريق: مربعات + تفاصيل ── */}
          {usesExternalLists && !selectedList && (
            <SquareGrid items={externalLists} onPress={setSelectedList} />
          )}
          {usesExternalLists && selectedList && (
            <ListDetail list={selectedList} onBack={() => setSelectedList(null)} />
          )}

          {/* ── قطع الغيار ── */}
          {!selectedList && spareParts && (
            <SparePartsSection parts={spareParts} title={spareTitle} />
          )}

          <View style={{ height:20 }} />
        </ScrollView>
      </View>
    );
  }

  // ── التبويبات العادية ──
  const tabs = [
    { id:'preventive', label:'الوقائية'       },
    { id:'corrective', label:'التصحيحية'     },
    { id:'parts',      label:'قطع الغيار'    },
    { id:'kpi',        label:'مؤشرات الأداء' },
  ];
  const items = tab === 'preventive' ? data.preventive : tab === 'corrective' ? data.corrective : [];

  return (
    <View style={{ flex:1 }}>
      <ImageBackground source={{ uri:data.img }} style={s.detailHero}>
        <View style={s.heroOverlay} />
        <View style={s.detailContent}>
          <TouchableOpacity style={s.backBtn} onPress={onBack}>
            <Text style={s.backBtnTxt}>رجوع</Text>
          </TouchableOpacity>
          <Text style={s.detailTitle}>{data.title}</Text>
          <Text style={s.detailSub}>{data.sub}</Text>
        </View>
      </ImageBackground>

      <View style={{ backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#DDE4EF' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal:4 }}>
          {tabs.map(t => (
            <TouchableOpacity key={t.id} style={[s.tabItem, tab===t.id && s.tabItemOn]} onPress={() => setTab(t.id)}>
              <Text style={[s.tabTxt, tab===t.id && s.tabTxtOn]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={{ flex:1, backgroundColor:'#EEF2F7' }} showsVerticalScrollIndicator={false}>
        {(tab==='preventive' || tab==='corrective') && items.map((item, idx) => (
          <View key={idx} style={s.maintCard}>
            <View style={s.mcardTop}>
              <Image source={{ uri:item.img }} style={s.mcardThumb} />
              <View style={{ flex:1 }}>
                <Text style={s.mcardName}>{item.name}</Text>
                <Text style={s.mcardFreq}>{item.freq}</Text>
              </View>
              <Badge text={item.badge} color={item.bc} bg={item.bbg} />
            </View>
            <View style={s.partsArea}>
              <Text style={s.partsLbl}>قطع الغيار المطلوبة</Text>
              <View style={s.chipsWrap}>
                {item.parts.map((p, i) => <Chip key={i} text={p} />)}
              </View>
            </View>
          </View>
        ))}

        {tab==='parts' && (
          <View style={{ padding:8 }}>
            <SHead title="كتالوج قطع الغيار" />
            {data.parts.map((p, i) => (
              <View key={i} style={[s.maintCard, { marginHorizontal:0, marginTop:8 }]}>
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:12 }}>
                  <View>
                    <Text style={s.mcardName}>{p.name}</Text>
                    <Text style={s.mcardFreq}>{p.code}</Text>
                  </View>
                  <Badge text={p.cat} color="#0043B0" bg="#E6F0FF" />
                </View>
              </View>
            ))}
          </View>
        )}

        {tab==='kpi' && (
          <View style={{ padding:14, gap:10 }}>
            <SHead title="مؤشرات الأداء KPIs" />
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10 }}>
              {data.kpi.map((k, i) => (
                <View key={i} style={[s.kpiCard, { backgroundColor:k.bg, borderColor:k.c+'44' }]}>
                  <Text style={[s.kpiVal, { color:k.c }]}>{k.val}</Text>
                  <Text style={[s.kpiLbl, { color:k.c }]}>{k.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={{ height:20 }} />
      </ScrollView>
    </View>
  );
}
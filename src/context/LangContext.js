import React, { useState, useContext, createContext } from 'react';
import { View } from 'react-native';

const LangCtx = createContext({ lang: 'ar', dir: 'rtl', t: x => x, toggleLang: () => {} });
export function useLang() { return useContext(LangCtx); }

export const TRANSLATIONS = {
  ar: {
    appName: 'اطلبني', appSub: 'دليل الصيانة والتشغيل',
    heroTitle: 'دليل الصيانة والتشغيل', heroSub: '14 تخصص +600 قطعة غيار - برامج متكاملة',
    searchPlaceholder: 'ابحث عن تخصص أو قطعة غيار...',
    allCategories: 'جميع التخصصات الـ 14',
    all: 'الكل', elec: 'كهرباء', plumb: 'سباكة', hvac: 'تكييف', fire: 'حريق', civil: 'مدني', safety: 'سلامة',
    home: 'الرئيسية', programs: 'البرامج', store: 'المتجر', profile: 'حسابي',
    back: 'رجوع', viewDetails: 'عرض التفاصيل', comingSoon: 'قريباً', viewContent: 'عرض المحتوى',
    preventive: 'الوقائية', corrective: 'التصحيحية', parts: 'قطع الغيار', kpi: 'مؤشرات الأداء',
    partsRequired: 'قطع الغيار المطلوبة', partsCatalog: 'كتالوج قطع الغيار', kpiTitle: 'مؤشرات الأداء KPIs',
    storeTitle: 'متجر قطع الغيار', storeSub: '+600 قطعة - توصيل سريع - ضمان الجودة',
    addToCart: '+ أضف للسلة', cartTitle: 'سلة التسوق', cartEmpty: 'السلة فارغة',
    total: 'الإجمالي', confirmOrder: 'تأكيد الطلب',
    programsTitle: 'برامج الصيانة', programsSub: 'اختر التخصص أو البرنامج',
    specialties: 'التخصصات', generalPrograms: 'البرامج العامة',
    ordersTitle: 'الطلبات', noOrders: 'لا توجد طلبات - اضغط + لإنشاء طلب',
    newOrder: '+ إنشاء طلب جديد', orderTitle: 'عنوان الطلب', orderDesc: 'الوصف',
    specialty: 'التخصص', priority: 'الأولوية', assignee: 'المسؤول عن التنفيذ', submit: 'إرسال الطلب',
    profileTitle: 'أحمد المهندس', profileRole: 'مهندس صيانة - مستخدم مميز',
    lang: 'EN', langFull: 'English',
  },
  en: {
    appName: 'atlobni', appSub: 'Maintenance & Operations Guide',
    heroTitle: 'Maintenance & Operations Guide', heroSub: '14 Specialties | +600 Spare Parts | Integrated Programs',
    searchPlaceholder: 'Search for specialty or spare part...',
    allCategories: 'All 14 Specialties',
    all: 'All', elec: 'Electrical', plumb: 'Plumbing', hvac: 'HVAC', fire: 'Fire', civil: 'Civil', safety: 'Safety',
    home: 'Home', programs: 'Programs', store: 'Store', profile: 'Account',
    back: 'Back', viewDetails: 'View Details', comingSoon: 'Coming Soon', viewContent: 'View Content',
    preventive: 'Preventive', corrective: 'Corrective', parts: 'Spare Parts', kpi: 'KPIs',
    partsRequired: 'Required Parts', partsCatalog: 'Parts Catalog', kpiTitle: 'KPI Dashboard',
    storeTitle: 'Spare Parts Store', storeSub: '+600 Parts | Fast Delivery | Quality Guarantee',
    addToCart: '+ Add to Cart', cartTitle: 'Shopping Cart', cartEmpty: 'Cart is empty',
    total: 'Total', confirmOrder: 'Confirm Order',
    programsTitle: 'Maintenance Programs', programsSub: 'Select specialty or program',
    specialties: 'Specialties', generalPrograms: 'General Programs',
    ordersTitle: 'Work Orders', noOrders: 'No orders yet - Press + to create one',
    newOrder: '+ Create New Order', orderTitle: 'Order Title', orderDesc: 'Description',
    specialty: 'Specialty', priority: 'Priority', assignee: 'Assigned To', submit: 'Submit Order',
    profileTitle: 'Ahmed Engineer', profileRole: 'Maintenance Engineer | Premium User',
    lang: 'عربي', langFull: 'Arabic',
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState('ar');
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const t = key => TRANSLATIONS[lang][key] || key;
  function toggleLang() { setLang(l => l === 'ar' ? 'en' : 'ar'); }
  return (
    <LangCtx.Provider value={{ lang, dir, t, toggleLang }}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </LangCtx.Provider>
  );
}

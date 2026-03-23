// ─── بيانات الكوبونات ─────────────────────────────────────────
// type: 'percent' | 'fixed'
// minOrder: الحد الأدنى للطلب
// maxUses: عدد مرات الاستخدام الأقصى (null = غير محدود)
// expiresAt: تاريخ انتهاء الصلاحية (null = لا ينتهي)

export const COUPONS = [
  {
    code:      'WELCOME20',
    label:     'خصم الترحيب',
    desc:      'خصم 20% على أول طلب',
    type:      'percent',
    value:     20,
    minOrder:  0,
    maxUses:   null,
    expiresAt: null,
    icon:      '🎁',
    color:     '#0A7A3C',
    bg:        '#E6F7EE',
  },
  {
    code:      'SAVE50',
    label:     'خصم 50 ريال',
    desc:      'خصم ثابت 50 ريال عند الطلب فوق 200 ريال',
    type:      'fixed',
    value:     50,
    minOrder:  200,
    maxUses:   null,
    expiresAt: null,
    icon:      '💰',
    color:     '#0043B0',
    bg:        '#E6F0FF',
  },
  {
    code:      'MAINT15',
    label:     'خصم الصيانة',
    desc:      'خصم 15% على جميع منتجات الصيانة',
    type:      'percent',
    value:     15,
    minOrder:  100,
    maxUses:   null,
    expiresAt: null,
    icon:      '🔧',
    color:     '#B05200',
    bg:        '#FFF0E0',
  },
  {
    code:      'VIP30',
    label:     'خصم VIP',
    desc:      'خصم حصري 30% للعملاء المميزين',
    type:      'percent',
    value:     30,
    minOrder:  300,
    maxUses:   null,
    expiresAt: null,
    icon:      '👑',
    color:     '#7B1FA2',
    bg:        '#F3E5F5',
  },
  {
    code:      'STORE100',
    label:     'خصم 100 ريال',
    desc:      'خصم 100 ريال على الطلبات فوق 500 ريال',
    type:      'fixed',
    value:     100,
    minOrder:  500,
    maxUses:   null,
    expiresAt: null,
    icon:      '🏷️',
    color:     '#D32F2F',
    bg:        '#FFEBEE',
  },
];

export function findCoupon(code) {
  return COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase().trim()) || null;
}

export function calcDiscount(coupon, total) {
  if (!coupon) return 0;
  if (total < coupon.minOrder) return 0;
  if (coupon.type === 'percent') return Math.round((total * coupon.value) / 100);
  if (coupon.type === 'fixed')   return Math.min(coupon.value, total);
  return 0;
}
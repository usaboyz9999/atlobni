import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function TermsScreen({ onBack }) {
  const sections = [
    {
      title: '1. قبول الشروط',
      body: 'باستخدامك لتطبيق اطلبني، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يرجى التوقف عن استخدام التطبيق فوراً.',
    },
    {
      title: '2. وصف الخدمة',
      body: 'اطلبني هي منصة متخصصة في إدارة التشغيل والصيانة توفر: إنشاء وتتبع طلبات الصيانة، عرض برامج الصيانة الوقائية والتصحيحية، متجر إلكتروني لقطع الغيار والمستلزمات المنزلية.',
    },
    {
      title: '3. التسجيل والحسابات',
      body: 'يلتزم المستخدم بتقديم معلومات دقيقة وكاملة عند التسجيل. المستخدم مسؤول بالكامل عن سرية كلمة المرور وأي نشاط يتم تحت حسابه. يحق للمنصة إيقاف أي حساب يخالف هذه الشروط.',
    },
    {
      title: '4. استخدام المنصة',
      body: 'يُحظر استخدام المنصة لأي أغراض غير مشروعة أو تضر بالغير. يُمنع نشر أي محتوى مسيء أو مضلل. الاستخدام مقصور على الأغراض التجارية والمنزلية المشروعة فقط.',
    },
    {
      title: '5. الخصوصية وحماية البيانات',
      body: 'نلتزم بحماية بيانات المستخدمين وفق أعلى معايير الأمان. لا يتم مشاركة البيانات الشخصية مع أطراف ثالثة إلا بموافقة صريحة من المستخدم أو بموجب القانون. يحق لكل مستخدم طلب حذف بياناته في أي وقت.',
    },
    {
      title: '6. الملكية الفكرية',
      body: 'جميع محتويات المنصة من تصاميم وبيانات وبرمجيات هي ملكية حصرية لاطلبني. لا يجوز نسخ أو توزيع أي محتوى دون إذن مسبق وخطي من الإدارة.',
    },
    {
      title: '7. المتجر الإلكتروني',
      body: 'الأسعار المعروضة خاضعة للتغيير دون إشعار مسبق. يتم معالجة الطلبات خلال 24-48 ساعة عمل. سياسة الإرجاع تتيح للمستخدم إعادة المنتج خلال 7 أيام من الاستلام في حال عيب المصنع.',
    },
    {
      title: '8. طلبات الصيانة',
      body: 'المنصة وسيط بين المستخدم ومزودي خدمة الصيانة. لا تتحمل المنصة مسؤولية أي أضرار ناتجة عن سوء التنفيذ من قِبل الفنيين. يحق للمستخدم تقييم الخدمة المقدمة.',
    },
    {
      title: '9. تحديد المسؤولية',
      body: 'لا تتجاوز مسؤولية المنصة في أي حال من الأحوال قيمة المبلغ المدفوع من قِبل المستخدم مقابل الخدمة. المنصة غير مسؤولة عن أي أضرار غير مباشرة أو تبعية.',
    },
    {
      title: '10. تعديل الشروط',
      body: 'تحتفظ المنصة بحق تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو الإشعارات داخل التطبيق. الاستمرار في استخدام المنصة بعد التعديل يُعد قبولاً ضمنياً.',
    },
    {
      title: '11. القانون الواجب التطبيق',
      body: 'تخضع هذه الشروط للأنظمة والقوانين المعمول بها في المملكة العربية السعودية. تختص المحاكم السعودية بالفصل في أي نزاع ينشأ عن هذه الاتفاقية.',
    },
    {
      title: '12. التواصل',
      body: 'لأي استفسارات أو شكاوى، يرجى التواصل عبر:\nالبريد: support@atlobni.com\nالهاتف: 920-XXX-XXX\nساعات العمل: الأحد - الخميس، 9 صباحاً - 6 مساءً',
    },
  ];

  return (
    <View style={{ flex:1, backgroundColor:'#EEF2F7' }}>
      {/* رأس */}
      <View style={{ backgroundColor:'#0A2463', padding:18 }}>
        <View style={{ flexDirection:'row', alignItems:'center', gap:12, marginBottom:8 }}>
          <TouchableOpacity onPress={onBack} style={{
            backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10,
            paddingHorizontal:12, paddingVertical:6,
          }}>
            <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
          </TouchableOpacity>
          <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>
            الشروط والأحكام
          </Text>
        </View>
        <Text style={{ color:'rgba(255,255,255,0.6)', fontSize:10, textAlign:'right' }}>
          آخر تحديث: محرم 1446هـ
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* مقدمة */}
        <View style={{
          margin:14, backgroundColor:'#E6F0FF', borderRadius:14,
          padding:14, borderWidth:1, borderColor:'#0043B055',
        }}>
          <Text style={{ fontSize:13, fontWeight:'800', color:'#0043B0', textAlign:'right', marginBottom:6 }}>
            مرحباً بك في اطلبني 👋
          </Text>
          <Text style={{ fontSize:11, color:'#0A2463', textAlign:'right', lineHeight:19 }}>
            يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام المنصة. استخدامك للتطبيق يُعدّ موافقة صريحة على جميع البنود الواردة أدناه.
          </Text>
        </View>

        <View style={{ paddingHorizontal:14 }}>
          {sections.map((sec, i) => (
            <View key={i} style={{
              backgroundColor:'#fff', borderRadius:14, padding:14,
              marginBottom:10, borderWidth:1, borderColor:'#DDE4EF',
            }}>
              <Text style={{
                fontSize:13, fontWeight:'800', color:'#0A2463',
                textAlign:'right', marginBottom:8,
                borderBottomWidth:1, borderBottomColor:'#EEF2F7', paddingBottom:8,
              }}>
                {sec.title}
              </Text>
              <Text style={{ fontSize:11, color:'#444', textAlign:'right', lineHeight:20 }}>
                {sec.body}
              </Text>
            </View>
          ))}
        </View>

        {/* ختام */}
        <View style={{ margin:14, backgroundColor:'#0A2463', borderRadius:14, padding:14 }}>
          <Text style={{ color:'#fff', fontSize:11, textAlign:'center', lineHeight:18 }}>
            © 2025 اطلبني — جميع الحقوق محفوظة{'\n'}
            المملكة العربية السعودية
          </Text>
        </View>
        <View style={{ height:90 }} />
      </ScrollView>
    </View>
  );
}
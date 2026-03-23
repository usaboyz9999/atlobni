export const mkPrev = (items) => items;
export const mkCorr = (items) => items;
export const mk = (title, sub, img, prev, corr, parts, kpi) => ({
  title, sub, img, preventive: prev, corrective: corr, parts, kpi,
});

export const DETAIL_DATA = {
  elec: {
    title: 'الكهرباء والانظمة الكهربائية', sub: '4 انظمة رئيسية - 135 قطعة غيار',
    img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=700&q=80',
    isSubCat: true,
    subCategories: [
      {
        id:'dist', label:'شبكات التوزيع', desc:'لوحات التوزيع والكابلات والقواطع',
        color:'#0043B0', bg:'#E6F0FF', img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80',
        items:[
          { icon:'A', title:'لوحات التوزيع الرئيسية والفرعية',  desc:'Main DB / Sub DB - لوحات معدنية وبلاستيكية',             img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon:'B', title:'القواطع الكهربائية ومنظمات التسرب', desc:'MCB - MCCB - ACB - ELCB / RCD',                          img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon:'C', title:'الكابلات والاسلاك ومساراتها',       desc:'Power / Control / Lighting - Cable Trays - Conduits',    img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon:'D', title:'انظمة التأريض',                     desc:'Earthing / Grounding - قياس مقاومة الارضي',             img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon:'E', title:'اجهزة قياس الطاقة',                 desc:'عدادات كهربائية - محولات قياس CT/PT',                   img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
        ],
      },
      {
        id:'light', label:'انظمة الاضاءة', desc:'اضاءة داخلية وخارجية وطارئة',
        color:'#B07800', bg:'#FFF8E0', img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
        items:[
          { icon:'A', title:'وحدات الاضاءة الداخلية والخارجية', desc:'LED - Fluorescent - HID',                                img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
          { icon:'B', title:'انظمة التحكم بالاضاءة',             desc:'Timers - Motion Sensors - Dimmers - BMS',                img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon:'C', title:'اضاءة الطوارئ والمخارج',            desc:'Emergency Lighting - Exit Signs - بطاريات داخلية',      img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
      {
        id:'backup', label:'انظمة الطاقة الاحتياطية', desc:'مولدات ديزل وبطاريات UPS',
        color:'#0A7A3C', bg:'#E6F7EE', img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
        items:[
          { icon:'A', title:'المولدات الكهربائية مع لوحات التحويل', desc:'Diesel Generators - ATS Panels',                     img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon:'B', title:'انظمة UPS للحمولات الحرجة',            desc:'UPS للخوادم وانظمة الامن - Online / Offline',         img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon:'C', title:'بنوك البطاريات وشواحنها',               desc:'Battery Banks - VRLA - Li-Ion - شواحن ذكية',         img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
        ],
      },
      {
        id:'control', label:'انظمة التحكم والحماية', desc:'حماية الدوائر والتحكم الآلي',
        color:'#B05200', bg:'#FFF0E0', img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
        items:[
          { icon:'A', title:'لوحات التحكم بالمضخات والمعدات', desc:'Motor Control Centers MCC - Soft Starters - VFD',         img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon:'B', title:'منظمات الجهد ومرشحات التوافقيات', desc:'Voltage Stabilizers - Harmonic Filters',                 img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon:'C', title:'انظمة الحماية من الصواعق',        desc:'Lightning Protection - Surge Arresters - SPD',          img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  plumb: {
    title: 'السباكة والصرف الصحي', sub: '3 انظمة رئيسية - 59 قطعة غيار',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
    isSubCat: true,
    subCategories: [
      {
        id:'water', label:'شبكات المياه', desc:'توزيع المياه الباردة والساخنة',
        color:'#0043B0', bg:'#E6F0FF', img:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
        items:[
          { icon:'A', title:'خزانات المياه العلوية والارضية', desc:'خزانات، تعويمات، منسوب مياه',         img:'https://images.unsplash.com/photo-1565190939947-76b1bbe8cb8e?w=400&q=80' },
          { icon:'B', title:'مضخات المياه',                   desc:'طرد، تعزيز، غاطسة مع لوحات التحكم', img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon:'C', title:'انابيب التوزيع',                 desc:'PVC, PPR, Copper, HDPE ووصلاتها',   img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
          { icon:'D', title:'محابس التحكم والعزل',            desc:'كرات، بوابات، فراشة، تحقق',         img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon:'E', title:'نقاط الاستهلاك',                 desc:'حنفيات، دش، سيفون، مراحيض، احواض', img:'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80' },
          { icon:'F', title:'سخانات المياه',                  desc:'كهربائية، غاز، شمسية وملاحقها',     img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80' },
          { icon:'G', title:'عدادات المياه',                  desc:'اجهزة قياس التدفق والاستهلاك',      img:'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80' },
          { icon:'H', title:'فلاتر التنقية ومعالجات المياه',  desc:'Filters, Softeners, RO Systems',    img:'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&q=80' },
        ],
      },
      {
        id:'drain', label:'شبكات الصرف', desc:'شبكات الصرف الصحي والتهوية',
        color:'#0A7A3C', bg:'#E6F7EE', img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        items:[
          { icon:'A', title:'مواسير الصرف والتهوية',        desc:'Soil & Waste Pipes وملحقاتها',           img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
          { icon:'B', title:'مصافط الارضية ومصائد الدهون', desc:'Floor Drains & Grease Traps',             img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon:'C', title:'غرف التفتيش والصرف الخارجي',  desc:'Manholes وخطوط الصرف الخارجية',         img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon:'D', title:'مضخات الصرف الصحي',           desc:'Sewage Pumps وانظمة الرفع',              img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon:'E', title:'محطات المعالجة الاولية',       desc:'معالجة مياه الصرف قبل التصريف',         img:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
        ],
      },
      {
        id:'rain', label:'انظمة مياه الامطار', desc:'تصريف وتجميع مياه الامطار',
        color:'#5B2D8E', bg:'#F0EAFF', img:'https://images.unsplash.com/photo-1527766833261-b09c3163a791?w=600&q=80',
        items:[
          { icon:'A', title:'مزاريب الاسطح ومواسير التصريف', desc:'Gutters & Downpipes وملحقاتها',            img:'https://images.unsplash.com/photo-1527766833261-b09c3163a791?w=400&q=80' },
          { icon:'B', title:'احواض التجميع ومضخات التفريغ',  desc:'احواض تجميع مياه الامطار ومضخات التفريغ', img:'https://images.unsplash.com/photo-1565190939947-76b1bbe8cb8e?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  hvac: {
    title: 'التكييف والتهوية HVAC', sub: '4 انظمة رئيسية - 98 قطعة غيار',
    img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700&q=80',
    isSubCat: true,
    subCategories: [
      {
        id:'central', label:'انظمة التكييف المركزي', desc:'Chillers & AHUs & Cooling Towers',
        color:'#0043B0', bg:'#E6F0FF', img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
        items:[
          { icon:'A', title:'وحدات المعالجة الهوائية AHUs',  desc:'مراوح، فلاتر، ملفات تبريد وتسخين',            img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80' },
          { icon:'B', title:'وحدات التكثيف Chillers',         desc:'Chillers هوائية ومائية',                       img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon:'C', title:'ابراج التبريد Cooling Towers',   desc:'ابراج تبريد مفتوحة ومغلقة',                   img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon:'D', title:'انظمة توزيع الهواء',             desc:'Ducts - مخارج - مشعبات - Dampers',            img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon:'E', title:'انظمة التحكم',                   desc:'Thermostats - BMS - VFDs',                     img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
        ],
      },
      {
        id:'split', label:'انظمة التكييف المنفصلة', desc:'Split & VRF & Window Units',
        color:'#0A7A3C', bg:'#E6F7EE', img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
        items:[
          { icon:'A', title:'مكيفات الشباك Window Units',     desc:'وحدات نافذة - تبريد وتدفئة',                  img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80' },
          { icon:'B', title:'مكيفات السبليت والمولتي سبليت',  desc:'Split & Multi-Split - Cassette - Duct',        img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon:'C', title:'انظمة VRF/VRV المتقدمة',         desc:'Variable Refrigerant Flow',                    img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
        ],
      },
      {
        id:'ventilation', label:'انظمة التهوية', desc:'Exhaust & Supply & Heat Recovery',
        color:'#B05200', bg:'#FFF0E0', img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80',
        items:[
          { icon:'A', title:'مراوح الشفط والتغذية',           desc:'Exhaust & Supply Fans',                        img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon:'B', title:'انظمة استرداد الحرارة',           desc:'Heat Recovery Units HRV/ERV',                  img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80' },
          { icon:'C', title:'مراوح الحمامات والمطابخ',         desc:'مع مصائد الدهون Grease Traps',                 img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon:'D', title:'انظمة ضغط السلالم',               desc:'Staircase Pressurization',                     img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
      {
        id:'control_rh', label:'انظمة التحكم والرطوبة', desc:'BMS & Sensors & Air Quality',
        color:'#5B2D8E', bg:'#F0EAFF', img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
        items:[
          { icon:'A', title:'اجهزة استشعار الحرارة والرطوبة', desc:'Temperature & Humidity Sensors - CO2',          img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon:'B', title:'منظمات الرطوبة',                  desc:'Humidifiers & Dehumidifiers',                  img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80' },
          { icon:'C', title:'انظمة تنقية الهواء',              desc:'HEPA Filters H13/H14 - UV Sterilizers',        img:'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  fire: {
    title: 'الحماية من الحريق', sub: '3 انظمة رئيسية - 35 قطعة غيار',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80',
    isSubCat: true,
    subCategories: [
      {
        id:'alarm', label:'انظمة الانذار', desc:'Fire Alarm Control Panel & Detectors',
        color:'#B83200', bg:'#FFF0F0', img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        items:[
          { icon:'A', title:'لوحة التحكم الرئيسية FACP',          desc:'Fire Alarm Control Panel - مراقبة وتحكم كامل بالنظام',              img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon:'B', title:'كواشف الدخان والحرارة',               desc:'Smoke & Heat Detectors - بصري وأيوني وحرارة ثابتة وتفاضلية',       img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon:'C', title:'أزرار الانذار اليدوية',               desc:'Manual Call Points - نقاط تشغيل يدوية في الممرات والمخارج',         img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon:'D', title:'اجهزة الانذار السمعية والبصرية',      desc:'Sounders & Strobes - صفارات وأضواء تحذيرية متزامنة',              img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon:'E', title:'انظمة ربط مع انظمة المبنى',           desc:'اغلاق مصاعد، فتح أبواب طوارئ، تشغيل شفط الدخان',                  img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
        ],
      },
      {
        id:'suppression', label:'انظمة الاطفاء', desc:'Sprinklers & Fire Pumps & Extinguishers',
        color:'#0043B0', bg:'#E6F0FF', img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
        items:[
          { icon:'A', title:'شبكة صناديق الحريق',                  desc:'Fire Hose Cabinets مع خراطيم وفوهات وخزانات مياه',               img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon:'B', title:'طفايات الحريق المحمولة',               desc:'ماء - رغوة - CO2 - Powder بأحجام مختلفة',                       img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon:'C', title:'انظمة الرش الآلي Sprinklers',          desc:'Sprinkler Systems مع مضخات وخزانات وصمامات تحكم',               img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon:'D', title:'انظمة الغاز للغرف الحساسة',            desc:'FM200 - CO2 - Inergen للغرف الكهربائية والسيرفر',               img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon:'E', title:'مضخات الحريق',                         desc:'Electric & Diesel Fire Pumps مع Jockey Pump',                  img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
        ],
      },
      {
        id:'smoke', label:'انظمة ادارة الدخان والطوارئ', desc:'Smoke Control & Emergency Systems',
        color:'#5B2D8E', bg:'#F0EAFF', img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
        items:[
          { icon:'A', title:'مراوح طرد الدخان',                     desc:'Smoke Extract Fans - مراوح شفط دخان في السلالم والممرات',         img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon:'B', title:'ابواب مقاومة للحريق',                  desc:'Fire Doors مع اجهزة اغلاق ذاتي ومانع تسرب الدخان',             img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon:'C', title:'اضاءة وعلامات مخارج الطوارئ',          desc:'Emergency Exit Signs & Lighting - بطاريات داخلية مستقلة',      img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  civil: {
    title: 'الأعمال المدنية والمباني', sub: '4 أقسام رئيسية - 38 مادة',
    img: 'https://cdn.arabsstock.com/uploads/images/242046/construction-of-buildings-and-mega-thumbnail-242046.webp',
    isSubCat: true,
    subCategories: [
      {
        id: 'structure', label: 'الهيكل والمباني', desc: 'خرسانة، جدران، أسقف هيكلية',
        color: '#0043B0', bg: '#E6F0FF',
        img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        items: [
          { icon: 'A', title: 'الأساسات والأعمدة والجسور',          desc: 'فحص وصيانة الأساسات، الأعمدة، الجسور والأسقف الخرسانية',       img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon: 'B', title: 'الجدران الداخلية والخارجية',          desc: 'جدران طوب، جبس بورد، ستايرين - فحص التشققات والرطوبة',         img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon: 'C', title: 'الأسقف المعلقة والعوازل',             desc: 'False Ceilings: جبس، معدني، PVC - عوازل حرارية وصوتية',        img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
        ],
      },
      {
        id: 'finishes', label: 'التشطيبات', desc: 'أرضيات، دهانات، نوافذ وأبواب',
        color: '#0A7A3C', bg: '#E6F7EE',
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
        items: [
          { icon: 'A', title: 'الأرضيات بأنواعها',                   desc: 'سيراميك، رخام، باركيه، إبوكسي - تنظيف وجلي وإصلاح الكسور',     img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
          { icon: 'B', title: 'الدهانات الداخلية والخارجية',          desc: 'دهانات بلاستيك وزيتية، ورق جدران، تجديد الواجهات',              img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
          { icon: 'C', title: 'النوافذ والأبواب وملحقاتها',           desc: 'ألمنيوم، خشب، UPVC - زجاج، أختام مطاطية، إكسسوارات وأقفال',   img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
        ],
      },
      {
        id: 'external', label: 'العناصر الخارجية', desc: 'واجهات، مظلات، أرصفة',
        color: '#5B2D8E', bg: '#F0EAFF',
        img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
        items: [
          { icon: 'A', title: 'الواجهات الخارجية',                    desc: 'Cladding وCurtain Walls - فحص التثبيت والأختام والتنظيف',      img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon: 'B', title: 'المظلات والممرات الخارجية',             desc: 'مظلات معدنية وقماشية، ممرات مسقوفة - فحص وصيانة دورية',        img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon: 'C', title: 'الأرصفة والممرات وسلالم الطوارئ',      desc: 'رصف خارجي، ممرات المشاة، سلالم الطوارئ والدرابزين',             img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
        ],
      },
      {
        id: 'insulation', label: 'العوازل والعناصر الخاصة', desc: 'عزل مائي وحراري وصوتي',
        color: '#B05200', bg: '#FFF0E0',
        img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80',
        items: [
          { icon: 'A', title: 'عوازل الأسطح والحمامات',               desc: 'عزل مائي وحراري: أسمنت عازل، بيتومين، أغشية مقاومة للماء',    img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&q=80' },
          { icon: 'B', title: 'فواصل التمدد وأنظمة العزل الصوتي',     desc: 'Expansion Joints: Silicone, PU Sealants - ألواح عزل صوتي',    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  elv: {
    title: 'الأنظمة منخفضة التيار', sub: '4 أنظمة رئيسية - 42 قطعة تقنية',
    img: 'https://glc-ksa.com/wp-content/uploads/2023/09/low-current-systems.jpeg',
    isSubCat: true,
    subCategories: [
      {
        id: 'security', label: 'أنظمة الأمن والمراقبة', desc: 'CCTV & Access Control & Intrusion',
        color: '#0043B0', bg: '#E6F0FF',
        img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80',
        items: [
          { icon: 'A', title: 'كاميرات المراقبة CCTV',            desc: 'Analog/IP Cameras مع مسجلات NVR/DVR وتخزين HDD',           img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80' },
          { icon: 'B', title: 'أنظمة التحكم في الدخول',           desc: 'Access Control: بطاقات، بصمة إصبع، التعرف على الوجه',       img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'أنظمة الإنذار من التسلل',          desc: 'Intrusion Detection: PIR، Door Contacts، صفارات إنذار',     img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon: 'D', title: 'أنظمة إدارة المواقف',              desc: 'Parking Management: بوابات آلية، أرقام لوحات، أجهزة دفع',   img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80' },
        ],
      },
      {
        id: 'comms', label: 'أنظمة الاتصالات', desc: 'Intercom & PA & Data Network',
        color: '#0A7A3C', bg: '#E6F7EE',
        img: 'https://images.unsplash.com/photo-1523475496153-3c6e8ce9db35?w=600&q=80',
        items: [
          { icon: 'A', title: 'نظام الهاتف الداخلي',              desc: 'Intercom/EPABX: مقسم هاتفي، نقاط اتصال داخلية وخارجية',    img: 'https://images.unsplash.com/photo-1523475496153-3c6e8ce9db35?w=400&q=80' },
          { icon: 'B', title: 'نظام الصوتيات والإذاعة الداخلية',  desc: 'Public Address PA: مكبرات صوت، مضخمات، أنظمة توجيه الصوت',  img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80' },
          { icon: 'C', title: 'شبكة البيانات',                    desc: 'نقاط شبكة، سويتشات مُدارة، كابلات UTP CAT6/6A وألياف ضوئية', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
        ],
      },
      {
        id: 'automation', label: 'أنظمة التحكم الآلي', desc: 'BMS & Lighting Control & Energy',
        color: '#5B2D8E', bg: '#F0EAFF',
        img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
        items: [
          { icon: 'A', title: 'نظام إدارة المباني BMS/BAS',        desc: 'Building Management System: مراقبة وتحكم مركزي بكل الأنظمة', img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'B', title: 'أنظمة التحكم بالإضاءة والستائر',   desc: 'Lighting Control: جدولة، حساسات حركة، ستائر كهربائية آلية',  img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
          { icon: 'C', title: 'أنظمة قياس الطاقة Energy Monitoring', desc: 'عدادات ذكية، لوحات قياس، تحليل استهلاك وتقارير الطاقة',  img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
        ],
      },
      {
        id: 'others', label: 'أنظمة أخرى', desc: 'Nurse Call & Signage & AV',
        color: '#B05200', bg: '#FFF0E0',
        img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        items: [
          { icon: 'A', title: 'نظام الاستدعاء Nurse Call',         desc: 'نظام استدعاء التمريض للمرافق الصحية والمستشفيات',           img: 'https://images.unsplash.com/photo-1584982751601-97ddc0501b0e?w=400&q=80' },
          { icon: 'B', title: 'أنظمة العرض الرقمي Digital Signage', desc: 'شاشات إعلانية وإرشادية، محتوى ديناميكي، إدارة مركزية',    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'أنظمة الصوت والفيديو للمؤتمرات',    desc: 'AV Conference: شاشات تفاعلية، كاميرات اجتماعات، مكبرات',   img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  elev: {
    title: 'المصاعد والأبواب الأوتوماتيكية', sub: '4 أقسام رئيسية - 36 قطعة',
    img: 'https://goldenemaar.sa/wp-content/uploads/2023/02/%D9%85%D9%87%D9%86%D8%AF%D8%B3-%D8%B5%D9%8A%D8%A7%D9%86%D8%A9-%D9%85%D8%B5%D8%A7%D8%B9%D8%AF.jpg',
    isSubCat: true,
    subCategories: [
      {
        id: 'doors', label: 'الأبواب والنوافذ الميكانيكية', desc: 'أبواب أوتوماتيكية، طوارئ، نوافذ آلية',
        color: '#0043B0', bg: '#E6F0FF',
        img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
        items: [
          { icon: 'A', title: 'الأبواب الأوتوماتيكية',              desc: 'انزلاق، دوار، مفصلي - محركات، أجهزة استشعار، ريلات توجيه',     img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'B', title: 'أبواب الطوارئ والمخارج',              desc: 'Push Bars, Panic Hardware - أبواب مقاومة للحريق مع إغلاق ذاتي', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon: 'C', title: 'النوافذ الآلية والفتحات العلوية',     desc: 'Sky Lights، نوافذ فتح كهربائي، محركات وأجهزة تحكم',             img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon: 'D', title: 'أنظمة التحكم في الدخول',              desc: 'Keypads, RFID, Biometric - تكامل مع أنظمة الأمن',               img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80' },
        ],
      },
      {
        id: 'elevators', label: 'المصاعد والسلالم المتحركة', desc: 'مصاعد ركاب وبضائع وسلالم',
        color: '#0A7A3C', bg: '#E6F7EE',
        img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80',
        items: [
          { icon: 'A', title: 'كابينة المصعد وأبوابه',               desc: 'كابينة، أدلة، أبواب أوتوماتيكية، أزرار تحكم داخلية',           img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80' },
          { icon: 'B', title: 'نظام الجر أو الهيدروليك',              desc: 'Traction Machine، موتور، علبة تروس - أو وحدة هيدروليكية',      img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon: 'C', title: 'كابلات الفولاذ وأوزان الموازنة',       desc: 'Steel Ropes بأقطار قياسية، Counterweights، بكرات توجيه',       img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'D', title: 'لوحات التحكم وأنظمة السلامة',          desc: 'Overspeed Governor, Safety Gear, Buffers, Limit Switches',      img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon: 'E', title: 'السلالم المتحركة Escalators',          desc: 'درجات ألمنيوم، سلاسل، محركات، درابزين متحرك، نظام أمان',      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
      {
        id: 'gates', label: 'البوابات والحواجز', desc: 'مواقف، مستودعات، تحكم عن بعد',
        color: '#5B2D8E', bg: '#F0EAFF',
        img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80',
        items: [
          { icon: 'A', title: 'بوابات المواقف الآلية',                desc: 'Barrier Gates: أذرع، محركات، أجهزة قراءة بطاقات/لوحات',        img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80' },
          { icon: 'B', title: 'بوابات المصانع والمستودعات',            desc: 'Rolling Shutters، Sectional Doors - محركات وأنظمة تحكم',       img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'أنظمة التحكم عن بعد والتكامل',         desc: 'Remote Controls، تكامل مع BMS وأنظمة الأمن والمراقبة',         img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80' },
        ],
      },
      {
        id: 'mechanical', label: 'المعدات الميكانيكية العامة', desc: 'روافع، ضواغط، ناقلات',
        color: '#B05200', bg: '#FFF0E0',
        img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
        items: [
          { icon: 'A', title: 'روافع يدوية وكهربائية',                desc: 'Hoists & Winches: رافعة عارضة، Chain Hoist، Wire Rope Hoist',   img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon: 'B', title: 'ضواغط هواء الورشة',                   desc: 'Workshop Air Compressors: مكبسية وترددية، خزانات هواء',         img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'أنظمة نقل المواد Conveyors',           desc: 'أحزمة ناقلة، بكرات، محركات - للمستودعات ومرافق التوزيع',       img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  garden: {
    title: 'الحدائق والري الخارجي', sub: '3 أقسام رئيسية - 48 مادة',
    img: 'https://algedra.com.tr/assets/imgs/upload2/garden%20design%20blog/16_65e72cddc3a01.jpg',
    isSubCat: true,
    subCategories: [
      {
        id: 'irrigation', label: 'شبكة الري', desc: 'مضخات، أنابيب، رشاشات، تحكم آلي',
        color: '#0043B0', bg: '#E6F0FF',
        img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
        items: [
          { icon: 'A', title: 'مضخات الري ولوحات التحكم',          desc: 'مضخات طرد وغاطسة، لوحات تحكم وتوقيت، محولات جهد',            img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon: 'B', title: 'الأنابيب الرئيسية والفرعية',         desc: 'PVC, HDPE, PE بأقطار 20mm-110mm ووصلات وقطع التركيب',        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
          { icon: 'C', title: 'الرشاشات بأنواعها',                  desc: 'Pop-up Sprinklers، Rotor، Drip Emitters، رشاشات دوارة',       img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
          { icon: 'D', title: 'الصمامات الكهربائية واليدوية',        desc: '24V Solenoid Valves، صمامات يدوية، صمامات تنظيم الضغط',      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon: 'E', title: 'وحدات التحكم الآلي',                  desc: 'Timers، Smart Controllers، IoT Sensors رطوبة وأمطار',        img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon: 'F', title: 'الفلاتر وأجهزة حقن الأسمدة',         desc: 'Disc/Screen Filters، Fertigation Units، حقن كيميائي',        img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&q=80' },
        ],
      },
      {
        id: 'landscape', label: 'العناصر النباتية والصلبة', desc: 'نباتات، تربة، ممرات، صرف',
        color: '#0A7A3C', bg: '#E6F7EE',
        img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
        items: [
          { icon: 'A', title: 'الأشجار والشجيرات والمسطحات',        desc: 'أشجار ظل وزينة، شجيرات تشكيل، عشب طبيعي وصناعي، زهور موسمية', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80' },
          { icon: 'B', title: 'التربة والأسمدة والمبيدات',           desc: 'تربة زراعية، سماد NPK، مبيدات حشرية وفطرية مرخصة، بيتموس',    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
          { icon: 'C', title: 'الممرات والجلسات والمظلات',           desc: 'بلاط خارجي، عرائش خشبية، مظلات قماشية وبوليكربونات',          img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80' },
          { icon: 'D', title: 'أنظمة الصرف السطحي',                  desc: 'مصافط سطحية، أحواض تجميع أمطار، مواسير صرف مياه الأمطار',     img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
      {
        id: 'support', label: 'أنظمة الدعم', desc: 'خزانات، إضاءة، صوتيات',
        color: '#5B2D8E', bg: '#F0EAFF',
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
        items: [
          { icon: 'A', title: 'خزانات المياه الخارجية',               desc: 'خزانات فوق الأرض وتحتها، مضخات تعزيز الضغط للري',             img: 'https://images.unsplash.com/photo-1565190939947-76b1bbe8cb8e?w=400&q=80' },
          { icon: 'B', title: 'أنظمة إضاءة الحدائق',                  desc: 'Landscape Lighting: LED مقاومة للماء، بواري، كاشفات، تحكم',   img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
          { icon: 'C', title: 'أنظمة الصوت الخارجي',                   desc: 'مكبرات صوت خارجية مقاومة للطقس للحدائق والمناطق العامة',      img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  parking: {
    title: 'المواقف والطرق الداخلية', sub: '3 أقسام رئيسية - 44 مادة',
    img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=700&q=80',
    isSubCat: true,
    subCategories: [
      {
        id: 'surfaces', label: 'الأسطح المرصوفة', desc: 'أسفلت، إنترلوك، خرسانة، مطبات',
        color: '#0043B0', bg: '#E6F0FF',
        img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80',
        items: [
          { icon: 'A', title: 'مواقف السيارات بأنواعها',              desc: 'أسفلت، إنترلوك، خرسانة مطبوعة - فحص وصيانة وترقيع',           img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80' },
          { icon: 'B', title: 'الطرق الداخلية والممرات',               desc: 'طرق مركبات وممرات مشاة - إصلاح تشققات وهبوط وحفر',             img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
          { icon: 'C', title: 'المطبات الصناعية وعلامات التوجيه',      desc: 'Speed Bumps مطاطية ومعدنية - حواجز توجيه، كتل خرسانية',       img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
        ],
      },
      {
        id: 'drainage', label: 'أنظمة التصريف والتحكم', desc: 'صرف، حواجز، تحكم بالدخول',
        color: '#0A7A3C', bg: '#E6F7EE',
        img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        items: [
          { icon: 'A', title: 'مصافط الأمطار وشبكات الصرف',           desc: 'Catch Basins، مواسير صرف، غرف التفتيش - تنظيف دوري',           img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon: 'B', title: 'حواجز الحماية وأعمدة الإنارة',          desc: 'Guard Rails، حواجز ضمان، أعمدة إنارة خارجية للمواقف',         img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon: 'C', title: 'أنظمة التحكم في الدخول',                desc: 'Barriers آلية، أنظمة تذاكر، كاميرات قراءة لوحات وأجهزة دفع',  img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80' },
        ],
      },
      {
        id: 'signage', label: 'العلامات والسلامة', desc: 'دهانات، عواكس، إمكانية الوصول',
        color: '#B05200', bg: '#FFF0E0',
        img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
        items: [
          { icon: 'A', title: 'الدهانات الأرضية واللافتات',            desc: 'Road Markings: أبيض، أصفر، أزرق - لافتات توجيه وتحذير',       img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'B', title: 'العواكس وأزرار الطريق',                  desc: 'Reflectors، Road Studs عاكسة، عيون القطة للطرق الداخلية',     img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80' },
          { icon: 'C', title: 'مناطق ذوي الهمم وممرات المشاة',          desc: 'Accessibility: مسارات خاصة، رمبات، لافتات وعلامات أرضية',     img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  clean: {
    title: 'خدمات النظافة وإدارة المرافق', sub: '4 أقسام رئيسية - 52 مادة',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80',
    isSubCat: true,
    subCategories: [
      {
        id: 'indoor', label: 'النظافة الداخلية', desc: 'معدات، مواد، حاويات، دورات مياه',
        color: '#0043B0', bg: '#E6F0FF',
        img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        items: [
          { icon: 'A', title: 'معدات التنظيف الميكانيكية',            desc: 'مكانس كهربائية، غسالات أرضيات بطارية، شفاطات رطب/جاف',        img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
          { icon: 'B', title: 'مواد التنظيف والتعقيم',                 desc: 'منظفات متعددة الأغراض، مطهرات، معطرات هواء ومزيلات روائح',     img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&q=80' },
          { icon: 'C', title: 'حاويات النفايات وأكياس الجمع',          desc: 'حاويات داخلية مصنفة بألوان، أكياس نفايات بأحجام مختلفة',       img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'D', title: 'دورات المياه ومستلزماتها',               desc: 'صابون سائل، مناديل ورقية، معقمات يد، معطرات دورات مياه',       img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
      {
        id: 'outdoor', label: 'النظافة الخارجية', desc: 'حاويات، كنس، إعادة تدوير',
        color: '#0A7A3C', bg: '#E6F7EE',
        img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80',
        items: [
          { icon: 'A', title: 'حاويات النفايات الخارجية',               desc: 'حاويات كبيرة للمواقف والمداخل، أقفاص تجميع مصنفة',             img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
          { icon: 'B', title: 'معدات كنس وغسيل الأرصفة',               desc: 'آلات كنس ميكانيكية، مكانس يدوية، خراطيم ضغط عالي للأرصفة',   img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'أنظمة جمع القابل لإعادة التدوير',        desc: 'حاويات مصنفة: ورق، بلاستيك، معادن، زجاج - بألوان قياسية',     img: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80' },
        ],
      },
      {
        id: 'waste', label: 'إدارة النفايات', desc: 'فرز، نقل، توثيق وتتبع',
        color: '#B05200', bg: '#FFF0E0',
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        items: [
          { icon: 'A', title: 'فرز النفايات بأنواعها',                  desc: 'عضوي، ورق، بلاستيك، معادن، خطرة - وفق اشتراطات البيئة',       img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'B', title: 'عقود نقل النفايات',                       desc: 'شركات نقل مرخصة، جداول رفع منتظمة، اتفاقيات مستوى خدمة',     img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
          { icon: 'C', title: 'سجلات التخلص الآمن ووثائق التتبع',       desc: 'Waste Manifests، سجلات النفايات الخطرة، تقارير الامتثال البيئي', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
        ],
      },
      {
        id: 'support', label: 'خدمات الدعم', desc: 'مكافحة آفات، واجهات، مفروشات',
        color: '#5B2D8E', bg: '#F0EAFF',
        img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80',
        items: [
          { icon: 'A', title: 'مكافحة الحشرات والقوارض',                desc: 'Pest Control Contracts: رش دوري، مصائد، تقارير ومتابعة',        img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&q=80' },
          { icon: 'B', title: 'تنظيف الواجهات والأسطح العالية',          desc: 'زجاج واجهات، نوافذ علوية، غسيل بالحبال أو رافعات متخصصة',    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon: 'C', title: 'خدمات غسيل وتنظيف المفروشات',             desc: 'سجاد، ستائر، مقاعد انتظار - شامبو جاف، بخار، تنظيف جاف',     img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  tools: {
    title: 'الأدوات ومعدات الورشة', sub: '4 أقسام رئيسية - 68 أداة',
    img: 'https://cdn.salla.sa/vXBaRn/fa03e216-3103-4987-821c-641bd1d1fa5b-500x243.11490978158-y11PvpjSCjs1tRcHbk2epG3MG1rUxMpThgKPoaOq.jpg',
    isSubCat: true,
    subCategories: [
      {
        id: 'hand', label: 'الأدوات اليدوية', desc: 'مفاتيح، كماشات، قياس، سلامة',
        color: '#0043B0', bg: '#E6F0FF',
        img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
        items: [
          { icon: 'A', title: 'مجموعات المفاتيح والكماشات',             desc: 'طقم مفاتيح ربط، شنيورات، كماشات، مناشير يدوية، مسامير',        img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'B', title: 'أدوات القياس اليدوية',                   desc: 'أشرطة قياس، ميزان ماء، ميزان ليزر، ورنية، مسطرة ومثلثات',      img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon: 'C', title: 'أدوات الحماية الشخصية للورشة',            desc: 'نظارات، قفازات ميكانيكية، واقيات أذن، كمامات غبار وكيميائية',  img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
      {
        id: 'power', label: 'الأدوات الكهربائية والميكانيكية', desc: 'دريلات، طاحنات، لحام، هواء',
        color: '#B05200', bg: '#FFF0E0',
        img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
        items: [
          { icon: 'A', title: 'دريلات وطاحنات ومناشير كهربائية',         desc: 'كهرباء وبطارية 18V/12V - Drill, Grinder, Jigsaw, Circular Saw',  img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
          { icon: 'B', title: 'ضواغط هواء وأدوات هوائية',               desc: 'Air Compressors، مسدسات رش، مفاتيح هوائية، مناشير هوائية',      img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'ماكينات لحام ومستلزماتها',                desc: 'لحام كهرباء Inverter، MIG/MAG، TIG أرجون - ماسكات، قفازات',    img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
        ],
      },
      {
        id: 'lifting', label: 'معدات الرفع والمناولة', desc: 'روافع، عربات، منصات عمل',
        color: '#5B2D8E', bg: '#F0EAFF',
        img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80',
        items: [
          { icon: 'A', title: 'روافع يدوية وكهربائية',                   desc: 'Chain Hoists يدوية وكهربائية، Electric Winches، بكرات رفع',     img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80' },
          { icon: 'B', title: 'عربات نقل ورافعات شوكية صغيرة',           desc: 'عربات يدوية وكهربائية، Pallet Jack، رافعة شوكية للمستودعات',    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon: 'C', title: 'منصات عمل متحركة',                        desc: 'Scaffolding خفيف، Lift Tables، سلالم ألمنيوم متعددة الارتفاعات', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
        ],
      },
      {
        id: 'inspection', label: 'معدات القياس والفحص', desc: 'ملتيمتر، حراري، ضغط، تسرب',
        color: '#0A7A3C', bg: '#E6F7EE',
        img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80',
        items: [
          { icon: 'A', title: 'أجهزة قياس كهربائية متعددة',              desc: 'Digital Multimeters، Clamp Meters، Insulation Testers، Analyzers', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon: 'B', title: 'كاميرات حرارية وأجهزة اهتزاز',            desc: 'Thermal Cameras للكشف عن نقاط السخونة، Vibration Analyzers',      img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'أدوات فحص ضغط وتدفق وتسرب',              desc: 'Pressure Gauges، Flow Meters، Leak Detectors للغاز والسوائل',    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  safety: {
    title: 'السلامة المهنية ومعدات الحماية', sub: '4 أقسام رئيسية - 55 معدة',
    img: 'https://www.tsq.com.sa/photos/1740391174.png',
    isSubCat: true,
    subCategories: [
      {
        id: 'ppe', label: 'معدات الحماية الشخصية (PPE)', desc: 'خوذات، قفازات، أحذية، حماية وجه',
        color: '#0043B0', bg: '#E6F0FF',
        img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        items: [
          { icon: 'A', title: 'حماية الرأس والوجه والعيون',            desc: 'خوذات سلامة، نظارات، واقيات وجه، كمامات N95/FFP2',              img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon: 'B', title: 'قفازات الحماية بأنواعها',                desc: 'قطع، كيماوي، حراري، عزل كهربائي - بأحجام مختلفة',              img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'أحذية وملابس السلامة',                   desc: 'أحذية عازلة ومضادة للانزلاق، ملابس عاكسة Hi-Vis، بدل واقية',  img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon: 'D', title: 'معدات الحماية من السقوط',                 desc: 'Full Body Harness، حبال إنقاذ Lanyards، مثبتات ارتفاع',        img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
        ],
      },
      {
        id: 'emergency', label: 'معدات الطوارئ والإنقاذ', desc: 'إسعافات، AED، غازات، إنقاذ',
        color: '#B83200', bg: '#FFF0F0',
        img: 'https://images.unsplash.com/photo-1584982751601-97ddc0501b0e?w=600&q=80',
        items: [
          { icon: 'A', title: 'صناديق الإسعافات الأولية',               desc: 'محتويات معتمدة وفق المعايير: ضمادات، مطهرات، جبائر، مقصات',    img: 'https://images.unsplash.com/photo-1584982751601-97ddc0501b0e?w=400&q=80' },
          { icon: 'B', title: 'أجهزة الإنعاش AED والنقل',               desc: 'AED Defibrillators، نقالات، مثبتات عنق وعمود فقري',            img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'معدات الإنقاذ من الارتفاعات والأماكن المغلقة', desc: 'Confined Space Entry Kit، Tripod Rescue، هواء ضاغط SCBA', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon: 'D', title: 'أجهزة كشف الغازات وقياس الأكسجين',        desc: 'Multi Gas Detectors، O2 Monitors، بطاريات وغازات معايرة',      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
      {
        id: 'systems', label: 'أنظمة السلامة الثابتة', desc: 'درابزين، علامات، إنذار، إخلاء',
        color: '#0A7A3C', bg: '#E6F7EE',
        img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        items: [
          { icon: 'A', title: 'درابزين الحماية والشبكات والمنصات',       desc: 'Guard Rails، Safety Nets، منصات عمل ثابتة ومتنقلة',           img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon: 'B', title: 'علامات السلامة والتحذير',                  desc: 'ISO Standard Signs: تحذير، حظر، إلزامي، معلومات - بمواد عاكسة', img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'C', title: 'أنظمة الإنذار الصوتي والمرئي',             desc: 'Sirens، Strobes، لوحات إنذار طوارئ، أزرار طوارئ Emergency Stop', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
          { icon: 'D', title: 'نقاط التجمع ومسارات الإخلاء',              desc: 'لوحات Muster Point، لافتات Exit، خرائط إخلاء محدثة معتمدة',   img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80' },
        ],
      },
      {
        id: 'training', label: 'التوثيق والتدريب', desc: 'سجلات، تصاريح، تقارير، خطط',
        color: '#5B2D8E', bg: '#F0EAFF',
        img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80',
        items: [
          { icon: 'A', title: 'سجلات تدريب الموظفين على السلامة',         desc: 'حضور، شهادات، تواريخ انتهاء الصلاحية، خطة إعادة التدريب',      img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80' },
          { icon: 'B', title: 'تصاريح العمل الخطر',                       desc: 'Hot Work Permit، Confined Space Entry، Work at Height - توثيق', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
          { icon: 'C', title: 'تقارير الحوادث وشبه الحوادث',              desc: 'Incident Investigation Reports، Root Cause Analysis، CAPA',    img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
          { icon: 'D', title: 'خطط الطوارئ وسيناريوهات المحاكاة',          desc: 'Emergency Response Plans محدثة، Fire Drills، محاكاة شهرية',    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
        ],
      },
    ],
    preventive: [], corrective: [], parts: [], kpi: [],
  },

  kitchen: mk('المطابخ والخدمات الغذائية', '45 قطعة - دورية',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
    [{ name:'تنظيف شفاطات الدهون',    freq:'شهري',       badge:'شهري', bc:'#B05200', bbg:'#FFF0E0', img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&q=60', parts:['FILTER-GREASE-ALU','FILTER-CHARCOAL','HOOD-GREASE-CUP']      }],
    [{ name:'اصلاح اعطال افران الغاز', freq:'عند الحاجة', badge:'طارئ', bc:'#B05200', bbg:'#FFF0E0', img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&q=60', parts:['BURNER-HEAD-GAS-4KW','IGNITER-PIEZO','THERMOCOUPLE-SAFETY'] }],
    [
      { code:'FILTER-GREASE',    name:'فلتر شفاط الومنيوم',  cat:'فلاتر'  },
      { code:'BURNER-HEAD-4KW',  name:'راس موقد غاز 4kW',   cat:'مواقد'  },
      { code:'OVEN-HEATING-2KW', name:'عنصر تسخين فرن 2kW', cat:'افران'  },
      { code:'REFRIG-COMP',      name:'ضاغط ثلاجة نصف HP',  cat:'تبريد'  },
      { code:'ANSUL-2.5KG',      name:'اسطوانة Ansul 2.5كجم',cat:'اطفاء' },
      { code:'THERMOMETER-DIG',  name:'ترمومتر رقمي بمجس',  cat:'قياس'   },
    ],
    [
      { label:'توفر معدات الطهي',    val:'>98%',  c:'#0A7A3C', bg:'#E6F7EE' },
      { label:'حوادث سلامة المطبخ', val:'0/سنة', c:'#0A7A3C', bg:'#E6F7EE' },
      { label:'تنظيف الشفاطات',      val:'100%',  c:'#0043B0', bg:'#E6F0FF' },
      { label:'رضا طاقم المطبخ',     val:'>4/5',  c:'#B05200', bg:'#FFF0E0' },
    ]
  ),

  medical: mk('انظمة المرافق الطبية', '38 قطعة - حرجة جدا',
    'https://images.unsplash.com/photo-1584982751601-97ddc0501b0e?w=700&q=80',
    [
      { name:'فحص شبكات الغازات الطبية', freq:'يومي',   badge:'يومي',   bc:'#0A7A3C', bbg:'#E6F7EE', img:'https://images.unsplash.com/photo-1584982751601-97ddc0501b0e?w=100&q=60', parts:['OUTLET-OXYGEN-UNI','PROBE-OXYGEN-PURITY','ALARM-PANEL-GAS']         },
      { name:'فحص اجهزة التعقيم',        freq:'اسبوعي', badge:'اسبوعي', bc:'#0043B0', bbg:'#E6F0FF', img:'https://images.unsplash.com/photo-1584982751601-97ddc0501b0e?w=100&q=60', parts:['AUTOCLAVE-DOOR-GASKET','AUTOCLAVE-PRESSURE','STERILIZATION-TAPE'] },
    ],
    [{ name:'اصلاح تسربات الغازات الطبية', freq:'عند الحاجة', badge:'طارئ', bc:'#B05200', bbg:'#FFF0E0', img:'https://images.unsplash.com/photo-1584982751601-97ddc0501b0e?w=100&q=60', parts:['REGULATOR-MEDICAL-GAS','VALVE-DIAPHRAGM','FITTING-SANITARY'] }],
    [
      { code:'OUTLET-OXYGEN-UNI', name:'مخرج اكسجين طبي',    cat:'غازات طبية' },
      { code:'AUTOCLAVE-GASKET',  name:'جوان باب اوتوكلاف',  cat:'تعقيم'      },
      { code:'WATER-RO-MEMBRANE', name:'غشاء RO تنقية مياه', cat:'مياه طبية'  },
      { code:'HEPA-H14',          name:'فلتر HEPA H14',       cat:'تنقية هواء' },
      { code:'ISOLATION-TRANS',   name:'محول عزل طبي',       cat:'كهرباء'     },
      { code:'NURSE-CALL-BTN',    name:'زر استدعاء ممرضة',   cat:'اتصال'      },
    ],
    [
      { label:'توفر الغازات الطبية',    val:'100%',  c:'#0A7A3C', bg:'#E6F7EE' },
      { label:'انقطاعات التعقيم',        val:'0/شهر', c:'#0A7A3C', bg:'#E6F7EE' },
      { label:'دقة نقاء المياه الطبية', val:'100%',  c:'#0043B0', bg:'#E6F0FF' },
      { label:'استجابة للانظمة الحرجة', val:'فورية', c:'#B05200', bg:'#FFF0E0' },
    ]
  ),
};
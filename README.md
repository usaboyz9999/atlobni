# اطلبني — atlobni

تطبيق دليل الصيانة والتشغيل الشامل

## معلومات المشروع

- **الاسم**: اطلبني (atlobni)
- **Expo Slug**: atlobni
- **Project ID**: 5f0ccb12-873e-480d-97f9-e618bef7869c
- **Owner**: atlobni
- **GitHub**: https://github.com/usaboyz9999/atlobni
- **Expo Dashboard**: https://expo.dev/accounts/atlobni/projects/atlobni

## المتطلبات

- Node.js >= 18
- Expo CLI
- EAS CLI

## التثبيت

```bash
npm install
```

## التشغيل

```bash
# تشغيل محلي
npm start

# Android
npm run android

# iOS
npm run ios
```

## البناء (EAS Build)

```bash
# معاينة داخلية APK
eas build --platform android --profile preview

# إنتاج
eas build --platform android --profile production
eas build --platform ios --profile production
```

## النشر (EAS Update)

```bash
eas update --branch production --message "تحديث جديد"
```

## هيكل المشروع

```
atlobni/
├── App.js                 # المكون الرئيسي
├── app.json               # إعدادات Expo
├── eas.json               # إعدادات EAS Build
├── package.json           # تبعيات المشروع
├── babel.config.js        # إعدادات Babel
├── assets/                # الأصول (أيقونات، صور)
└── .github/
    └── workflows/
        └── main.yml       # CI/CD Pipeline
```

## الميزات

- 14 تخصص صيانة كامل
- +600 قطعة غيار
- برامج صيانة دورية
- متجر قطع الغيار
- نظام طلبات العمل
- دعم اللغتين العربية والإنجليزية (RTL/LTR)
- نظام سلة التسوق

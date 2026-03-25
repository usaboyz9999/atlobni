import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions, ActivityIndicator, Easing, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// استيراد الصورة المحلية
import localLogoImage from '../assets/logo.png'; 

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  // متغيرات الأنيميشن
  const ballPosition = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const ballScale = useRef(new Animated.Value(0.5)).current;
  const ballRotate = useRef(new Animated.Value(0)).current;
  
  // متغير ظهور المحتوى
  const fadeContent = useRef(new Animated.Value(0)).current;

  // متغير الخروج التدريجي
  const screenFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. أنيميشن شريط التحميل (5 ثواني)
    const duration = 5000;
    const intervalTime = 100;
    const increment = 100 / (duration / intervalTime); 

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    // 2. تسلسل الحركة
    Animated.sequence([
      Animated.parallel([
        // حركة الصورة البطيئة جداً
        Animated.spring(ballPosition, {
          toValue: 0, 
          tension: 10,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.spring(ballScale, {
          toValue: 1, 
          tension: 10, 
          friction: 20, 
          useNativeDriver: true,
        }),
        Animated.timing(ballRotate, {
          toValue: 2, 
          duration: 3500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        
        // ظهور المحتوى أثناء الحركة
        Animated.timing(fadeContent, {
          toValue: 1,
          duration: 800,
          delay: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. الخروج التدريجي
    const timeout = setTimeout(() => {
      clearInterval(timer);
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 800,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  const rotateInterpolate = ballRotate.interpolate({
    inputRange: [0, 2],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenFade }]}>
      
      {/* الخلفية الرسومية */}
      <View style={styles.backgroundPattern}>
        <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
          <Circle cx="0" cy="0" r="150" stroke="#E6E9F0" strokeWidth="2" fill="none" />
          <Circle cx="0" cy="0" r="250" stroke="#F0F2F5" strokeWidth="2" fill="none" />
          <Circle cx={SCREEN_WIDTH} cy={SCREEN_HEIGHT} r="200" stroke="#E6E9F0" strokeWidth="2" fill="none" />
          <Circle cx={SCREEN_WIDTH} cy={SCREEN_HEIGHT} r="300" stroke="#F0F2F5" strokeWidth="2" fill="none" />
          <Circle cx={SCREEN_WIDTH} cy="0" r="100" stroke="#E6E9F0" strokeWidth="2" fill="none" />
          <Circle cx="0" cy={SCREEN_HEIGHT} r="180" stroke="#F0F2F5" strokeWidth="2" fill="none" />
          <Circle cx={SCREEN_WIDTH/2} cy="100" r="40" stroke="#F5F7FA" strokeWidth="2" fill="none" />
          <Circle cx={SCREEN_WIDTH/4} cy={SCREEN_HEIGHT/2} r="60" stroke="#F0F2F5" strokeWidth="2" fill="none" />
        </Svg>
      </View>

      <View style={styles.contentContainer}>
        
        {/* 1. الصورة المربعة */}
        <Animated.View 
          style={[
            styles.imageSquareWrapper, 
            { 
              transform: [
                { translateX: ballPosition },
                { scale: ballScale },
                { rotate: rotateInterpolate }
              ] 
            }
          ]}
        >
          <Image 
            source={localLogoImage} 
            style={styles.squareImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* 2. النصوص والتحميل */}
        <Animated.View style={[styles.quickContent, { opacity: fadeContent }]}>
          
          {/* النصوص */}
          <View style={styles.textWrapper}>
            <Text style={styles.mainTitle}>أعمال الصيانة والتشغيل</Text>
            <Text style={styles.subTitle}>المتكاملة</Text>
            <View style={styles.divider} />
          </View>

          {/* قسم التحميل */}
          <View style={styles.loaderSection}>
            <View style={styles.loaderRow}>
              <ActivityIndicator size="small" color="#10B981" /> {/* ✅ تغيير لون الدائرة للأخضر */}
              <Text style={styles.loadingText}>جاري تحضير التطبيق . . .</Text>
            </View>
            
            {/* شريط التحميل */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
          </View>

        </Animated.View>

      </View>

      {/* التذييل */}
      <Animated.View style={[styles.footer, { opacity: screenFade }]}>
        <Text style={styles.footerText}>جميع الحقوق محفوظة لشركة أطلبني © 2026</Text> 
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 0,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 1,
  },
  imageSquareWrapper: {
    width: 120,
    height: 120,
    marginBottom: 30,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  squareImage: {
    width: '100%',
    height: '100%',
  },
  quickContent: {
    alignItems: 'center',
    width: '100%',
  },
  textWrapper: {
    alignItems: 'center',
    marginBottom: 15,
  },
  // ✅ العنوان باللون الأزرق الاحترافي
  mainTitle: {
    fontSize: 36,
    fontWeight: '900',
    fontFamily: Platform.select({
      ios: 'Arial Rounded MT Bold',
      android: 'Roboto',
      default: 'Arial',
    }),
    color: '#0A2463', // ✅ أزرق داكن احترافي
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: -0.5,
    includeFontPadding: false,
    lineHeight: 42,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: Platform.select({
      ios: 'Arial Rounded MT Bold',
      android: 'Roboto',
      default: 'Arial',
    }),
    color: '#0A2463', // ✅ جعلناsubtitle بنفس اللون الأزرق للتناسق
    textAlign: 'center',
    marginTop: 2,
    includeFontPadding: false,
  },
  divider: {
    width: 70,
    height: 6,
    backgroundColor: '#0A2463', // ✅ الفاصل أيضاً أزرق
    borderRadius: 4,
    marginTop: 15,
  },
  loaderSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  // ✅ نص التحميل باللون الأخضر الاحترافي
  loadingText: {
    fontSize: 15,
    fontWeight: '800', // زيادة السماكة قليلاً ليتناسب مع اللون
    color: '#10B981', // ✅ أخضر زمردي احترافي (Emerald Green)
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#FFFFFF', 
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0A2463', // ✅ شريط التقدم أزرق ليتناسق مع العنوان
    borderRadius: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    zIndex: 1,
  },
  footerText: {
    fontSize: 11,
    color: '#555555',
    fontWeight: '500',
  }
});
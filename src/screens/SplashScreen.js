import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onDone }) {
  const logoScale   = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const subOpacity  = useRef(new Animated.Value(0)).current;
  const fadeOut     = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // ظهور اللوجو
      Animated.parallel([
        Animated.spring(logoScale,   { toValue:1, tension:60, friction:7, useNativeDriver:true }),
        Animated.timing(logoOpacity, { toValue:1, duration:400, useNativeDriver:true }),
      ]),
      // ظهور الاسم
      Animated.timing(textOpacity, { toValue:1, duration:500, delay:100, useNativeDriver:true }),
      // ظهور الوصف
      Animated.timing(subOpacity,  { toValue:1, duration:400, delay:100, useNativeDriver:true }),
      // انتظار ثم اختفاء
      Animated.delay(2800),
      Animated.timing(fadeOut, { toValue:0, duration:600, useNativeDriver:true }),
    ]).start(() => onDone());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={{ flex:1, opacity: fadeOut }}>
      <ImageBackground
        source={{ uri:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80' }}
        style={{ flex:1, width, height }}
      >
        <View style={{ flex:1, backgroundColor:'rgba(10,36,99,0.72)', alignItems:'center', justifyContent:'center' }}>

          {/* اللوجو */}
          <Animated.View style={{
            transform:[{ scale: logoScale }],
            opacity: logoOpacity,
            width:100, height:100, borderRadius:28,
            backgroundColor:'#0078FF',
            alignItems:'center', justifyContent:'center',
            marginBottom:20,
            elevation:14,
            shadowColor:'#0078FF',
            shadowOffset:{width:0,height:6},
            shadowOpacity:0.5,
            shadowRadius:14,
          }}>
            <Text style={{ fontSize:48 }}>⚙️</Text>
          </Animated.View>

          {/* اسم التطبيق */}
          <Animated.Text style={{
            opacity: textOpacity,
            color:'#fff', fontSize:34, fontWeight:'900', letterSpacing:2,
            marginBottom:8,
          }}>
            اطلبني
          </Animated.Text>

          {/* الوصف */}
          <Animated.Text style={{
            opacity: subOpacity,
            color:'rgba(255,255,255,0.7)', fontSize:13, textAlign:'center',
            lineHeight:20,
          }}>
            منصة إدارة التشغيل والصيانة
          </Animated.Text>

          {/* نقاط تحميل */}
          <Animated.View style={{ opacity: subOpacity, marginTop:48, flexDirection:'row', gap:8 }}>
            {[0,1,2].map(i => (
              <LoadingDot key={i} delay={i * 200} />
            ))}
          </Animated.View>

        </View>
      </ImageBackground>
    </Animated.View>
  );
}

function LoadingDot({ delay }) {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue:1,   duration:400, useNativeDriver:true }),
        Animated.timing(anim, { toValue:0.3, duration:400, useNativeDriver:true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{
      width:8, height:8, borderRadius:4,
      backgroundColor:'#0078FF', opacity:anim,
    }} />
  );
}
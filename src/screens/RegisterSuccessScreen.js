import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterSuccessScreen({ onDone }) {
  const { user } = useAuth();
  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress= useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // أنيميشن الظهور
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale,   { toValue:1, tension:55, friction:7, useNativeDriver:true }),
        Animated.timing(opacity, { toValue:1, duration:400, useNativeDriver:true }),
      ]),
      // شريط تقدم 5 ثوانٍ
      Animated.timing(progress, { toValue:1, duration:5000, useNativeDriver:false }),
    ]).start(() => onDone());
  }, []);

  const barWidth = progress.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] });

  return (
    <View style={{
      flex:1, backgroundColor:'#0A2463',
      alignItems:'center', justifyContent:'center', padding:32,
    }}>
      {/* دائرة النجاح */}
      <Animated.View style={{
        transform:[{ scale }], opacity,
        width:120, height:120, borderRadius:60,
        backgroundColor:'#0A7A3C',
        alignItems:'center', justifyContent:'center',
        marginBottom:28,
        elevation:10,
        shadowColor:'#0A7A3C', shadowOffset:{width:0,height:6},
        shadowOpacity:0.5, shadowRadius:12,
      }}>
        <Text style={{ fontSize:54 }}>✅</Text>
      </Animated.View>

      <Animated.View style={{ opacity, alignItems:'center' }}>
        <Text style={{ color:'#fff', fontSize:24, fontWeight:'900', marginBottom:8 }}>
          تم إنشاء الحساب! 🎉
        </Text>
        <Text style={{ color:'rgba(255,255,255,0.75)', fontSize:14, textAlign:'center', lineHeight:22 }}>
          مرحباً {user?.name}{'\n'}تم تسجيلك بنجاح في اطلبني
        </Text>

        {/* بطاقة المعلومات */}
        <View style={{
          backgroundColor:'rgba(255,255,255,0.12)', borderRadius:16,
          padding:16, marginTop:24, width:'100%',
          borderWidth:1, borderColor:'rgba(255,255,255,0.2)',
        }}>
          {[
            ['👤','الاسم',  user?.name],
            ['📧','البريد', user?.email],
            ['💼','المسمى', user?.role],
          ].map(([icon,label,val]) => (
            <View key={label} style={{ flexDirection:'row', justifyContent:'space-between',
              paddingVertical:7, borderBottomWidth:1, borderBottomColor:'rgba(255,255,255,0.1)' }}>
              <Text style={{ color:'rgba(255,255,255,0.9)', fontSize:12, fontWeight:'600' }}>{val}</Text>
              <Text style={{ color:'rgba(255,255,255,0.6)', fontSize:11 }}>{icon} {label}</Text>
            </View>
          ))}
        </View>

        {/* شريط التقدم */}
        <View style={{ marginTop:28, width:'100%' }}>
          <Text style={{ color:'rgba(255,255,255,0.5)', fontSize:10, textAlign:'center', marginBottom:8 }}>
            سيتم الانتقال إلى الإعدادات...
          </Text>
          <View style={{ height:4, backgroundColor:'rgba(255,255,255,0.15)', borderRadius:2, overflow:'hidden' }}>
            <Animated.View style={{
              height:4, width:barWidth,
              backgroundColor:'#0078FF', borderRadius:2,
            }} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
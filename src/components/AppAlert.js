import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { alertRef } from './alertBridge';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const AlertCtx = createContext(null);
export const useAppAlert = () => useContext(AlertCtx);

export function AppAlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const show = useCallback((title, message, buttons = [{ text: 'حسناً' }]) => {
    setAlert({ title, message, buttons });
  }, []);

  const hide = () => setAlert(null);

  // Set global ref so Alert.alert replacements work
  useEffect(() => { alertRef.current = show; return () => { alertRef.current = null; }; }, [show]);

  return (
    <AlertCtx.Provider value={show}>
      {children}
      {alert && (
        <Modal transparent animationType="fade" visible statusBarTranslucent>
          <View style={st.overlay}>
            <View style={st.box}>
              {/* أيقونة */}
              <View style={st.iconWrap}>
                <Text style={{ fontSize: 28 }}>
                  {alert.title?.includes('خروج') ? '🚪' :
                   alert.title?.includes('تنبيه') ? '⚠️' :
                   alert.title?.includes('خطأ')  ? '❌' :
                   alert.title?.includes('تم') || alert.title?.includes('✅') ? '✅' :
                   alert.title?.includes('❤️')  ? '❤️' :
                   alert.title?.includes('🔐')  ? '🔐' :
                   alert.title?.includes('⭐')  ? '⭐' :
                   alert.title?.includes('شكر') ? '💙' : 'ℹ️'}
                </Text>
              </View>
              {/* العنوان */}
              <Text style={st.title}>{alert.title}</Text>
              {/* الرسالة */}
              {!!alert.message && <Text style={st.msg}>{alert.message}</Text>}
              {/* الأزرار */}
              <View style={[st.btnRow, alert.buttons.length === 1 && { justifyContent: 'center' }]}>
                {alert.buttons.map((btn, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => { hide(); btn.onPress?.(); }}
                    activeOpacity={0.85}
                    style={[
                      st.btn,
                      btn.style === 'cancel'      && st.btnCancel,
                      btn.style === 'destructive' && st.btnDestructive,
                      !btn.style && i === alert.buttons.length - 1 && st.btnPrimary,
                    ]}
                  >
                    <Text style={[
                      st.btnTxt,
                      btn.style === 'cancel'      && st.btnTxtCancel,
                      btn.style === 'destructive' && st.btnTxtDestructive,
                      !btn.style && i === alert.buttons.length - 1 && st.btnTxtPrimary,
                    ]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </AlertCtx.Provider>
  );
}

const st = StyleSheet.create({
  overlay:        { flex:1, backgroundColor:'rgba(0,0,0,0.6)', alignItems:'center', justifyContent:'center', padding:32 },
  box:            { backgroundColor:'#fff', borderRadius:24, padding:24, width:'100%', maxWidth:320, alignItems:'center', elevation:20, shadowColor:'#000', shadowOffset:{width:0,height:10}, shadowOpacity:0.3, shadowRadius:20 },
  iconWrap:       { width:60, height:60, borderRadius:30, backgroundColor:'#EEF2F7', alignItems:'center', justifyContent:'center', marginBottom:14 },
  title:          { fontSize:17, fontWeight:'900', color:'#0A2463', textAlign:'center', marginBottom:8 },
  msg:            { fontSize:13, color:'#6B7C93', textAlign:'center', lineHeight:20, marginBottom:20 },
  btnRow:         { flexDirection:'row', gap:10, width:'100%', marginTop:4 },
  btn:            { flex:1, paddingVertical:12, borderRadius:14, alignItems:'center', backgroundColor:'#EEF2F7' },
  btnPrimary:     { backgroundColor:'#0A2463' },
  btnCancel:      { backgroundColor:'#EEF2F7' },
  btnDestructive: { backgroundColor:'#FFF0F0', borderWidth:1, borderColor:'#FFD0D0' },
  btnTxt:         { fontSize:13, fontWeight:'700', color:'#6B7C93' },
  btnTxtPrimary:  { color:'#fff' },
  btnTxtCancel:   { color:'#6B7C93' },
  btnTxtDestructive:{ color:'#D32F2F' },
});
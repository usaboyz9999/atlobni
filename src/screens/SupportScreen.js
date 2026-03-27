import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  BackHandler, KeyboardAvoidingView, Platform, Animated, Linking,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../components/alertBridge';
// استيراد الدوال الذكية من ملف المعرفة الجديد
import { getBotReply, getNavigationIntent, isYesResponse, isNoResponse, NAV_SCREENS } from '../data/botKnowledge';

// ─── ثوابت الحالات ───────────────────────────────────────────
const STATUS_MAP = {
  waiting: { label:'في انتظار فريق الدعم', color:'#B05200', bg:'#FFF8E0', icon:'⏳' },
  open:    { label:'مفتوحة - جارٍ المعالجة', color:'#0043B0', bg:'#E6F0FF', icon:'🔵' },
  closed:  { label:'مغلقة',                  color:'#6B7C93', bg:'#F4F7FB', icon:'🔒' },
};

const CATEGORIES = [
  '🛒 مشكلة في الطلب', '💳 مشكلة في الدفع', '📦 منتج معيب',
  '🏷️ مشكلة في الكوبون', '⚙️ مشكلة تقنية', '❓ استفسار عام',
];

// ردود تلقائية بسيطة للتذاكر (غير البوت)
const AUTO_SEQ = [
  'شكراً للتواصل معنا! سيقوم أحد أعضاء فريق الدعم بمراجعة تذكرتك قريباً. ⏳',
  'نعتذر عن التأخير في الرد، سوف يتم الرد عليك في أقرب وقت ممكن. 🙏',
  'ما هي المشكلة؟ اكتب تفاصيل المشكلة وسيتم إرسالها فوراً إلى فريق الدعم. 📝',
  'أنا في انتظار شرح المشكلة... 🤔',
  'شكراً لشرح مشكلتك، سوف يتم إرسالها فوراً إلى الدعم والرد عليك في الحال. ✅',
];

function now() {
  return new Date().toLocaleTimeString('ar-SA', { hour:'2-digit', minute:'2-digit' });
}
function today() {
  return new Date().toLocaleDateString('ar-SA');
}

// ─── مؤشر جاري الكتابة (للدعم البشري) ───────────────────────
function TypingIndicator({ theme }) {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - i * 200),
        ])
      )
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
      <Text style={{ fontSize: 10, color: theme.subText, marginBottom: 3 }}>⏰ جاري الكتابة</Text>
      <View style={{
        backgroundColor: '#F4F7FB', borderRadius: 16, borderBottomLeftRadius: 4,
        padding: 12, paddingHorizontal: 16,
        flexDirection: 'row', alignItems: 'center', gap: 5,
        borderWidth: 1, borderColor: theme.border,
      }}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={{
            width: 8, height: 8, borderRadius: 4,
            backgroundColor: '#6B7C93',
            opacity: dot,
            transform: [{ scale: dot.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
          }} />
        ))}
      </View>
    </View>
  );
}

// ─── مؤشر جاري كتابة البوت ──────────────────────────────────
function BotTypingIndicator({ theme }) {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.delay(540 - i * 180),
        ])
      )
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
      <Text style={{ fontSize: 10, color: theme.subText, marginBottom: 3 }}>🤖 مساعد اطلبني يفكر...</Text>
      <View style={{
        backgroundColor: '#E6F7EE', borderRadius: 16, borderBottomLeftRadius: 4,
        padding: 12, paddingHorizontal: 16,
        flexDirection: 'row', alignItems: 'center', gap: 5,
        borderWidth: 1, borderColor: '#0A7A3C33',
      }}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={{
            width: 8, height: 8, borderRadius: 4,
            backgroundColor: '#0A7A3C',
            opacity: dot,
            transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
          }} />
        ))}
      </View>
    </View>
  );
}

// ─── فقاعة رسالة محسنة ─────────────────────────────────────
function ChatBubble({ msg, theme, onNavigate }) {
  const isUser = msg.from === 'user';
  const iBot   = msg.from === 'bot';
  const isAuto = msg.from === 'system';

  const bubbleBg    = isUser ? '#0A2463' : iBot ? '#E6F7EE' : isAuto ? '#F4F7FB' : '#E6F0FF';
  const textColor   = isUser ? '#fff' : theme.text;
  const senderLabel = isUser ? null : iBot ? '🤖 مساعد اطلبني' : isAuto ? '⏰ رد تلقائي' : '👨‍💼 فريق الدعم';

  return (
    <View style={{ alignItems: isUser ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
      {senderLabel && (
        <Text style={{ fontSize: 10, color: theme.subText, marginBottom: 3, fontWeight:'700' }}>{senderLabel}</Text>
      )}
      <View style={{
        maxWidth: '85%', backgroundColor: bubbleBg,
        borderRadius: 16,
        borderBottomRightRadius: isUser ? 4 : 16,
        borderBottomLeftRadius:  isUser ? 16 : 4,
        padding: 14, borderWidth: 1,
        borderColor: isUser ? '#0A2463' : iBot ? '#0A7A3C33' : theme.border,
      }}>
        {/* نص الرسالة مع دعم الأسطر الجديدة */}
        <Text style={{ fontSize: 14, color: textColor, lineHeight: 22, textAlign:'right' }}>
          {msg.text}
        </Text>
        
        {/* زر التنقل الديناميكي (إذا وجد) */}
        {msg.action && msg.actionLabel && (
          <TouchableOpacity
            onPress={() => onNavigate && onNavigate(msg.action.replace('go_', ''))}
            style={{
              alignSelf: 'flex-start', // الزر يظهر على اليسار دائماً
              backgroundColor: iBot ? '#0A7A3C' : '#0A2463',
              borderRadius: 20,
              paddingHorizontal: 16, paddingVertical: 8,
              marginTop: 10,
              flexDirection: 'row', alignItems: 'center', gap: 6,
              elevation: 3, shadowColor:'#000', shadowOpacity:0.1, shadowOffset:{width:0,height:2}, shadowRadius:4,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>{msg.actionLabel}</Text>
            <Text style={{ color: '#fff', fontSize: 16 }}>➜</Text>
          </TouchableOpacity>
        )}

        <Text style={{ fontSize: 9, color: isUser ? 'rgba(255,255,255,0.6)' : theme.subText, marginTop: 6, textAlign: isUser ? 'left' : 'right', opacity:0.7 }}>
          {msg.time}
        </Text>
      </View>
    </View>
  );
}

// ─── دردشة التذكرة (الدعم البشري) ────────────────────────────
function TicketChat({ ticket, onBack, onClose, onUpdateTicket, theme }) {
  const [input,      setInput]      = useState('');
  const [messages,   setMessages]   = useState(ticket.messages || []);
  const [isTyping,   setIsTyping]   = useState(false);
  const scrollRef = useRef(null);
  const userMsgCount = useRef(0);

  function addMsg(msgs, newMsg) {
    const updated = [...msgs, newMsg];
    setMessages(updated);
    onUpdateTicket(ticket.id, { messages: updated });
    return updated;
  }

  function sendAutoReply(msgs, idx) {
    setTimeout(() => {
      const reply = { id: Date.now() + idx, from: 'system', text: AUTO_SEQ[idx], time: now() };
      const updated = [...msgs, reply];
      setMessages(updated);
      onUpdateTicket(ticket.id, { messages: updated });
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 1000 + idx * 500);
    return msgs;
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setInput('');

    const hasRealSupport = messages.some(m => m.from === 'support');
    const userMsg = { id: Date.now(), from: 'user', text, time: now() };
    const msgs1 = [...messages, userMsg];
    setMessages(msgs1);
    onUpdateTicket(ticket.id, { messages: msgs1 });
    userMsgCount.current += 1;
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    if (hasRealSupport) return;

    const uCount = userMsgCount.current;
    function autoReplyWithTyping(typingDelay, replyDelay, replyText, baseMsgs, onDone) {
      setTimeout(() => {
        setIsTyping(true);
        scrollRef.current?.scrollToEnd({ animated: true });
        setTimeout(() => {
          setIsTyping(false);
          const r = { id: Date.now() + replyDelay, from: 'system', text: replyText, time: now() };
          const m2 = [...baseMsgs, r];
          setMessages(m2);
          onUpdateTicket(ticket.id, { messages: m2 });
          scrollRef.current?.scrollToEnd({ animated: true });
          onDone?.(m2);
        }, replyDelay);
      }, typingDelay);
    }

    if (uCount === 1) autoReplyWithTyping(800, 1200, AUTO_SEQ[1], msgs1, null);
    else if (uCount === 2) {
      autoReplyWithTyping(800, 1200, AUTO_SEQ[2], msgs1, (m2) => {
        setTimeout(() => {
          setIsTyping(true);
          scrollRef.current?.scrollToEnd({ animated: true });
          setTimeout(() => {
            setIsTyping(false);
            const r2 = { id: Date.now()+2, from:'system', text: AUTO_SEQ[3], time: now() };
            const m3 = [...m2, r2];
            setMessages(m3);
            onUpdateTicket(ticket.id, { messages: m3 });
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 1000);
        }, 1000);
      });
    } else if (uCount >= 3) {
      autoReplyWithTyping(800, 1200, AUTO_SEQ[4], msgs1, null);
    }
  }

  const statusInfo = STATUS_MAP[ticket.status] || STATUS_MAP.waiting;

  return (
    <KeyboardAvoidingView style={{ flex:1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>

      {/* رأس التذكرة */}
      <View style={{ backgroundColor:'#0A2463', padding:16 }}>
        <View style={{ flexDirection:'row', alignItems:'center', gap:10, marginBottom:10 }}>
          <TouchableOpacity onPress={onBack} style={{
            backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10,
            paddingHorizontal:12, paddingVertical:6,
          }}>
            <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
          </TouchableOpacity>
          <Text style={{ color:'#fff', fontSize:14, fontWeight:'800', flex:1, textAlign:'right' }} numberOfLines={1}>
            {ticket.subject}
          </Text>
        </View>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
          <TouchableOpacity onPress={() => showAlert('إغلاق التذكرة', 'هل تريد إغلاق هذه التذكرة؟', [
            { text:'إلغاء', style:'cancel' },
            { text:'إغلاق', style:'destructive', onPress: onClose },
          ])} style={{ backgroundColor:'#D32F2F', borderRadius:8, paddingHorizontal:12, paddingVertical:5 }}>
            <Text style={{ color:'#fff', fontSize:11, fontWeight:'700' }}>🔒 إغلاق</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: statusInfo.bg, borderRadius:10, paddingHorizontal:10, paddingVertical:4 }}>
            <Text style={{ fontSize:11, fontWeight:'700', color: statusInfo.color }}>
              {statusInfo.icon} {statusInfo.label}
            </Text>
          </View>
        </View>
      </View>

      {/* الرسائل */}
      <ScrollView ref={scrollRef} style={{ flex:1, backgroundColor: theme.bg }}
        contentContainerStyle={{ padding:14 }} showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {messages.map(msg => <ChatBubble key={msg.id} msg={msg} theme={theme} />)}
        {isTyping && <TypingIndicator theme={theme} />}
        <View style={{ height:20 }} />
      </ScrollView>

      {/* حقل الإرسال */}
      {ticket.status !== 'closed' && (
        <View style={{ flexDirection:'row', gap:8, padding:12,
          backgroundColor: theme.card, borderTopWidth:1, borderTopColor: theme.border }}>
          <TouchableOpacity onPress={sendMessage} style={{
            backgroundColor:'#0A2463', borderRadius:24, width:44, height:44,
            alignItems:'center', justifyContent:'center',
          }}>
            <Text style={{ color:'#fff', fontSize:20 }}>➤</Text>
          </TouchableOpacity>
          <TextInput value={input} onChangeText={setInput}
            placeholder="اكتب رسالتك..."
            placeholderTextColor={theme.subText}
            style={{
              flex:1, backgroundColor: theme.bg, borderRadius:22,
              paddingHorizontal:14, paddingVertical:10,
              fontSize:13, color: theme.text, textAlign:'right',
              borderWidth:1.5, borderColor: theme.border,
            }}
            underlineColorAndroid="transparent"
            onSubmitEditing={sendMessage}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// ─── إنشاء تذكرة ─────────────────────────────────────────────
function CreateForm({ onSubmit, onCancel, theme }) {
  const [subject,  setSubject]  = useState('');
  const [body,     setBody]     = useState('');
  const [category, setCategory] = useState('');

  function submit() {
    if (!category)      { showAlert('تنبيه', 'يرجى اختيار تصنيف المشكلة'); return; }
    if (!subject.trim()){ showAlert('تنبيه', 'يرجى إدخال موضوع التذكرة'); return; }
    if (!body.trim())   { showAlert('تنبيه', 'يرجى وصف مشكلتك'); return; }
    onSubmit({ subject: subject.trim(), body: body.trim(), category });
  }

  return (
    <View style={{ padding:14 }}>
      <Text style={{ fontSize:16, fontWeight:'900', color: theme.text, textAlign:'right', marginBottom:16 }}>
        📝 تذكرة دعم جديدة
      </Text>

      <Text style={{ fontSize:12, fontWeight:'700', color: theme.subText, textAlign:'right', marginBottom:8 }}>
        تصنيف المشكلة *
      </Text>
      <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16, justifyContent:'flex-end' }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={{
            paddingHorizontal:12, paddingVertical:7, borderRadius:20,
            backgroundColor: category === cat ? '#0A2463' : theme.bg,
            borderWidth:1.5, borderColor: category === cat ? '#0A2463' : theme.border,
          }}>
            <Text style={{ fontSize:11, fontWeight:'700', color: category === cat ? '#fff' : theme.text }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ fontSize:12, fontWeight:'700', color: theme.subText, textAlign:'right', marginBottom:6 }}>
        موضوع التذكرة *
      </Text>
      <TextInput value={subject} onChangeText={setSubject}
        placeholder="موضوع المشكلة باختصار"
        placeholderTextColor={theme.subText}
        style={{ backgroundColor: theme.bg, borderRadius:12, padding:12, fontSize:13, color: theme.text, textAlign:'right', borderWidth:1.5, borderColor: theme.border, marginBottom:14 }}
        underlineColorAndroid="transparent"
      />

      <Text style={{ fontSize:12, fontWeight:'700', color: theme.subText, textAlign:'right', marginBottom:6 }}>
        وصف المشكلة *
      </Text>
      <TextInput value={body} onChangeText={setBody}
        placeholder="اشرح مشكلتك بالتفصيل..."
        placeholderTextColor={theme.subText} multiline numberOfLines={4}
        style={{ backgroundColor: theme.bg, borderRadius:12, padding:12, fontSize:13, color: theme.text, textAlign:'right', textAlignVertical:'top', borderWidth:1.5, borderColor: theme.border, minHeight:100, marginBottom:20 }}
        underlineColorAndroid="transparent"
      />

      <TouchableOpacity onPress={submit} style={{ backgroundColor:'#0A2463', borderRadius:14, paddingVertical:14, alignItems:'center', marginBottom:10 }}>
        <Text style={{ color:'#fff', fontSize:14, fontWeight:'700' }}>إرسال التذكرة</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCancel} style={{ backgroundColor: theme.bg, borderRadius:14, paddingVertical:12, alignItems:'center', borderWidth:1, borderColor: theme.border }}>
        <Text style={{ color: theme.subText, fontSize:13 }}>إلغاء</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── AI Bot Chat (المحرك الذكي الرئيسي) ─────────────────────
// ✅ تم إزالة INITIAL_BOT_MSG الثابت واستبداله بترحيب ديناميكي باسم المستخدم

function BotChat({ onBack, theme, onNavigate }) {
  const { botMessages, addBotMessage, clearBotMessages, user } = useAuth(); // ✅ إضافة user من auth
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  // سياق للردود الذكية (انتظار نعم/لا)
  const pendingContext = useRef(null);
  const scrollRef = useRef(null);

  // ✅ توليد رسالة الترحيب الأولية ديناميكياً باسم المستخدم
  const getInitialGreeting = () => {
    const userName = user?.name || user?.fullName || 'غالي'; // جلب الاسم مع fallback
    return `ياهلا فيك يا ${userName} نورت التطبيق! 🌹\n\nأنا مساعد "اطلبني" الذكي، رفيقك في تطبيق أطلبني في أي وقت وبكل سرور.\n\nتفضل، وش اللي تبي تسأله أو تبيه اليوم؟\n• خدمات صيانة (تكييف، سباكة، كهرباء)؟ 🛠️\n• قطع غيار ومنتجات من المتجر؟ 🛒\n• استفسار عن حسابك، نقاطك، أو طلباتك؟ 📋\n\nأنا معاك خطوة بخطوة، تفضل بسؤالك! 😊`;
  };

  // ✅ عرض الرسائل: إذا كانت فارغة، نبدأ بالترحيب الديناميكي
  const displayMessages = botMessages.length > 0 ? botMessages : [
    { id: 0, from: 'bot', text: getInitialGreeting(), time: '' }
  ];

  function addMsg(msg) {
    addBotMessage(msg);
  }

  function sendBotReply(replyText, extra = {}) {
    setLoading(true);
    // محاكاة وقت التفكير البشري
    setTimeout(() => {
      const botMsg = { id: Date.now()+1, from:'bot', text: replyText, time: now(), ...extra };
      addBotMessage(botMsg);
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 900);
  }

  function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    // 1. إضافة رسالة المستخدم
    const userMsg = { id: Date.now(), from: 'user', text, time: now() };
    addBotMessage(userMsg);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    // 2. معالجة ردود "نعم/لا" السياقية أولاً
    if (isYesResponse(text)) {
      if (pendingContext.current?.type === 'navigate') {
        const ctx = pendingContext.current; 
        pendingContext.current = null;
        const navLabels = { store:'🛒 انتقل للمتجر', programs:'⚙️ انتقل للبرامج', orders:'📋 انتقل للطلبات', profile:'👤 انتقل لحسابي', home:'🏠 الرئيسية', cart:'🛒 السلة' };
        sendBotReply('ممتاز يا غالي! 🚀 جاري نقلك الآن...', { action: 'go_' + ctx.screen, actionLabel: navLabels[ctx.screen] || '🔗 انتقل الآن' });
      } else {
        sendBotReply('حسناً يا غالي! 👍 تفضل، وش الخطوة التالية؟');
      }
      return;
    }
    
    if (isNoResponse(text)) {
      pendingContext.current = null;
      sendBotReply('حسناً، لا تتردد ترجع لي أي وقت! 😊 في شي ثاني تبي تسأله؟');
      return;
    }

    // 3. كشف نية التنقل المباشرة (مثلاً: "أبي أدخل المتجر")
    const navScreen = getNavigationIntent(text);
    if (navScreen) {
      const navLabels = { store:'🛒 انتقل للمتجر', programs:'⚙️ انتقل للبرامج', orders:'📋 انتقل للطلبات', profile:'👤 انتقل لحسابي', home:'🏠 الرئيسية', cart:'🛒 السلة' };
      // إذا كانت النية واضحة جداً، ننقله مباشرة أو نؤكد
      sendBotReply(`بالتأكيد يا غالي! اضغط الزر أدناه للانتقال فوراً إلى ${navLabels[navScreen] || 'الصفحة'} 🚀`, { action: 'go_' + navScreen, actionLabel: navLabels[navScreen] });
      pendingContext.current = { type: 'navigate', screen: navScreen };
      return;
    }

    // 4. المحرك الذكي للردود (من ملف botKnowledge.js)
    // ✅ تم إضافة تمرير اسم المستخدم لدالة getBotReply
    const userName = user?.name || user?.fullName || 'غالي';
    const reply = getBotReply(text, userName);

    // 5. تحليل الرد لاستخراج أزرار تنقل ديناميكية إذا لزم الأمر
    const replyLower = reply.toLowerCase();
    let navAction = null;
    
    // منطق بسيط لإضافة أزرار بناءً على محتوى الرد
    if (/متجر|منتجات|قطع غيار|اشتري/.test(replyLower)) {
      navAction = { screen: 'store', label: '🛒 انتقل للمتجر الآن' };
    } else if (/برامج|صيانة دورية|عقد/.test(replyLower)) {
      navAction = { screen: 'programs', label: '⚙️ شاهد برامج الصيانة' };
    } else if (/طلباتي|تتبع|شحن/.test(replyLower)) {
      navAction = { screen: 'orders', label: '📋 تتبع طلباتي' };
    } else if (/حسابي|نقاطي|تعديل/.test(replyLower)) {
      navAction = { screen: 'profile', label: '👤 إدارة حسابي' };
    }

    if (navAction) {
      sendBotReply(reply, { action: 'go_' + navAction.screen, actionLabel: navAction.label });
      pendingContext.current = { type: 'navigate', screen: navAction.screen };
    } else {
      sendBotReply(reply);
      pendingContext.current = null;
    }
  }

  function handleClearChat() {
    showAlert('🗑️ حذف المحادثة', 'هل تريد حذف جميع رسائل المحادثة وبدء محادثة جديدة؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف وبدء جديد', style: 'destructive', onPress: () => {
        clearBotMessages();
        pendingContext.current = null;
      }},
    ]);
  }

  return (
    <KeyboardAvoidingView style={{ flex:1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>

      {/* رأس البوت */}
      <View style={{ backgroundColor:'#0A7A3C', padding:16, flexDirection:'row', alignItems:'center', gap:10 }}>
        <TouchableOpacity onPress={onBack} style={{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6 }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClearChat} style={{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:10, paddingVertical:6 }}>
          <Text style={{ color:'#fff', fontSize:12 }}>🗑️</Text>
        </TouchableOpacity>
        <View style={{ flex:1, alignItems:'flex-end' }}>
          <Text style={{ color:'#fff', fontSize:15, fontWeight:'900' }}>🤖 مساعد اطلبني</Text>
          <Text style={{ color:'rgba(255,255,255,0.8)', fontSize:10 }}>مدعوم بالذكاء الاصطناعي السعودي</Text>
        </View>
        <View style={{ width:40, height:40, borderRadius:20, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' }}>
          <Text style={{ fontSize:20 }}>🤖</Text>
        </View>
      </View>

      {/* منطقة الرسائل */}
      <ScrollView ref={scrollRef} style={{ flex:1, backgroundColor: theme.bg }}
        contentContainerStyle={{ padding:14 }} showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {displayMessages.map((msg, idx) => (
          <View key={msg.id || idx}>
            <ChatBubble msg={msg} theme={theme} onNavigate={onNavigate} />
          </View>
        ))}
        {loading && <BotTypingIndicator theme={theme} />}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* حقل الإدخال */}
      <View style={{ flexDirection:'row', gap:8, padding:12, backgroundColor: theme.card, borderTopWidth:1, borderTopColor: theme.border }}>
        <TouchableOpacity onPress={sendMessage} disabled={loading || !input.trim()} style={{
          backgroundColor: loading || !input.trim() ? '#DDE4EF' : '#0A7A3C',
          borderRadius:24, width:44, height:44, alignItems:'center', justifyContent:'center',
        }}>
          <Text style={{ color:'#fff', fontSize:20 }}>➤</Text>
        </TouchableOpacity>
        <TextInput value={input} onChangeText={setInput}
          placeholder="اسألني أي شيء باللهجة السعودية..."
          placeholderTextColor={theme.subText}
          style={{
            flex:1, backgroundColor: theme.bg, borderRadius:22,
            paddingHorizontal:14, paddingVertical:10,
            fontSize:13, color: theme.text, textAlign:'right',
            borderWidth:1.5, borderColor: theme.border,
          }}
          underlineColorAndroid="transparent"
          onSubmitEditing={sendMessage}
          editable={!loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}


// ─── الشاشة الرئيسية للدعم ──────────────────────────────────
export default function SupportScreen({ onBack, onNavigate }) {
  const theme  = useTheme();
  const { tickets, addTicket, updateTicket, deleteTicket } = useAuth();
  const [view,         setView]         = useState('list');
  const [activeTicket, setActiveTicket] = useState(null);
  const [showBot,      setShowBot]      = useState(false);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showBot)                   { setShowBot(false);   return true; }
      if (view === 'chat')           { setView('list');      return true; }
      if (view === 'create')         { setView('list');      return true; }
      onBack(); return true;
    });
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, showBot]);

  // عرض شاشة البوت
  if (showBot) return <BotChat onBack={() => setShowBot(false)} theme={theme} onNavigate={onNavigate} />;

  // عرض دردشة التذكرة
  if (view === 'chat' && activeTicket) {
    const liveTicket = tickets.find(t => t.id === activeTicket.id) || activeTicket;
    return (
      <View style={{ flex:1 }}>
        <TicketChat
          ticket={liveTicket}
          onBack={() => setView('list')}
          onClose={() => { updateTicket(liveTicket.id, { status:'closed' }); setView('list'); }}
          onUpdateTicket={updateTicket}
          theme={theme}
        />
      </View>
    );
  }

  // عرض نموذج إنشاء تذكرة
  if (view === 'create') {
    return (
      <View style={{ flex:1, backgroundColor: theme.bg }}>
        <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
          <TouchableOpacity onPress={() => setView('list')} style={{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6 }}>
            <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
          </TouchableOpacity>
          <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>
            🎫 إنشاء تذكرة دعم
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CreateForm
            onSubmit={data => {
              const ticket = {
                id:       Date.now(),
                subject:  data.subject,
                category: data.category,
                status:   'waiting',
                date:     today(),
                messages: [
                  { id:1, from:'user',   text: data.body,         time: now() },
                  { id:2, from:'system', text: AUTO_SEQ[0],       time: now() },
                ],
              };
              addTicket(ticket);
              setView('list');
              showAlert('✅ تم الإرسال', 'تم إنشاء تذكرة الدعم بنجاح\nسيتواصل معك فريق الدعم قريباً');
            }}
            onCancel={() => setView('list')}
            theme={theme}
          />
          <View style={{ height:120 }} />
        </ScrollView>
      </View>
    );
  }

  // عرض قائمة التذاكر
  const hasOpen = tickets.some(t => t.status !== 'closed');

  return (
    <View style={{ flex:1, backgroundColor: theme.bg }}>
      <View style={{ backgroundColor:'#0A2463', padding:18, flexDirection:'row', alignItems:'center', gap:12 }}>
        <TouchableOpacity onPress={onBack} style={{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:10, paddingHorizontal:12, paddingVertical:6 }}>
          <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900', flex:1, textAlign:'right' }}>
          🎫 الدعم والمساعدة
        </Text>
      </View>

      <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding:14, gap:10 }}>

          {/* زر مساعد اطلبني الذكي */}
          <TouchableOpacity onPress={() => setShowBot(true)} style={{
            backgroundColor:'#0A7A3C', borderRadius:16, padding:16,
            flexDirection:'row', alignItems:'center', justifyContent:'space-between',
            elevation:4, shadowColor:'#0A7A3C', shadowOffset:{width:0,height:4},
            shadowOpacity:0.25, shadowRadius:8,
          }}>
            <View style={{ backgroundColor:'rgba(255,255,255,0.2)', borderRadius:14, paddingHorizontal:12, paddingVertical:6 }}>
              <Text style={{ color:'#fff', fontSize:12, fontWeight:'700' }}>ابدأ المحادثة ›</Text>
            </View>
            <View style={{ alignItems:'flex-end' }}>
              <Text style={{ color:'#fff', fontSize:15, fontWeight:'900' }}>🤖 مساعد اطلبني الذكي</Text>
              <Text style={{ color:'rgba(255,255,255,0.9)', fontSize:11, marginTop:2 }}>
                يرد فوراً باللهجة السعودية
              </Text>
            </View>
          </TouchableOpacity>

          {/* فاصل */}
          <View style={{ flexDirection:'row', alignItems:'center', gap:10, marginVertical:5 }}>
            <View style={{ flex:1, height:1, backgroundColor: theme.border }} />
            <Text style={{ fontSize:11, color: theme.subText, fontWeight:'700' }}>تذاكر الدعم الفني</Text>
            <View style={{ flex:1, height:1, backgroundColor: theme.border }} />
          </View>

          {/* زر إنشاء تذكرة */}
          <TouchableOpacity onPress={() => {
            if (hasOpen) {
              showAlert('⚠️ تذكرة مفتوحة', 'يوجد لديك تذكرة مفتوحة بالفعل.\n\nغير مسموح بفتح أكثر من تذكرة في نفس الوقت.\n\nأغلق تذكرتك الحالية أولاً لفتح تذكرة جديدة.');
              return;
            }
            setView('create');
          }} style={{
            backgroundColor: hasOpen ? '#EEF2F7' : '#0A2463',
            borderRadius:14, paddingVertical:14, alignItems:'center',
            flexDirection:'row', justifyContent:'center', gap:8,
            borderWidth: hasOpen ? 1 : 0, borderColor: theme.border,
          }}>
            <Text style={{ color: hasOpen ? theme.subText : '#fff', fontSize:14, fontWeight:'700' }}>
              {hasOpen ? '🔒 يوجد تذكرة مفتوحة' : '+ إنشاء تذكرة جديدة'}
            </Text>
          </TouchableOpacity>

          {/* قائمة التذاكر */}
          {tickets.length === 0 ? (
            <View style={{ alignItems:'center', paddingVertical:40 }}>
              <Text style={{ fontSize:44, marginBottom:10 }}>🎫</Text>
              <Text style={{ fontSize:13, color: theme.subText, textAlign:'center' }}>
                لا توجد تذاكر دعم بعد
              </Text>
            </View>
          ) : tickets.map(ticket => {
            const si  = STATUS_MAP[ticket.status] || STATUS_MAP.waiting;
            const lm  = ticket.messages?.[ticket.messages.length - 1];
            return (
              <View key={ticket.id} style={{ gap:4 }}>
                <TouchableOpacity onPress={() => { setActiveTicket(ticket); setView('chat'); }}
                  activeOpacity={0.85} style={{
                    backgroundColor: theme.card, borderRadius:16,
                    borderWidth:1.5, borderColor: si.color + '44',
                    overflow:'hidden', elevation:2,
                  }}>
                  <View style={{ height:3, backgroundColor: si.color }} />
                  <View style={{ padding:14 }}>
                    <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                      <View style={{ backgroundColor: si.bg, borderRadius:10, paddingHorizontal:9, paddingVertical:4 }}>
                        <Text style={{ fontSize:10, fontWeight:'700', color: si.color }}>
                          {si.icon} {si.label}
                        </Text>
                      </View>
                      <View style={{ alignItems:'flex-end', flex:1, marginLeft:8 }}>
                        <Text style={{ fontSize:13, fontWeight:'800', color: theme.text }} numberOfLines={1}>
                          {ticket.subject}
                        </Text>
                        <Text style={{ fontSize:10, color: theme.subText, marginTop:2 }}>
                          {ticket.category} • {ticket.date}
                        </Text>
                      </View>
                    </View>
                    {lm && (
                      <View style={{ backgroundColor: theme.bg, borderRadius:10, padding:10, borderWidth:1, borderColor: theme.border }}>
                        <Text style={{ fontSize:11, color: theme.subText, marginBottom:2 }}>
                          {lm.from === 'user' ? 'أنت:' : lm.from === 'support' ? 'الدعم:' : 'تلقائي:'}
                        </Text>
                        <Text style={{ fontSize:12, color: theme.text }} numberOfLines={2}>{lm.text}</Text>
                      </View>
                    )}
                    <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
                      <Text style={{ color:'#0078FF', fontSize:11, fontWeight:'600' }}>عرض المحادثة ›</Text>
                      <Text style={{ fontSize:10, color: theme.subText }}>{ticket.messages?.length || 0} رسالة</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {/* زر الحذف */}
                <TouchableOpacity onPress={() =>
                  showAlert('🗑️ حذف التذكرة', 'هل تريد حذف هذه التذكرة نهائياً؟', [
                    { text:'إلغاء', style:'cancel' },
                    { text:'حذف', style:'destructive', onPress: () => deleteTicket(ticket.id) },
                  ])
                } style={{
                  backgroundColor:'#FFF0F0', borderRadius:10, paddingVertical:8,
                  flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6,
                  borderWidth:1, borderColor:'#FFD0D0',
                }}>
                  <Text style={{ color:'#D32F2F', fontSize:12, fontWeight:'600' }}>🗑️ حذف التذكرة</Text>
                </TouchableOpacity>
              </View>
            );
          })}

        </View>
        <View style={{ height:120 }} />
      </ScrollView>
    </View>
  );
}
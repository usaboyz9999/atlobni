import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export const CARD_W   = (width - 48) / 2;
export const FAB_SIZE   = 62;
export const NAV_H      = 64;
export const NAV_CLEAR  = 120; // clearance for FAB + nav bar
export const SAFE_BOTTOM = 0; // Handled via useSafeAreaInsets in App.js

const s = StyleSheet.create({
  screen:           { flex:1, backgroundColor:'#EEF2F7' },

  // ── Hero ─────────────────────────────────────────────────────
  heroBanner:       { height: 160, justifyContent:'flex-end', marginTop: 0 },
  heroOverlay:      { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(10,36,99,0.35)' },
  heroContent:      { padding:14, paddingBottom:14, paddingTop:0 },
  heroTitle:        { color:'#fff', fontSize:20, fontWeight:'900' },
  heroSub:          { color:'rgba(255,255,255,0.85)', fontSize:12, marginTop:2 },

  // ── Logo row ─────────────────────────────────────────────────
  logoRow:          { flexDirection:'row', alignItems:'center', gap:8, marginBottom:6 },
  logoBox:          { width:32, height:32, borderRadius:9, backgroundColor:'#0078FF', alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:'rgba(255,255,255,0.3)' },
  appNameSm:        { color:'#fff', fontSize:14, fontWeight:'700' },
  appSubSm:         { color:'rgba(255,255,255,0.7)', fontSize:10 },

  // ── Search ───────────────────────────────────────────────────
  searchWrap:       { paddingHorizontal:14, paddingTop:12, paddingBottom:6 },
  searchBox:        { backgroundColor:'#fff', borderRadius:22, paddingHorizontal:14, paddingVertical:10, flexDirection:'row', alignItems:'center', borderWidth:1, borderColor:'#DDE4EF' },

  // ── Stats ────────────────────────────────────────────────────
  statsRow:         { flexDirection:'row', gap:8, paddingHorizontal:14, paddingBottom:6 },
  statCard:         { flex:1, backgroundColor:'#fff', borderRadius:10, padding:10, alignItems:'center', borderWidth:1, borderColor:'#DDE4EF' },
  statVal:          { fontSize:16, fontWeight:'900', color:'#0A2463' },
  statLbl:          { fontSize:10, color:'#6B7C93', marginTop:1 },

  // ── Filter chips ─────────────────────────────────────────────
  filterRow:        { paddingVertical:6 },
  fchip:            { paddingHorizontal:14, paddingVertical:7, borderRadius:18 },
  fchipOn:          { backgroundColor:'#0A2463' },
  fchipOff:         { backgroundColor:'#fff', borderWidth:1, borderColor:'#DDE4EF' },
  fchipTxt:         { fontSize:12, fontWeight:'700' },

  // ── Section head ─────────────────────────────────────────────
  secHead:          { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, paddingTop:10, paddingBottom:5 },
  secHeadTxt:       { fontSize:14, fontWeight:'700', color:'#0A2463' },

  // ── Main cards ───────────────────────────────────────────────
  mainGrid:         { flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:14 },
  mainCard:         { width:CARD_W, backgroundColor:'#fff', borderRadius:16, overflow:'hidden', borderWidth:1, borderColor:'#DDE4EF' },
  cardImg:          { height:90 },
  cardImgOverlay:   { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(10,36,99,0.18)' },
  cardBody:         { padding:10 },
  cardTitle:        { fontSize:12, fontWeight:'700', color:'#0A2463' },
  cardMeta:         { fontSize:10, color:'#6B7C93' },
  metaDot:          { width:4, height:4, borderRadius:2, backgroundColor:'#0078FF' },
  badge:            { alignSelf:'flex-start', borderRadius:8, paddingHorizontal:8, paddingVertical:2, marginTop:4 },
  badgeTxt:         { fontSize:9, fontWeight:'700' },
  chip:             { backgroundColor:'#E6F0FF', borderRadius:8, paddingHorizontal:9, paddingVertical:3 },
  chipTxt:          { fontSize:10, color:'#0043B0', fontWeight:'600' },

  // ── Detail ───────────────────────────────────────────────────
  detailHero:       { height:170, justifyContent:'flex-end' },
  detailContent:    { padding:14 },
  backBtn:          { alignSelf:'flex-start', backgroundColor:'rgba(255,255,255,0.2)', borderRadius:12, paddingHorizontal:12, paddingVertical:6, marginBottom:8 },
  backBtnTxt:       { color:'rgba(255,255,255,0.9)', fontSize:13, fontWeight:'600' },
  detailTitle:      { color:'#fff', fontSize:17, fontWeight:'900' },
  detailSub:        { color:'rgba(255,255,255,0.85)', fontSize:11, marginTop:2 },

  // ── Tabs ─────────────────────────────────────────────────────
  tabItem:          { paddingHorizontal:14, paddingVertical:12, borderBottomWidth:2, borderBottomColor:'transparent' },
  tabItemOn:        { borderBottomColor:'#0078FF' },
  tabTxt:           { fontSize:12, color:'#6B7C93', fontWeight:'600' },
  tabTxtOn:         { color:'#0078FF', fontWeight:'700' },

  // ── Maint cards ──────────────────────────────────────────────
  maintCard:        { backgroundColor:'#fff', borderRadius:14, marginHorizontal:14, marginTop:10, borderWidth:1, borderColor:'#DDE4EF', overflow:'hidden' },
  mcardTop:         { flexDirection:'row', alignItems:'center', gap:10, padding:12 },
  mcardThumb:       { width:48, height:48, borderRadius:12 },
  mcardName:        { fontSize:13, fontWeight:'700', color:'#0A2463' },
  mcardFreq:        { fontSize:10, color:'#6B7C93', marginTop:2 },
  partsArea:        { backgroundColor:'#F5F8FF', borderTopWidth:1, borderTopColor:'#DDE4EF', padding:10 },
  partsLbl:         { fontSize:10, color:'#6B7C93', fontWeight:'700', marginBottom:6 },
  chipsWrap:        { flexDirection:'row', flexWrap:'wrap', gap:4 },
  kpiCard:          { width:(width-52)/2, borderRadius:14, padding:14, borderWidth:1 },
  kpiVal:           { fontSize:20, fontWeight:'900' },
  kpiLbl:           { fontSize:10, fontWeight:'600', marginTop:4, opacity:0.85 },

  // ── Store ────────────────────────────────────────────────────
  storeHero:        { height:150, justifyContent:'flex-end' },
  storeGrid:        { flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:14 },
  storeCard:        { width:CARD_W, backgroundColor:'#fff', borderRadius:16, overflow:'hidden', borderWidth:1, borderColor:'#DDE4EF' },
  storeImg:         { width:'100%', height:95 },
  storeBody:        { padding:10 },
  storeName:        { fontSize:11, fontWeight:'700', color:'#0A2463' },
  storeCode:        { fontSize:9, color:'#6B7C93', marginTop:1 },
  storePrice:       { fontSize:14, fontWeight:'900', color:'#B83200', marginTop:5 },
  addBtn:           { backgroundColor:'#1B4FBF', borderRadius:9, paddingVertical:8, alignItems:'center', marginTop:7 },
  addBtnTxt:        { color:'#fff', fontSize:12, fontWeight:'700' },

  // ── Cart ─────────────────────────────────────────────────────
  cartEmpty:        { flex:1, alignItems:'center', justifyContent:'center', gap:12, padding:30 },
  cartEmptyTxt:     { fontSize:14, color:'#6B7C93', textAlign:'center', lineHeight:22 },
  cartItem:         { backgroundColor:'#fff', borderRadius:14, marginHorizontal:14, marginTop:10, padding:12, flexDirection:'row', alignItems:'center', gap:10, borderWidth:1, borderColor:'#DDE4EF' },
  cartThumb:        { width:56, height:56, borderRadius:12 },
  cartPrice:        { fontSize:14, fontWeight:'900', color:'#B83200' },
  qtyRow:           { flexDirection:'row', alignItems:'center', gap:8, marginTop:6 },
  qtyBtn:           { width:28, height:28, borderRadius:14, backgroundColor:'#E6F0FF', alignItems:'center', justifyContent:'center' },
  qtyBtnTxt:        { color:'#0043B0', fontSize:18, fontWeight:'700', lineHeight:24 },
  qtyVal:           { fontSize:14, fontWeight:'700', color:'#0D1B2A', minWidth:20, textAlign:'center' },
  cartFooter:       { backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#DDE4EF', padding:16 },
  cartTotal:        { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  totalLbl:         { fontSize:14, fontWeight:'700', color:'#0D1B2A' },
  totalVal:         { fontSize:22, fontWeight:'900', color:'#0A2463' },
  orderBtn:         { backgroundColor:'#0A2463', borderRadius:14, paddingVertical:14, alignItems:'center' },
  orderBtnTxt:      { color:'#fff', fontSize:15, fontWeight:'700' },

  // ── Search screen ────────────────────────────────────────────
  searchScreen:     { backgroundColor:'#0A2463', padding:20, paddingBottom:14 },
  searchTitle:      { color:'#fff', fontSize:17, fontWeight:'700', marginBottom:10, textAlign:'right' },
  searchBoxDark:    { backgroundColor:'rgba(255,255,255,0.15)', borderRadius:22, flexDirection:'row', alignItems:'center', paddingVertical:9, paddingHorizontal:14 },
  searchInput:      { flex:1, color:'#fff', fontSize:13, marginRight:6 },
  suggestChip:      { backgroundColor:'#E6F0FF', borderRadius:14, paddingHorizontal:14, paddingVertical:6 },
  suggestTxt:       { color:'#0043B0', fontSize:11, fontWeight:'600' },
  resultRow:        { backgroundColor:'#fff', borderRadius:13, marginHorizontal:14, marginTop:8, padding:13, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderColor:'#DDE4EF' },

  // ── Programs ─────────────────────────────────────────────────
  programsHeader:   { backgroundColor:'#0A2463', padding:20, paddingBottom:16 },
  programsTitle:    { color:'#fff', fontSize:20, fontWeight:'900' },
  programsSub:      { color:'rgba(255,255,255,0.7)', fontSize:12, marginTop:3 },
  programCard:      { backgroundColor:'#fff', marginHorizontal:14, marginTop:10, borderRadius:14, padding:14, flexDirection:'row', alignItems:'center', gap:12, borderWidth:1, borderColor:'#DDE4EF', borderLeftWidth:4 },
  programIconWrap:  { width:52, height:52, borderRadius:14, alignItems:'center', justifyContent:'center' },
  programTitle:     { fontSize:14, fontWeight:'700' },
  programCount:     { fontSize:11, color:'#6B7C93', marginTop:2 },
  tasksContainer:   { marginHorizontal:14, marginTop:0, backgroundColor:'#fff', borderRadius:0, padding:14, borderWidth:1, borderTopWidth:0, borderBottomLeftRadius:14, borderBottomRightRadius:14 },
  tasksSectionTitle:{ fontSize:13, fontWeight:'700', color:'#0A2463', marginBottom:10 },
  taskRow:          { flexDirection:'row', alignItems:'center', gap:10, paddingVertical:8, borderBottomWidth:1, borderBottomColor:'#DDE4EF' },
  taskDot:          { width:7, height:7, borderRadius:4 },
  taskText:         { fontSize:13, color:'#0D1B2A', flex:1, textAlign:'right' },

  // ── Orders ───────────────────────────────────────────────────
  ordersHeader:     { backgroundColor:'#0A2463', padding:20, paddingBottom:16 },
  ordersTitle:      { color:'#fff', fontSize:20, fontWeight:'900' },
  ordersSub:        { color:'rgba(255,255,255,0.7)', fontSize:12, marginTop:3 },
  emptyOrders:      { alignItems:'center', justifyContent:'center', padding:60, gap:14 },
  emptyOrdersTxt:   { fontSize:14, color:'#6B7C93', textAlign:'center', lineHeight:24 },
  orderCard:        { backgroundColor:'#fff', marginHorizontal:14, marginTop:10, borderRadius:14, padding:14, borderWidth:1, borderColor:'#DDE4EF' },
  orderTitle:       { fontSize:14, fontWeight:'700', color:'#0A2463' },
  orderMeta:        { fontSize:11, color:'#6B7C93', marginTop:2 },
  orderDesc:        { fontSize:12, color:'#0D1B2A', lineHeight:18, marginBottom:8, marginTop:4 },
  orderFooter:      { flexDirection:'row', justifyContent:'space-between', borderTopWidth:1, borderTopColor:'#DDE4EF', paddingTop:8 },

  // ── Modal ────────────────────────────────────────────────────
  modalOverlay:     { flex:1, backgroundColor:'rgba(0,0,0,0.55)', justifyContent:'flex-end' },
  modalContainer:   { backgroundColor:'#fff', borderTopLeftRadius:24, borderTopRightRadius:24, maxHeight:'90%' },
  modalHeader:      { backgroundColor:'#0A2463', borderTopLeftRadius:24, borderTopRightRadius:24, padding:18, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  modalTitle:       { color:'#fff', fontSize:17, fontWeight:'700' },
  modalClose:       { width:34, height:34, borderRadius:17, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  modalBody:        { padding:16 },
  fieldLabel:       { fontSize:13, fontWeight:'700', color:'#0A2463', marginBottom:6, marginTop:4 },
  fieldInput:       { backgroundColor:'#EEF2F7', borderRadius:12, paddingHorizontal:14, paddingVertical:11, fontSize:13, color:'#0D1B2A', borderWidth:1, borderColor:'#DDE4EF', marginBottom:4 },
  optChip:          { paddingHorizontal:12, paddingVertical:7, borderRadius:14, backgroundColor:'#fff', borderWidth:1, borderColor:'#DDE4EF' },
  optChipOn:        { backgroundColor:'#0A2463', borderColor:'#0A2463' },
  optChipTxt:       { fontSize:11, fontWeight:'600' },
  prioChip:         { flex:1, paddingVertical:9, borderRadius:10, borderWidth:1.5, alignItems:'center' },
  submitBtn:        { backgroundColor:'#0A2463', borderRadius:14, paddingVertical:15, alignItems:'center', marginTop:10 },
  submitBtnTxt:     { color:'#fff', fontSize:15, fontWeight:'700' },

  // ── Bottom Nav ───────────────────────────────────────────────
  bottomNavWrapper: { position:'relative', backgroundColor:'#fff' },
  bottomNav:        { backgroundColor:'#fff', flexDirection:'row', alignItems:'center', height:NAV_H, borderTopWidth:1, borderTopColor:'#DDE4EF' },
  navItem:          { flex:1, alignItems:'center', justifyContent:'center', gap:2, paddingBottom:4 },
  navFabSlot:       { width:FAB_SIZE+8, flexShrink:0 },
  fabWrap:          { position:'absolute', bottom:NAV_H/2-FAB_SIZE/2, left:0, right:0, alignItems:'center', zIndex:20 },
  fab:              { width:FAB_SIZE, height:FAB_SIZE, borderRadius:FAB_SIZE/2, backgroundColor:'#0078FF', alignItems:'center', justifyContent:'center', borderWidth:3, borderColor:'#fff', elevation:10, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.35, shadowRadius:8 },
  fabPlus:          { color:'#fff', fontSize:26, fontWeight:'900', lineHeight:30 },
  fabLabel:         { color:'#fff', fontSize:8, fontWeight:'700', textAlign:'center', lineHeight:10 },
  navLabel:         { fontSize:10, color:'#6B7C93', fontWeight:'600' },
  navDot:           { width:4, height:4, borderRadius:2, backgroundColor:'#0078FF' },
  cartBadge:        { position:'absolute', top:-3, right:-3, backgroundColor:'#E03000', width:16, height:16, borderRadius:8, alignItems:'center', justifyContent:'center' },

  // ── Toast ────────────────────────────────────────────────────
  toast:            { position:'absolute', bottom:NAV_H+SAFE_BOTTOM+10, alignSelf:'center', backgroundColor:'#0A7A3C', paddingHorizontal:20, paddingVertical:10, borderRadius:22, zIndex:99 },
  toastTxt:         { color:'#fff', fontSize:13, fontWeight:'700' },

  // ── Lang toggle ──────────────────────────────────────────────
  langToggleBtn:    { position:'absolute', top:44, zIndex:999, backgroundColor:'rgba(255,255,255,0.18)', borderRadius:18, paddingHorizontal:12, paddingVertical:5, borderWidth:1, borderColor:'rgba(255,255,255,0.35)' },
  langToggleTxt:    { color:'#fff', fontSize:12, fontWeight:'700' },

  // ── Specialty circles ─────────────────────────────────────────
  specCircleWrap:   { alignItems:'center', gap:8 },
  specCircle:       { width:88, height:88, borderRadius:44, alignItems:'center', justifyContent:'center', borderWidth:2.5, elevation:3 },
  specCircleLabel:  { fontSize:12, fontWeight:'700', textAlign:'center' },

  // ── Program detail cards ──────────────────────────────────────
  progDetailCard:   { backgroundColor:'#fff', borderRadius:14, padding:14, flexDirection:'row', alignItems:'center', gap:12, borderWidth:1.5, marginBottom:0 },
  progDetailIconBox:{ width:54, height:54, borderRadius:14, alignItems:'center', justifyContent:'center' },
  progDetailTitle:  { fontSize:14, fontWeight:'700' },
  progDetailDesc:   { fontSize:11, color:'#6B7C93', marginTop:2 },

  // ── Table ────────────────────────────────────────────────────
  tableContainer:   { backgroundColor:'#fff', borderRadius:0, borderBottomLeftRadius:14, borderBottomRightRadius:14, overflow:'hidden', borderWidth:1, borderTopWidth:0, marginBottom:4 },
  tableHeader:      { flexDirection:'row', paddingVertical:10, paddingHorizontal:10 },
  tableHeaderTxt:   { color:'#fff', fontSize:11, fontWeight:'700', textAlign:'right' },
  tableRow:         { flexDirection:'row', paddingVertical:10, paddingHorizontal:10, borderBottomWidth:1, borderBottomColor:'#EEF2F7', alignItems:'center' },
  tableCellMain:    { fontSize:11, color:'#0D1B2A', textAlign:'right', lineHeight:16 },
  tableCellSub:     { fontSize:10, color:'#6B7C93', textAlign:'center' },
  freqBadge:        { borderRadius:8, paddingHorizontal:6, paddingVertical:2 },
  freqBadgeTxt:     { fontSize:9, fontWeight:'700' },

  // ── SubCat grid ──────────────────────────────────────────────
  subCatGrid:       { flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:14, paddingTop:14 },
  subCatGridCard:   { width:CARD_W, backgroundColor:'#fff', borderRadius:16, overflow:'hidden', borderWidth:1, borderColor:'#DDE4EF' },
  subCatGridImg:    { height:88 },
  subCatGridOverlay:{ ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(10,36,99,0.18)' },
  subCatGridBody:   { padding:10 },
  subCatGridTitle:  { fontSize:12, fontWeight:'700', color:'#0A2463' },
  subCatGridDesc:   { fontSize:10, color:'#6B7C93', flex:1 },
  subItemCard:      { backgroundColor:'#fff', borderRadius:14, overflow:'hidden', borderWidth:1, borderColor:'#DDE4EF' },
  subItemImg:       { height:120 },
  subItemImgOverlay:{ ...StyleSheet.absoluteFillObject, borderTopLeftRadius:14, borderTopRightRadius:14 },
  subItemImgContent:{ padding:12, flexDirection:'row', alignItems:'center', gap:10 },
  subItemIcon:      { fontSize:24 },
  subItemTitle:     { color:'#fff', fontSize:14, fontWeight:'800', flex:1, textAlign:'right' },
  subItemFooter:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:12, borderTopWidth:1 },
  subItemDesc:      { fontSize:11, color:'#6B7C93', flex:1, textAlign:'right', marginRight:8 },

  // ── Profile ──────────────────────────────────────────────────
  profileHero:      { backgroundColor:'#0A2463', alignItems:'center', paddingTop:28, paddingBottom:20, paddingHorizontal:20 },
  profileAvatarWrap:{ position:'relative', marginBottom:12 },
  profileAvatar:    { width:76, height:76, borderRadius:38, backgroundColor:'#0078FF', alignItems:'center', justifyContent:'center', borderWidth:3, borderColor:'rgba(255,255,255,0.35)' },
  profileEditDot:   { position:'absolute', bottom:0, right:0, width:24, height:24, borderRadius:12, backgroundColor:'#0078FF', borderWidth:2, borderColor:'#0A2463', alignItems:'center', justifyContent:'center' },
  profileName:      { color:'#fff', fontSize:18, fontWeight:'900' },
  profileRole:      { color:'rgba(255,255,255,0.7)', fontSize:12, marginTop:3, marginBottom:14 },
  profileStatsRow:  { flexDirection:'row', borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.15)', width:'100%' },
  pStat:            { flex:1, alignItems:'center', paddingVertical:12 },
  pStatVal:         { color:'#fff', fontSize:16, fontWeight:'900' },
  pStatLbl:         { color:'rgba(255,255,255,0.65)', fontSize:10, marginTop:2 },
  profileMenuItem:  { backgroundColor:'#fff', borderRadius:13, padding:13, flexDirection:'row', alignItems:'center', gap:12, borderWidth:1, borderColor:'#DDE4EF' },
  profileMenuIcon:  { width:44, height:44, borderRadius:12, alignItems:'center', justifyContent:'center' },
  profileMenuName:  { fontSize:13, fontWeight:'700', color:'#0A2463' },
  profileMenuDesc:  { fontSize:10, color:'#6B7C93', marginTop:1 },
});

export default s;
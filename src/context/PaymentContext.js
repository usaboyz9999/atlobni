import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayment must be used within a PaymentProvider');
  return context;
};

// ✅ روابط الصور الخاصة بك (تم تنظيف المسافات الزائدة)
export const PAYMENT_METHODS = [
  { 
    id: 'wallet', 
    name: 'المحفظة', 
    iconLib: 'MaterialCommunityIcons', iconName: 'wallet-outline', 
    logoUrl: 'https://png.pngtree.com/element_our/20190528/ourlarge/pngtree-orange-wallet-icon-image_1168655.jpg',
    type: 'instant', desc: 'الدفع من رصيد المحفظة' 
  },
  { 
    id: 'bank', 
    name: 'تحويل بنكي', 
    iconLib: 'FontAwesome5', iconName: 'university', 
    logoUrl: 'https://cdn-icons-png.flaticon.com/256/8176/8176383.png',
    type: 'manual', desc: 'تحويل مباشر للحساب البنكي' 
  },
  { 
    id: 'card', 
    name: 'بطاقة ائتمان', 
    iconLib: 'FontAwesome5', iconName: 'credit-card', 
    logoUrl: 'https://www.pbdesign.co.uk/wp-content/uploads/2024/01/News-Credit-Cards-400-x-301px.png',
    type: 'instant', desc: 'فيزا أو ماستر كارد' 
  },
  { 
    id: 'cod', 
    name: 'الدفع عند الاستلام', 
    iconLib: 'MaterialCommunityIcons', iconName: 'cash-multiple', 
    logoUrl: 'https://marketplace.canva.com/nYdTo/MAHAvgnYdTo/1/tl/canva-cash-on-delivery-3d-icon-MAHAvgnYdTo.png',
    type: 'cash', desc: 'ادفع نقداً عند وصول الطلب' 
  },
  { 
    id: 'applepay', 
    name: 'Apple Pay', 
    iconLib: 'FontAwesome5', iconName: 'apple',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg', 
    type: 'instant', desc: 'دفع سريع وآمن' 
  },
  { 
    id: 'tamara', 
    name: 'تمارا (Tamara)', 
    iconLib: 'Ionicons', iconName: 'color-palette',
    logoUrl: 'https://cdn.salla.sa/BrpXdn/43deb5f3-2fe6-40c1-8c3e-a104ef38ebc5-1000x324.32432432432-7tgZll2LsDefEELBkBAqy5lkipTuI8rAwO2ewzBA.png', 
    type: 'bnpl', desc: 'قسّم مبلغك على 4 دفعات' 
  },
  { 
    id: 'tabby', 
    name: 'تابي (Tabby)', 
    iconLib: 'Ionicons', iconName: 'paw',
    logoUrl: 'https://cdn.salla.sa/mRjq/rLVFGCParjQvmqga8hLSPGwqRMp3YKvFBCYk6XnY.png', 
    type: 'bnpl', desc: 'اشتري الآن وادفع لاحقاً' 
  },
];

export function PaymentProvider({ children }) {
  const { wallet, points } = useAuth();
  
  const [preferredMethodId, setPreferredMethodId] = useState('wallet');
  const [savedCards, setSavedCards] = useState([]);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    cardType: null,
    isSaved: false,
    savedData: null
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '', 
    isSaved: false
  });

  const setPreferredMethod = (methodId) => {
    setPreferredMethodId(methodId);
  };

  const getPreferredMethod = () => {
    return PAYMENT_METHODS.find(m => m.id === preferredMethodId) || PAYMENT_METHODS[0];
  };

  const updateCardDetails = (field, value) => {
    let updatedValue = value;
    let cardType = cardDetails.cardType;

    if (field === 'cardNumber') {
      updatedValue = value.replace(/[^0-9]/g, '').slice(0, 16);
      if (updatedValue.startsWith('4')) cardType = 'visa';
      else if (updatedValue.startsWith('5')) cardType = 'mastercard';
      else cardType = null;
    } 
    else if (field === 'cvv') {
      updatedValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    }
    else if (field === 'expiryDate') {
      let numbers = value.replace(/[^0-9]/g, '');
      if (numbers.length > 2) {
        updatedValue = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
      } else {
        updatedValue = numbers;
      }
      if (updatedValue.length > 5) updatedValue = updatedValue.slice(0, 5);
    }

    setCardDetails(prev => ({ ...prev, [field]: updatedValue, cardType }));
  };

  const updateBankDetails = (field, value) => {
    setBankDetails(prev => ({ ...prev, [field]: value }));
  };

  const saveCard = () => {
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      return { success: false, error: 'يرجى تعبئة جميع بيانات البطاقة' };
    }
    
    const last4 = cardDetails.cardNumber.slice(-4);
    const encryptedNumber = `**** **** **** ${last4}`;
    
    // روابط شعارات البطاقات المضمونة (روابطك المحدثة)
    let brandLogo = '';
    if (cardDetails.cardType === 'visa') brandLogo = 'https://www.globalbrandsmagazine.com/wp-content/uploads/2014/10/visa-1.jpg';
    else if (cardDetails.cardType === 'mastercard') brandLogo = 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
    
    const newCard = {
      id: Date.now().toString(),
      last4: last4,
      brand: cardDetails.cardType || 'Unknown',
      expiry: cardDetails.expiryDate,
      holder: cardDetails.cardHolder,
      encryptedNumber: encryptedNumber,
      brandLogo: brandLogo
    };

    setCardDetails(prev => ({ 
      ...prev, 
      isSaved: true, 
      savedData: newCard 
    }));
    
    return { success: true, card: newCard };
  };

  const saveBankDetails = () => {
    if (!bankDetails.bankName || !bankDetails.accountHolder || !bankDetails.accountNumber) {
      return { success: false, error: 'يرجى تعبئة جميع بيانات البنك' };
    }
    setBankDetails(prev => ({ ...prev, isSaved: true }));
    return { success: true };
  };

  const editCard = () => {
    setCardDetails(prev => ({ ...prev, isSaved: false }));
  };

  const editBank = () => {
    setBankDetails(prev => ({ ...prev, isSaved: false }));
  };

  const value = {
    preferredMethodId,
    paymentMethods: PAYMENT_METHODS,
    savedCards,
    setPreferredMethod,
    getPreferredMethod,
    cardDetails,
    bankDetails,
    updateCardDetails,
    updateBankDetails,
    saveCard,
    saveBankDetails,
    editCard,
    editBank
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}
/**
 * constants.js
 * Central storage for static constants, including medicine logs,
 * Karnataka districts, IDRS question schemas, and localized doctor's notes.
 */

export const KARNATAKA_DISTRICTS = [
  'Bagalkot', 'Bangalore Rural', 'Bangalore Urban', 'Belgaum', 'Bellary',
  'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikmagalur', 'Chitradurga',
  'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Gulbarga',
  'Hassan', 'Haveri', 'Kodagu', 'Kolar', 'Koppal', 'Mandya',
  'Mysore', 'Raichur', 'Ramanagara', 'Shimoga', 'Tumkur',
  'Udupi', 'Uttara Kannada', 'Vijayapura (Bijapur)', 'Yadgir'
];

export const MEDICINE_LIST = [
  { id: 'metformin_500', name: 'Metformin 500mg', defaultDose: '1 tablet daily with dinner', durationDays: 30, stockKey: 'stock_metformin_500' },
  { id: 'amlodipine_5', name: 'Amlodipine 5mg', defaultDose: '1 tablet daily in the morning', durationDays: 30, stockKey: 'stock_amlodipine_5' },
  { id: 'atenolol_50', name: 'Atenolol 50mg', defaultDose: '1 tablet daily', durationDays: 30, stockKey: 'stock_atenolol_50' },
  { id: 'ors_sachet', name: 'ORS Sachet', defaultDose: 'Dissolve in water, as needed for dehydration', durationDays: 0, stockKey: 'stock_ors_sachet' },
  { id: 'iron_tablets', name: 'Iron Tablets', defaultDose: '1 tablet daily after food', durationDays: 30, stockKey: 'stock_iron_tablets' },
  { id: 'folic_acid', name: 'Folic Acid', defaultDose: '1 tablet daily', durationDays: 30, stockKey: 'stock_folic_acid' }
];

export const ADVICE_TEXTS = {
  en: {
    GREEN: {
      title: 'Low Risk',
      explanation: 'Your diabetes and blood pressure screening results are currently normal.',
      phcRequired: false,
      nextCheckupDays: 180,
      actions: [
        'Maintain a balanced diet rich in local vegetables and low in refined sugars.',
        'Continue engaging in daily physical activities like brisk walking or farming for 30+ minutes.',
        'Avoid tobacco and limit alcohol consumption.',
        'Get screened again in 6 months or if you notice any unusual symptoms.',
        'Encourage family members to get screened regularly.'
      ]
    },
    YELLOW: {
      title: 'Moderate Risk',
      explanation: 'Your screening shows borderline indicators. Small changes can prevent progression.',
      phcRequired: true,
      nextCheckupDays: 30,
      actions: [
        'Visit the Primary Health Centre (PHC) for a detailed confirmatory test within a month.',
        'Reduce table salt usage and avoid deep-fried foods.',
        'Increase physical activity to at least 45 minutes daily.',
        'Monitor your blood pressure and weight monthly at the local ASHA sub-centre.',
        'Learn about symptoms of high blood glucose (frequent urination, thirst).'
      ]
    },
    RED: {
      title: 'High Risk — Refer Urgent',
      explanation: 'Alert: High screening indicators or critical blood pressure. Immediate clinical review required.',
      phcRequired: true,
      nextCheckupDays: 7,
      actions: [
        'Visit the nearest PHC or Community Health Centre immediately for medical assessment.',
        'Take all prescribed medications strictly as directed by the doctor.',
        'Rest and avoid heavy stress or extreme physical exertion today.',
        'Monitor blood pressure daily until stabilized by a medical officer.',
        'Coordinate with your ASHA worker for an accompanied visit to the health facility.'
      ]
    }
  },
  kn: {
    GREEN: {
      title: 'ಕಡಿಮೆ ಅಪಾಯ',
      explanation: 'ನಿಮ್ಮ ಮಧುಮೇಹ ಮತ್ತು ರಕ್ತದೊತ್ತಡದ ತಪಾಸಣಾ ಫಲಿತಾಂಶಗಳು ಪ್ರಸ್ತುತ ಸಾಮಾನ್ಯವಾಗಿದೆ.',
      phcRequired: false,
      nextCheckupDays: 180,
      actions: [
        'ಸ್ಥಳೀಯ ತರಕಾರಿಗಳುಳ್ಳ ಸಮತೋಲಿತ ಆಹಾರ ಸೇವಿಸಿ, ಸಕ್ಕರೆಯ ಬಳಕೆ ಕಡಿಮೆ ಮಾಡಿ.',
        'ದಿನಕ್ಕೆ 30 ನಿಮಿಷಗಳ ಕಾಲ ನಡಿಗೆ ಅಥವಾ ಕೃಷಿ ಕೆಲಸಗಳಂತಹ ದೈಹಿಕ ಚಟುವಟಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ.',
        'ಧೂಮಪಾನ ಮತ್ತು ತಂಬಾಕು ಸೇವನೆಯಿಂದ ದೂರವಿರಿ.',
        '6 ತಿಂಗಳ ನಂತರ ಅಥವಾ ಯಾವುದೇ ಅಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದರೆ ಮತ್ತೆ ತಪಾಸಣೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ.',
        'ಕುಟುಂಬದ ಇತರ ಸದಸ್ಯರೂ ನಿಯಮಿತವಾಗಿ ತಪಾಸಣೆ ಮಾಡಿಸಿಕೊಳ್ಳಲು ಪ್ರೇರೇಪಿಸಿ.'
      ]
    },
    YELLOW: {
      title: 'ಮಧ್ಯಮ ಅಪಾಯ',
      explanation: 'ನಿಮ್ಮ ತಪಾಸಣೆಯು ಗಡಿರೇಖೆಯ ಸೂಚಕಗಳನ್ನು ತೋರಿಸುತ್ತದೆ. ಸಣ್ಣ ಬದಲಾವಣೆಗಳು ರೋಗ ಉಲ್ಬಣಿಸುವುದನ್ನು ತಡೆಯಬಹುದು.',
      phcRequired: true,
      nextCheckupDays: 30,
      actions: [
        'ಹೆಚ್ಚಿನ ದೃಢೀಕರಣ ಪರೀಕ್ಷೆಗಳಿಗಾಗಿ ಒಂದು ತಿಂಗಳೊಳಗೆ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ (PHC) ಭೇಟಿ ನೀಡಿ.',
        'ಊಟದಲ್ಲಿ ಉಪ್ಪಿನ ಪ್ರಮಾಣ ಕಡಿಮೆ ಮಾಡಿ ಮತ್ತು ಕರಿದ ಆಹಾರವನ್ನು ತಪ್ಪಿಸಿ.',
        'ದಿನನಿತ್ಯದ ದೈಹಿಕ ಚಟುವಟಿಕೆಯನ್ನು ಕನಿಷ್ಠ 45 ನಿಮಿಷಗಳಿಗೆ ಹೆಚ್ಚಿಸಿ.',
        'ಸ್ಥಳೀಯ ಆಶಾ ಉಪಕೇಂದ್ರದಲ್ಲಿ ಪ್ರತಿ ತಿಂಗಳು ರಕ್ತದೊತ್ತಡ ಮತ್ತು ತೂಕವನ್ನು ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ.',
        'ಅಧಿಕ ರಕ್ತದ ಸಕ್ಕರೆಯ ಲಕ್ಷಣಗಳ ಬಗ್ಗೆ ತಿಳಿದುಕೊಳ್ಳಿ (ಹೆಚ್ಚು ಬಾಯಾರಿಕೆ, ಪದೇ ಪದೇ ಮೂತ್ರ ವಿಸರ್ಜನೆ).'
      ]
    },
    RED: {
      title: 'ಹೆಚ್ಚಿನ ಅಪಾಯ — ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ',
      explanation: 'ಎಚ್ಚರಿಕೆ: ತಪಾಸಣೆಯಲ್ಲಿ ಹೆಚ್ಚಿನ ಮಧುಮೇಹದ ಅಪಾಯ ಅಥವಾ ತೀವ್ರ ರಕ್ತದೊತ್ತಡ ಕಂಡುಬಂದಿದೆ. ತಕ್ಷಣದ ಚಿಕಿತ್ಸೆ ಅಗತ್ಯ.',
      phcRequired: true,
      nextCheckupDays: 7,
      actions: [
        'ತಕ್ಷಣವೇ ಹತ್ತಿರದ ಪಿ.ಎಚ್.ಸಿ (PHC) ಅಥವಾ ಸಮುದಾಯ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',
        'ವೈದ್ಯರು ಸೂಚಿಸಿದ ಔಷಧಿಗಳನ್ನು ತಪ್ಪದೇ ನಿಯಮಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳಿ.',
        'ಇಂದು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ಯಾವುದೇ ಹೆಚ್ಚಿನ ದೈಹಿಕ ಶ್ರಮವನ್ನು ಮಾಡಬೇಡಿ.',
        'ವೈದ್ಯರ ಸಲಹೆಯಂತೆ ಪ್ರತಿದಿನ ರಕ್ತದೊತ್ತಡವನ್ನು ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ.',
        'ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಹೋಗಲು ನಿಮ್ಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯ ಸಹಾಯವನ್ನು ಪಡೆದುಕೊಳ್ಳಿ.'
      ]
    }
  },
  hi: {
    GREEN: {
      title: 'कम जोखिम',
      explanation: 'आपकी मधुमेह और रक्तचाप की जांच के परिणाम वर्तमान में सामान्य हैं।',
      phcRequired: false,
      nextCheckupDays: 180,
      actions: [
        'हरी सब्जियों से भरपूर संतुलित आहार लें और चीनी का सेवन कम करें।',
        'प्रतिदिन कम से कम 30 मिनट तेज चलना या खेती जैसे शारीरिक कार्य जारी रखें।',
        'तंबाकू और धूम्रपान से पूरी तरह बचें।',
        '6 महीने में या कोई भी असामान्य लक्षण दिखने पर दोबारा जांच कराएं।',
        'परिवार के सदस्यों को भी नियमित जांच के लिए प्रेरित करें।'
      ]
    },
    YELLOW: {
      title: 'मध्यम जोखिम',
      explanation: 'आपकी जांच सीमा रेखा के संकेत दिखाती है। छोटे बदलाव बीमारी को रोकने में मदद कर सकते हैं।',
      phcRequired: true,
      nextCheckupDays: 30,
      actions: [
        'विस्तृत जांच के लिए एक महीने के भीतर प्राथमिक स्वास्थ्य केंद्र (PHC) जाएं।',
        'भोजन में नमक की मात्रा कम करें और तले हुए भोजन से बचें।',
        'शारीरिक सक्रियता को बढ़ाकर प्रतिदिन कम से कम 45 मिनट करें।',
        'स्थानीय आशा उप-केंद्र पर हर महीने अपने रक्तचाप और वजन की जांच कराएं।',
        'उच्च रक्त शर्करा (अधिक प्यास, बार-बार पेशाब) के लक्षणों को पहचानें।'
      ]
    },
    RED: {
      title: 'उच्च जोखिम — तत्काल रेफरल करें',
      explanation: 'चेतावनी: जांच में गंभीर संकेत या अत्यधिक रक्तचाप पाया गया है। तत्काल उपचार आवश्यक है।',
      phcRequired: true,
      nextCheckupDays: 7,
      actions: [
        'बिना देरी किए निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) या अस्पताल जाएं।',
        'डॉक्टर द्वारा दी गई सभी दवाओं का कड़ाई से पालन करें।',
        'आज पूर्ण विश्राम करें और किसी भी भारी शारीरिक तनाव से बचें।',
        'ब्लड प्रेशर सामान्य होने तक प्रतिदिन इसकी जांच करवाएं।',
        'अस्पताल जाने के लिए अपनी आशा कार्यकर्ता की सहायता लें।'
      ]
    }
  },
  ta: {
    GREEN: {
      title: 'குறைந்த ஆபத்து',
      explanation: 'உங்களது நீரிழிவு மற்றும் இரத்த அழுத்த பரிசோதனை முடிவுகள் தற்போது சாதாரணமாக உள்ளன.',
      phcRequired: false,
      nextCheckupDays: 180,
      actions: [
        'உள்ளூர் காய்கறிகள் நிறைந்த சமச்சீர் உணவை உட்கொள்ளுங்கள், சர்க்கரையை குறைக்கவும்.',
        'தினமும் 30 நிமிடங்களுக்கு மேல் நடைப்பயிற்சி அல்லது விவசாய வேலைகளில் ஈடுபடுங்கள்.',
        'புகையிலை மற்றும் மது பழக்கத்தை தவிர்க்கவும்.',
        '6 மாதங்களுக்கு ஒருமுறை அல்லது ஏதேனும் அசாதாரண அறிகுறிகள் தோன்றினால் பரிசோதனை செய்யவும்.',
        'குடும்ப உறுப்பினர்களையும் தவறாமல் பரிசோதிக்க ஊக்குவிக்கவும்.'
      ]
    },
    YELLOW: {
      title: 'மிதமான ஆபத்து',
      explanation: 'உங்கள் பரிசோதனை எல்லைக்கோடு அறிகுறிகளைக் காட்டுகிறது. சிறிய மாற்றங்கள் நோய் தீவிரமாவதை தடுக்கும்.',
      phcRequired: true,
      nextCheckupDays: 30,
      actions: [
        'உறுதிப்படுத்தும் விரிவான சோதனைகளுக்கு ஒரு மாதத்திற்குள் ஆரம்ப சுகாதார நிலையத்திற்கு (PHC) செல்லவும்.',
        'உணவில் உப்பை குறைத்து, எண்ணெயில் பொரித்த உணவுகளை தவிர்க்கவும்.',
        'உடற்பயிற்சி அல்லது உடல் உழைப்பை தினமும் 45 நிமிடங்களாக அதிகரிக்கவும்.',
        'உள்ளூர் ஆஷா துணை மையத்தில் மாதந்தோறும் இரத்த அழுத்தம் மற்றும் எடையை கண்காணிக்கவும்.',
        'அதிக சர்க்கரையின் அறிகுறிகளை தெரிந்து கொள்ளவும் (அடிக்கடி தாகம், சிறுநீர் கழித்தல்).'
      ]
    },
    RED: {
      title: 'அதிக ஆபத்து — உடனடியாக மருத்துவரை அணுகவும்',
      explanation: 'எச்சரிக்கை: பரிசோதனையில் அதிக அளவு நீரிழிவு ஆபத்து அல்லது தீவிர இரத்த அழுத்தம் உள்ளது. உடனடி சிகிச்சை தேவை.',
      phcRequired: true,
      nextCheckupDays: 7,
      actions: [
        'உடனடியாக அருகில் உள்ள ஆரம்ப சுகாதார நிலையம் (PHC) அல்லது மருத்துவமனைக்குச் செல்லவும்.',
        'மருத்துவர் பரிந்துரைத்த மருந்துகளை தவறாமல் சரியாக உட்கொள்ளவும்.',
        'இன்று முழு ஓய்வு எடுக்கவும், கடினமான வேலைகளை தவிர்க்கவும்.',
        'இரத்த அழுத்தத்தை தினமும் பரிசோதிக்கவும்.',
        'மருத்துவமனைக்கு செல்ல உங்கள் ஆஷா ஊழியரின் உதவியை நாடவும்.'
      ]
    }
  },
  te: {
    GREEN: {
      title: 'తక్కువ ప్రమాదం',
      explanation: 'మీ మధుమేహం మరియు రక్తపోటు తనిఖీ ఫలితాలు ప్రస్తుతం సాధారణంగా ఉన్నాయి.',
      phcRequired: false,
      nextCheckupDays: 180,
      actions: [
        'స్థానిక కూరగాయలతో కూడిన సమతుల్య ఆహారం తీసుకోండి, చక్కెర తగ్గించండి.',
        'రోజుకు కనీసం 30 నిమిషాలు నడక లేదా వ్యవసాయ పనులు వంటి శారీరక శ్రమ చేయండి.',
        'పొగాకు మరియు మద్యపానానికి దూరంగా ఉండండి.',
        '6 నెలల తర్వాత లేదా ఏదైనా అసాధారణ లక్షణం కనిపిస్తే మళ్లీ పరీక్షించుకోండి.',
        'కుటుంబ సభ్యులను కూడా క్రమం తప్పకుండా పరీక్షించుకోవాలని ప్రోత్సహించండి.'
      ]
    },
    YELLOW: {
      title: 'మధ్యస్థ ప్రమాదం',
      explanation: 'మీ తనిఖీ ఫలితాలు బోర్డర్ లైన్ లో ఉన్నాయి. చిన్న మార్పులతో వ్యాధి రాకుండా నిరోధించవచ్చు.',
      phcRequired: true,
      nextCheckupDays: 30,
      actions: [
        'పూర్తి స్థాయి పరీక్షల కొరకు నెల లోపు ప్రాథమిక ఆరోగ్య కేంద్రానికి (PHC) వెళ్లండి.',
        'ఉప్పు వాడకం తగ్గించండి మరియు నూనె వంటలకు దూరంగా ఉండండి.',
        'శారీరక శ్రమను రోజుకు కనీసం 45 నిమిషాలకు పెంచండి.',
        'స్థానిక ఆశా కేంద్రంలో ప్రతి నెల బరువు మరియు రక్తపోటును తనిఖీ చేయించుకోండి.',
        'అధిక రక్త చక్కెర లక్షణాలను గుర్తించండి (ఎక్కువ దాహం, తరచుగా మూత్ర విసర్జన).'
      ]
    },
    RED: {
      title: 'అధిక ప్రమాదం — వెంటనే రెఫర్ చేయండి',
      explanation: 'హెచ్చరిక: తనిఖీలో తీవ్రమైన మధుమేహ ప్రమాదం లేదా అధిక రక్తపోటు కనుగొనబడింది. వెంటనే చికిత్స అవసరం.',
      phcRequired: true,
      nextCheckupDays: 7,
      actions: [
        'వెంటనే సమీప ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) లేదా ఆసుపత్రికి వెళ్లండి.',
        'వైద్యులు సూచించిన మందులను క్రమం తప్పకుండా వాడండి.',
        'ఈ రోజు పూర్తిగా విశ్రాంతి తీసుకోండి, బరువైన పనులు చేయవద్దు.',
        'రక్తపోటు సాధారణ స్థితికి వచ్చే వరకు ప్రతిరోజూ తనిఖీ చేయించుకోండి.',
        'ఆసుపత్రికి వెళ్లేందుకు మీ ఆశా కార్యకర్త సహాయం తీసుకోండి.'
      ]
    }
  }
};

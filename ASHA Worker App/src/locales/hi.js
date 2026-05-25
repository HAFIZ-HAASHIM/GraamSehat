/**
 * locales/hi.js
 * Hindi (हिन्दी) localization strings.
 */

export default {
  common: {
    appName: 'ग्रामसेहत आशा',
    next: 'आगे बढ़ें',
    back: 'पीछे जाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    edit: 'संशोधन',
    loading: 'लोड हो रहा है...',
    offline: 'ऑफलाइन',
    online: 'ऑनलाइन',
    success: 'सफलता',
    warning: 'चेतावनी',
    error: 'त्रुटि',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    sortBy: 'क्रमबद्ध करें',
    none: 'कोई नहीं',
    submit: 'जमा करें'
  },
  login: {
    title: 'ग्रामसेहत आशा कार्यकर्ता लॉगिन',
    subtitle: 'ऑफलाइन-फर्स्ट डैशबोर्ड तक पहुंचने के लिए अपने क्रेडेंशियल प्रदान करें।',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    loginBtn: 'साइन इन करें',
    persistenceNotice: '30 दिनों के लिए सत्र याद रखा जाएगा।',
    errorUnapproved: 'आपका खाता व्यवस्थापक की मंजूरी के लिए लंबित है।',
    errorRole: 'अनधिकृत। केवल आशा कार्यकर्ता खातों की अनुमति है।'
  },
  home: {
    greeting: 'स्वागत है,',
    syncStatus: 'सिंक स्थिति',
    syncPending: '{count} रिकॉर्ड सिंक होना बाकी',
    syncDone: 'सभी रिकॉर्ड सफलतापूर्वक सिंक हो गए हैं',
    statsHeader: 'स्क्रीनिंग आंकड़े',
    screenedToday: 'आज की स्क्रीनिंग',
    pendingSync: 'लंबित सिंक',
    highRisk: 'उच्च जोखिम',
    scanCardTitle: 'कार्ड स्कैन',
    scanCardDesc: 'मरीज की जांच करें',
    myPatientsTitle: 'मेरे मरीज',
    myPatientsDesc: 'मरीजों की सूची देखें',
    medicineLogTitle: 'दवा लॉग',
    medicineLogDesc: 'दवा वितरण दर्ज करें'
  },
  scan: {
    title: 'मरीज की पहचान करें',
    nfcTitle: 'एनएफसी (NFC) स्कैन',
    nfcDesc: 'मरीज के स्वास्थ्य कार्ड को अपने फोन के पीछे स्पर्श करें',
    qrTitle: 'क्यूआर (QR) कोड स्कैन',
    qrDesc: 'मरीज के स्वास्थ्य कार्ड पर छपे क्यूआर कोड को स्कैन करें',
    manualTitle: 'मैन्युअल प्रविष्टि',
    manualDesc: '6-अंकों का यूआईडी (UID) मैन्युअल रूप से दर्ज करें',
    nfcNotSupported: 'इस डिवाइस पर एनएफसी उपलब्ध नहीं है, इसके बजाय क्यूआर का उपयोग करें',
    checkingNfc: 'एनएफसी सक्रिय है। कार्ड पास लाएं...',
    invalidUid: 'अमान्य यूआईडी। लुह्न चेकसम विफल।',
    notFoundTitle: 'मरीज नहीं मिला',
    notFoundDesc: 'यूआईडी {uid} स्थानीय डेटाबेस या सर्वर में नहीं मिला।',
    registerPrompt: 'क्या आप एक नया मरीज पंजीकृत करना चाहते हैं?',
    registerBtn: 'नया मरीज पंजीकृत करें',
    noCardOption: 'मरीज के पास कार्ड नहीं है',
    enterUidPlaceholder: '6 अंकों का यूआईडी दर्ज करें'
  },
  registration: {
    title: 'नया मरीज पंजीकरण',
    stepPhoto: 'मरीज का फोटो',
    stepPersonal: 'व्यक्तिगत विवरण',
    stepLocation: 'स्थान',
    stepContact: 'संपर्क जानकारी',
    stepAadhaar: 'आधार सत्यापन',
    stepConfirm: 'विवरण की पुष्टि',
    capturePhoto: 'फोटो लें',
    skipPhoto: 'फोटो छोड़ें',
    nameLabel: 'पूरा नाम',
    ageLabel: 'उम्र (वर्ष)',
    genderLabel: 'लिंग',
    bloodGroupLabel: 'रक्त समूह',
    villageLabel: 'गांव का नाम',
    districtLabel: 'जिला',
    householdLabel: 'घर/द्वार संख्या',
    phoneLabel: 'प्राथमिक फोन नंबर',
    altPhoneLabel: 'वैकल्पिक फोन नंबर (वैकल्पिक)',
    linkFamilyLabel: 'पारिवारिक खाते से जोड़ें?',
    familyPhoneLabel: 'परिवार का प्राथमिक फोन नंबर',
    aadhaarLabel: 'आधार संख्या (12 अंक)',
    aadhaarPrivacy: 'आधार को एन्क्रिप्ट करके सुरक्षित रखा जाता है और इसका उपयोग केवल पहचान सत्यापन के लिए किया जाता है।',
    noAadhaarLabel: 'मरीज के पास आधार नहीं है',
    registerBtn: 'मरीज का पंजीकरण करें',
    regSuccess: 'मरीज का पंजीकरण सफलतापूर्वक हो गया!',
    uidDisplay: 'मरीज हेल्थ आईडी:',
    shareBtn: 'व्हाट्सएप के माध्यम से आईडी साझा करें',
    printBtn: 'आईडी कार्ड प्रिंट करें'
  },
  screening: {
    title: 'मधुमेह और बीपी स्क्रीनिंग',
    stepXofY: 'चरण {x} / {y}',
    nextStep: 'अगला चरण',
    prevStep: 'पीछे',
    previewLabel: 'लाइव मूल्यांकन:',
    notAvailable: 'रीडिंग उपलब्ध नहीं है',
    
    // Step 1
    step1Question: 'मरीज की उम्र क्या है?',
    optAge1: '35 वर्ष से कम',
    optAge2: '35 से 49 वर्ष',
    optAge3: '50 वर्ष या उससे अधिक',

    // Step 2
    step2Question: 'कमर की माप क्या है?',
    selectGenderFirst: 'कृपया पहले लिंग का चयन करें',
    optWaistMen1: '80 सेमी से कम',
    optWaistMen2: '80 - 89 सेमी',
    optWaistMen3: '90 सेमी या अधिक',
    optWaistWomen1: '75 सेमी से कम',
    optWaistWomen2: '75 - 84 सेमी',
    optWaistWomen3: '85 सेमी या अधिक',

    // Step 3
    step3Question: 'मरीज दैनिक रूप से कितना सक्रिय है?',
    optActivity1: 'बहुत सक्रिय — खेती/बहुत चलना',
    optActivity2: 'मध्यम सक्रिय — कुछ चलना',
    optActivity3: 'सक्रिय नहीं — ज्यादातर बैठना',

    // Step 4
    step4Question: 'क्या परिवार में किसी को मधुमेह है?',
    optFamily1: 'कोई पारिवारिक इतिहास नहीं',
    optFamily2: 'माता या पिता में से एक को मधुमेह है',
    optFamily3: 'माता और पिता दोनों को मधुमेह है',

    // Step 5
    step5Question: 'रक्तचाप (बीपी) रीडिंग दर्ज करें',
    sysLabel: 'ऊपरी संख्या (सिस्टोलिक)',
    diaLabel: 'निचली संख्या (डायस्टोलिक)',

    // Step 6
    step6Question: 'रक्त शर्करा (ग्लूकोज) रीडिंग दर्ज करें (mg/dL)',
    glucosePlaceholder: 'जैसे 110',

    // Step 7
    step7Question: 'क्या मरीज को इनमें से कोई लक्षण हैं? (सभी लागू चुनें)',
    symptomThirst: 'बार-बार प्यास लगना',
    symptomVision: 'धुंधली दृष्टि',
    symptomNumbness: 'पैरों में सुन्नता',
    symptomUrination: 'बार-बार पेशाब आना',
    symptomTiredness: 'बिना कारण थकान',
    symptomNone: 'उपरोक्त में से कोई नहीं'
  },
  result: {
    title: 'स्क्रीनिंग का परिणाम',
    idrsLabel: 'IDRS स्कोर',
    bpLabel: 'रक्तचाप',
    adviceTitle: 'आशा नैदानिक मार्गदर्शन',
    shareWhatsapp: 'व्हाट्सएप पर साझा करें',
    saveBtn: 'सहेजें और जारी रखें',
    newScreeningBtn: 'नई स्क्रीनिंग'
  },
  patients: {
    title: 'मरीज निर्देशिका',
    lastScreened: 'आखिरी स्क्रीनिंग',
    villageFilter: 'गांव',
    riskFilter: 'जोखिम का स्तर',
    noPatients: 'स्थानीय डेटाबेस में कोई मरीज नहीं मिला।'
  },
  medicine: {
    title: 'दवा वितरण लॉग',
    selectPatient: 'मरीज का चयन करें',
    selectMedicine: 'दवा चुनें',
    quantity: 'वितरित मात्रा',
    stockAlert: 'कम स्टॉक: {name} — केवल {count} बचा है। प्राथमिक स्वास्थ्य केंद्र से अनुरोध करें।',
    loggedSuccess: 'दवा वितरण दर्ज कर लिया गया है।',
    nextDue: 'अगली देय तिथि: {date}'
  }
};

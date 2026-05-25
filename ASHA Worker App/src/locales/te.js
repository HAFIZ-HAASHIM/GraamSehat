/**
 * locales/te.js
 * Telugu (తెలుగు) localization strings.
 */

export default {
  common: {
    appName: 'గ్రామసేహత్ ఆశా',
    next: 'తరువాత',
    back: 'వెనుకకు',
    save: 'సేవ్ చేయి',
    cancel: 'రద్దు చేయి',
    edit: 'సవరించు',
    loading: 'లోడ్ అవుతోంది...',
    offline: 'ఆఫ్‌లైన్',
    online: 'ఆన్‌లైన్',
    success: 'విజయం',
    warning: 'హెచ్చరిక',
    error: 'లోపం',
    search: 'వెతకండి',
    filter: 'వడపోత',
    sortBy: 'క్రమబద్ధీకరించు',
    none: 'ఏదీ లేదు',
    submit: 'సమర్పించు'
  },
  login: {
    title: 'గ్రామసేహత్ ఆశా కార్యకర్త లాగిన్',
    subtitle: 'ఆఫ్‌లైన్ డ్యాష్‌బోర్డును యాక్సెస్ చేయడానికి మీ వివరాలను అందించండి.',
    email: 'ఈమెయిల్ చిరునామా',
    password: 'పాస్‌వర్డ్',
    loginBtn: 'సైన్ ఇన్',
    persistenceNotice: '30 రోజుల పాటు సెషన్ గుర్తుంచుకోబడుతుంది.',
    errorUnapproved: 'మీ ఖాతా నిర్వాహకుడి అనుమతి కోసం వేచి ఉంది.',
    errorRole: 'అనధికృతం. కేవలం ఆశా కార్యకర్త ఖాతాలకు మాత్రమే అనుమతి ఉంది.'
  },
  home: {
    greeting: 'స్వాగతం,',
    syncStatus: 'సింక్ స్థితి',
    syncPending: '{count} రికార్డులు సింక్ కావాల్సి ఉంది',
    syncDone: 'అన్ని రికార్డులు విజయవంతంగా సింక్ అయ్యాయి',
    statsHeader: 'స్క్రీనింగ్ గణాంకాలు',
    screenedToday: 'ఈ రోజు స్క్రీనింగ్ చేసినవి',
    pendingSync: 'సింక్ పెండింగ్',
    highRisk: 'అధిక ప్రమాదం',
    scanCardTitle: 'కార్డు స్కాన్',
    scanCardDesc: 'రోగి స్క్రీనింగ్ చేయండి',
    myPatientsTitle: 'నా రోగులు',
    myPatientsDesc: 'రోగుల వివరాలు చూడండి',
    medicineLogTitle: 'మందుల లాగ్',
    medicineLogDesc: 'మందుల పంపిణీ నమోదు చేయండి'
  },
  scan: {
    title: 'రోగిని గుర్తించండి',
    nfcTitle: 'NFC స్కాన్',
    nfcDesc: 'రోగి ఆరోగ్య కార్డును మీ ఫోన్ వెనుక భాగానికి తాకించండి',
    qrTitle: 'QR కోడ్ స్కాన్',
    qrDesc: 'రోగి ఆరోగ్య కార్డుపై ఉన్న QR కోడ్‌ను స్కాన్ చేయండి',
    manualTitle: 'మాన్యువల్ నమోదు',
    manualDesc: '6 అంకెల UID ని మాన్యువల్ గా నమోదు చేయండి',
    nfcNotSupported: 'ఈ పరికరంలో NFC అందుబాటులో లేదు, బదులుగా QR ని ఉపయోగించండి',
    checkingNfc: 'NFC సక్రియంగా ఉంది. కార్డును దగ్గరకు తీసుకురండి...',
    invalidUid: 'చెల్లని UID. లుహ్న్ చెక్‌సమ్ విఫలమైంది.',
    notFoundTitle: 'రోగి కనుగొనబడలేదు',
    notFoundDesc: 'UID {uid} స్థానిక డేటాబేస్ లో లేదా సర్వర్ లో కనుగొనబడలేదు.',
    registerPrompt: 'మీరు కొత్త రోగిని నమోదు చేయాలనుకుంటున్నారా?',
    registerBtn: 'కొత్త రోగి నమోదు',
    noCardOption: 'రోగి వద్ద కార్డు లేదు',
    enterUidPlaceholder: '6 అంకెల UID ని నమోదు చేయండి'
  },
  registration: {
    title: 'కొత్త రోగి నమోదు',
    stepPhoto: 'రోగి ఫోటో',
    stepPersonal: 'వ్యక్తిగత వివరాలు',
    stepLocation: 'నివాస వివరాలు',
    stepContact: 'సంప్రదింపు సమాచారం',
    stepAadhaar: 'ఆధార్ ధృవీకరణ',
    stepConfirm: 'వివరాల నిర్ధారణ',
    capturePhoto: 'ఫోటో తీయండి',
    skipPhoto: 'ఫోటో అవసరం లేదు',
    nameLabel: 'పూర్తి పేరు',
    ageLabel: 'వయస్సు (సంవత్సరాలు)',
    genderLabel: 'లింగం',
    bloodGroupLabel: 'రక్త గ్రూపు',
    villageLabel: 'గ్రామం పేరు',
    districtLabel: 'జిల్లా',
    householdLabel: 'ఇంటి నంబరు',
    phoneLabel: 'ప్రాథమిక ఫోన్ నంబరు',
    altPhoneLabel: 'ప్రత్యామ్నాయ ఫోన్ నంబరు (ఐచ్ఛికం)',
    linkFamilyLabel: 'కుటుంబ ఖాతాకు లింక్ చేయాలా?',
    familyPhoneLabel: 'కుటుంబ ప్రాథమిక ఫోన్ నంబరు',
    aadhaarLabel: 'ఆధార్ నంబరు (12 అంకెలు)',
    aadhaarPrivacy: 'ఆధార్ భద్రపరచబడింది మరియు గుర్తింపు ధృవీకరణకు మాత్రమే ఉపయోగించబడుతుంది.',
    noAadhaarLabel: 'రోగి వద్ద ఆధార్ కార్డు లేదు',
    registerBtn: 'రోగిని నమోదు చేయి',
    regSuccess: 'రోగి నమోదు విజయవంతమైంది!',
    uidDisplay: 'రోగి హెల్త్ ఐడి:',
    shareBtn: 'వాట్సాప్ ద్వారా ఐడిని షేర్ చేయి',
    printBtn: 'ఐడి కార్డు ప్రింట్ చేయి'
  },
  screening: {
    title: 'మధుమేహం & బీపీ స్క్రీనింగ్',
    stepXofY: 'దశ {x} / {y}',
    nextStep: 'తరువాతి దశ',
    prevStep: 'వెనుకకు',
    previewLabel: 'లైవ్ అంచనా:',
    notAvailable: 'రీడింగ్ అందుబాటులో లేదు',
    
    // Step 1
    step1Question: 'రోగి వయస్సు ఎంత?',
    optAge1: '35 సంవత్సరాల లోపు',
    optAge2: '35 నుండి 49 సంవత్సరాలు',
    optAge3: '50 సంవత్సరాలు లేదా అంతకంటే ఎక్కువ',

    // Step 2
    step2Question: 'నడుము కొలత ఎంత?',
    selectGenderFirst: 'దయచేసి మొదట లింగాన్ని ఎంచుకోండి',
    optWaistMen1: '80 సెం.మీ కంటే తక్కువ',
    optWaistMen2: '80 - 89 సెం.మీ',
    optWaistMen3: '90 సెం.మీ లేదా అంతకంటే ఎక్కువ',
    optWaistWomen1: '75 సెం.మీ కంటే తక్కువ',
    optWaistWomen2: '75 - 84 సెం.మీ',
    optWaistWomen3: '85 సెం.మీ లేదా అంతకంటే ఎక్కువ',

    // Step 3
    step3Question: 'రోగి రోజువారీ శారీరక శ్రమ ఎలా ఉంటుంది?',
    optActivity1: 'చాలా చురుకుగా — వ్యవసాయం/ఎక్కువ నడక',
    optActivity2: 'కొంతవరకు చురుకుగా — కొద్దిగా నడక',
    optActivity3: 'శ్రమ లేదు — ఎక్కువగా కూర్చోవడం',

    // Step 4
    step4Question: 'కుటుంబంలో ఎవరికైనా మధుమేహం ఉందా?',
    optFamily1: 'కుటుంబ చరిత్ర లేదు',
    optFamily2: 'తల్లి లేదా తండ్రిలో ఒకరికి ఉంది',
    optFamily3: 'తల్లి మరియు తండ్రి ఇద్దరికీ ఉంది',

    // Step 5
    step5Question: 'రక్తపోటు (బీపీ) రీడింగ్ నమోదు చేయండి',
    sysLabel: 'పై సంఖ్య (సిస్టాలిక్)',
    diaLabel: 'క్రింది సంఖ్య (డయాస్టాలిక్)',

    // Step 6
    step6Question: 'రక్త చక్కెర (గ్లూకోజ్) రీడింగ్ నమోదు చేయండి (mg/dL)',
    glucosePlaceholder: 'ఉదాహరణకు 110',

    // Step 7
    step7Question: 'రోగికి ఈ లక్షణాలు ఏవైనా ఉన్నాయా? (వర్తించేవన్నీ ఎంచుకోండి)',
    symptomThirst: 'తరచుగా దాహం వేయడం',
    symptomVision: 'మసకబారిన చూపు',
    symptomNumbness: 'పాదాలలో తిమ్మిరి',
    symptomUrination: 'తరచుగా మూత్ర విసర్జన',
    symptomTiredness: 'కారణం లేని అలసట',
    symptomNone: 'పైవేవీ కావు'
  },
  result: {
    title: 'స్క్రీనింగ్ ఫలితం',
    idrsLabel: 'IDRS స్కోరు',
    bpLabel: 'రక్తపోటు',
    adviceTitle: 'ఆశా వైద్య మార్గదర్శకత్వం',
    shareWhatsapp: 'వాట్సాప్ ద్వారా షేర్ చేయి',
    saveBtn: 'సేవ్ చేసి కొనసాగించు',
    newScreeningBtn: 'కొత్త స్క్రీనింగ్'
  },
  patients: {
    title: 'రోగుల జాబితా',
    lastScreened: 'చివరి స్క్రీనింగ్ తేదీ',
    villageFilter: 'గ్రామం',
    riskFilter: 'ప్రమాద స్థాయి',
    noPatients: 'స్థానిక డేటాబేస్ లో రోగులు లేరు.'
  },
  medicine: {
    title: 'మందుల పంపిణీ లాగ్',
    selectPatient: 'రోగిని ఎంచుకోండి',
    selectMedicine: 'మందును ఎంచుకోండి',
    quantity: 'పంపిణీ చేసిన పరిమాణం',
    stockAlert: 'మందులు తక్కువగా ఉన్నాయి: {name} — {count} మాత్రమే మిగిలి ఉన్నాయి. PHC నుండి అభ్యర్థించండి.',
    loggedSuccess: 'మందుల పంపిణీ విజయవంతంగా నమోదైంది.',
    nextDue: 'తదుపరి పంపిణీ తేదీ: {date}'
  }
};

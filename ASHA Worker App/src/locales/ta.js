/**
 * locales/ta.js
 * Tamil (தமிழ்) localization strings.
 */

export default {
  common: {
    appName: 'கிராமசேஹத் ஆஷா',
    next: 'அடுத்து',
    back: 'முன்னால்',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    edit: 'திருத்து',
    loading: 'ஏற்றப்படுகிறது...',
    offline: 'ஆஃப்லைன்',
    online: 'ஆன்லைன்',
    success: 'வெற்றி',
    warning: 'எச்சரிக்கை',
    error: 'பிழை',
    search: 'தேடு',
    filter: 'வடிகட்டி',
    sortBy: 'வரிசைப்படுத்து',
    none: 'எதுவுமில்லை',
    submit: 'சமர்ப்பி'
  },
  login: {
    title: 'கிராமசேஹத் ஆஷா ஊழியர் உள்நுழைவு',
    subtitle: 'ஆஃப்லைன் டாஷ்போர்டை அணுக உங்கள் விவரங்களை வழங்கவும்.',
    email: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    loginBtn: 'உள்நுழைக',
    persistenceNotice: '30 நாட்களுக்கு அமர்வு நினைவில் வைக்கப்படும்.',
    errorUnapproved: 'உங்கள் கணக்கு நிர்வாகியின் ஒப்புதலுக்காக காத்திருக்கிறது.',
    errorRole: 'அங்கீகரிக்கப்படாதது. ஆஷா ஊழியர் கணக்குகளுக்கு மட்டுமே அனுமதி உண்டு.'
  },
  home: {
    greeting: 'வரவேற்கிறோம்,',
    syncStatus: 'ஒத்திசைவு நிலை',
    syncPending: '{count} பதிவுகள் ஒத்திசைக்கப்பட வேண்டும்',
    syncDone: 'அனைத்து பதிவுகளும் வெற்றிகரமாக ஒத்திசைக்கப்பட்டன',
    statsHeader: 'பரிசோதனை அளவீடுகள்',
    screenedToday: 'இன்று பரிசோதிக்கப்பட்டவர்கள்',
    pendingSync: 'ஒத்திசைவு நிலுவையில்',
    highRisk: 'அதிக ஆபத்து',
    scanCardTitle: 'கார்டு ஸ்கேன்',
    scanCardDesc: 'நோயாளி பரிசோதனை',
    myPatientsTitle: 'எனது நோயாளிகள்',
    myPatientsDesc: 'நோயாளிகளின் விவரங்களை காண்க',
    medicineLogTitle: 'மருந்து பதிவு',
    medicineLogDesc: 'மருந்து விநியோகத்தை பதிவு செய்'
  },
  scan: {
    title: 'நோயாளியை அடையாளம் காண்க',
    nfcTitle: 'NFC ஸ்கேன்',
    nfcDesc: 'நோயாளியின் சுகாதார அட்டையை உங்கள் தொலைபேசியின் பின்புறத்தில் தொடவும்',
    qrTitle: 'QR குறியீடு ஸ்கேன்',
    qrDesc: 'நோயாளியின் அட்டையில் உள்ள QR குறியீட்டை ஸ்கேன் செய்யவும்',
    manualTitle: 'கைமுறை உள்ளீடு',
    manualDesc: '6 இலக்க UID-ஐ கைமுறையாக உள்ளிடவும்',
    nfcNotSupported: 'இக்கருவியில் NFC வசதி இல்லை, QR-ஐ பயன்படுத்தவும்',
    checkingNfc: 'NFC செயலில் உள்ளது. அட்டையை அருகில் கொண்டு வரவும்...',
    invalidUid: 'தவறான UID. லூஹ்ன் காசோலை தோல்வியடைந்தது.',
    notFoundTitle: 'நோயாளி கண்டறியப்படவில்லை',
    notFoundDesc: 'UID {uid} உள்ளூர் தரவுத்தளத்திலோ அல்லது சேவையகத்திலோ இல்லை.',
    registerPrompt: 'புதிய நோயாளியைப் பதிவு செய்ய விரும்புகிறீர்களா?',
    registerBtn: 'புதிய நோயாளி பதிவு',
    noCardOption: 'நோயாளியிடம் அட்டை இல்லை',
    enterUidPlaceholder: '6 இலக்க UID உள்ளிடவும்'
  },
  registration: {
    title: 'புதிய நோயாளி பதிவு',
    stepPhoto: 'நோயாளி புகைப்படம்',
    stepPersonal: 'தனிப்பட்ட விவரங்கள்',
    stepLocation: 'இருப்பிடம்',
    stepContact: 'தொடர்பு தகவல்',
    stepAadhaar: 'ஆதார் சரிபார்ப்பு',
    stepConfirm: 'விவரங்களை உறுதிப்படுத்தவும்',
    capturePhoto: 'புகைப்படம் எடு',
    skipPhoto: 'புகைப்படம் வேண்டாம்',
    nameLabel: 'முழு பெயர்',
    ageLabel: 'வயது (ஆண்டுகள்)',
    genderLabel: 'பாலினம்',
    bloodGroupLabel: 'இரத்த வகை',
    villageLabel: 'கிராமத்தின் பெயர்',
    districtLabel: 'மாவட்டம்',
    householdLabel: 'வீட்டு எண் / கதவு எண்',
    phoneLabel: 'முதன்மை தொலைபேசி எண்',
    altPhoneLabel: 'மாற்று தொலைபேசி எண் (விருப்பத்தேர்வு)',
    linkFamilyLabel: 'குடும்ப கணக்குடன் இணைக்கவா?',
    familyPhoneLabel: 'குடும்பத்தின் முதன்மை தொலைபேசி எண்',
    aadhaarLabel: 'ஆதார் எண் (12 இலக்கங்கள்)',
    aadhaarPrivacy: 'ஆதார் எண் குறியாக்கம் செய்யப்பட்டு சேமிக்கப்படுகிறது, அடையாள சரிபார்ப்பிற்கு மட்டுமே பயன்படுத்தப்படும்.',
    noAadhaarLabel: 'நோயாளியிடம் ஆதார் இல்லை',
    registerBtn: 'நோயாளியைப் பதிவு செய்',
    regSuccess: 'நோயாளி வெற்றிகரமாக பதிவு செய்யப்பட்டார்!',
    uidDisplay: 'நோயாளி சுகாதார ஐடி:',
    shareBtn: 'ஐடியை வாட்ஸ்அப் மூலம் பகிரவும்',
    printBtn: 'ஐடி கார்டை அச்சிடவும்'
  },
  screening: {
    title: 'நீரிழிவு & இரத்த அழுத்த பரிசோதனை',
    stepXofY: 'படி {x} / {y}',
    nextStep: 'அடுத்த படி',
    prevStep: 'பின்னால்',
    previewLabel: 'நேரடி மதிப்பீடு:',
    notAvailable: 'அளவீடு கிடைக்கவில்லை',
    
    // Step 1
    step1Question: 'நோயாளியின் வயது என்ன?',
    optAge1: '35 வயதிற்கு உட்பட்டவர்',
    optAge2: '35 முதல் 49 வயது வரை',
    optAge3: '50 வயது அல்லது அதற்கு மேற்பட்டவர்',

    // Step 2
    step2Question: 'இடுப்பு அளவு என்ன?',
    selectGenderFirst: 'தயவுசெய்து முதலில் பாலினத்தை தேர்வு செய்யவும்',
    optWaistMen1: '80 செ.மீ-க்கு குறைவாக',
    optWaistMen2: '80 - 89 செ.மீ',
    optWaistMen3: '90 செ.மீ அல்லது அதற்கு மேல்',
    optWaistWomen1: '75 செ.மீ-க்கு குறைவாக',
    optWaistWomen2: '75 - 84 செ.மீ',
    optWaistWomen3: '85 செ.மீ அல்லது அதற்கு மேல்',

    // Step 3
    step3Question: 'நோயாளி தினமும் எவ்வளவு சுறுசுறுப்பாக இருக்கிறார்?',
    optActivity1: 'மிகவும் சுறுசுறுப்பானவர் — விவசாயம்/அதிக நடைப்பயிற்சி',
    optActivity2: 'ஓரளவு சுறுசுறுப்பானவர் — சில நடைப்பயிற்சி',
    optActivity3: 'சுறுசுறுப்பற்றவர் — பெரும்பாலும் அமர்ந்திருப்பவர்',

    // Step 4
    step4Question: 'குடும்பத்தில் யாருக்காவது நீரிழிவு நோய் உள்ளதா?',
    optFamily1: 'குடும்ப வரலாறு இல்லை',
    optFamily2: 'பெற்றோரில் ஒருவருக்கு நீரிழிவு நோய் உள்ளது',
    optFamily3: 'பெற்றோர் இருவருக்கும் நீரிழிவு நோய் உள்ளது',

    // Step 5
    step5Question: 'இரத்த அழுத்த அளவை உள்ளிடவும்',
    sysLabel: 'மேல் எண் (சிஸ்டாலிக்)',
    diaLabel: 'கீழ் எண் (டயஸ்டாலிக்)',

    // Step 6
    step6Question: 'இரத்த சர்க்கரை அளவை உள்ளிடவும் (mg/dL)',
    glucosePlaceholder: 'உதாரணமாக 110',

    // Step 7
    step7Question: 'நோயாளியிடம் இவற்றில் ஏதேனும் அறிகுறிகள் உள்ளதா? (அனைத்தையும் தேர்ந்தெடு)',
    symptomThirst: 'அடிக்கடி தாகம்',
    symptomVision: 'மங்கலான பார்வை',
    symptomNumbness: 'பாதங்களில் மரத்துப்போதல்',
    symptomUrination: 'அடிக்கடி சிறுநீர் கழித்தல்',
    symptomTiredness: 'காரணமில்லாத சோர்வு',
    symptomNone: 'மேற்கூறிய எதுவும் இல்லை'
  },
  result: {
    title: 'பரிசோதனை முடிவு',
    idrsLabel: 'IDRS மதிப்பெண்',
    bpLabel: 'இரத்த அழுத்தம்',
    adviceTitle: 'ஆஷா மருத்துவ வழிகாட்டுதல்',
    shareWhatsapp: 'வாட்ஸ்அப்பில் பகிரவும்',
    saveBtn: 'சேமித்து தொடரவும்',
    newScreeningBtn: 'புதிய பரிசோதனை'
  },
  patients: {
    title: 'நோயாளிகள் அட்டவணை',
    lastScreened: 'கடைசி பரிசோதனை',
    villageFilter: 'கிராமம்',
    riskFilter: 'ஆபத்து நிலை',
    noPatients: 'உள்ளூர் தரவுத்தளத்தில் நோயாளிகள் யாரும் இல்லை.'
  },
  medicine: {
    title: 'மருந்து விநியோகப் பதிவு',
    selectPatient: 'நோயாளியைத் தேர்வுசெய்',
    selectMedicine: 'மருந்தைத் தேர்வுசெய்',
    quantity: 'விநியோகிக்கப்பட்ட அளவு',
    stockAlert: 'குறைந்த இருப்பு: {name} — {count} மட்டுமே உள்ளது. PHC-யிடம் கோரவும்.',
    loggedSuccess: 'மருந்து விநியோகம் பதிவு செய்யப்பட்டது.',
    nextDue: 'அடுத்த விநியோக தேதி: {date}'
  }
};

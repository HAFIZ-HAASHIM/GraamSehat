/**
 * locales/en.js
 * English localization strings.
 */

export default {
  common: {
    appName: 'GraamSehat ASHA',
    next: 'Next',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    loading: 'Loading...',
    offline: 'Offline',
    online: 'Online',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    search: 'Search',
    filter: 'Filter',
    sortBy: 'Sort By',
    none: 'None',
    submit: 'Submit'
  },
  login: {
    title: 'GraamSehat ASHA Worker Login',
    subtitle: 'Provide your credentials to access the offline-first dashboard.',
    email: 'Email Address',
    password: 'Password',
    loginBtn: 'Sign In',
    persistenceNotice: 'Remembering session for 30 days.',
    errorUnapproved: 'Your account is pending administrator approval.',
    errorRole: 'Unauthorized. Only ASHA Worker accounts are allowed.'
  },
  home: {
    greeting: 'Welcome back,',
    syncStatus: 'Sync Status',
    syncPending: '{count} records pending sync',
    syncDone: 'All records synced successfully',
    statsHeader: 'Screening Metrics',
    screenedToday: 'Screened Today',
    pendingSync: 'Pending Sync',
    highRisk: 'High Risk',
    scanCardTitle: 'SCAN CARD',
    scanCardDesc: 'Screen a patient',
    myPatientsTitle: 'MY PATIENTS',
    myPatientsDesc: 'View your patients',
    medicineLogTitle: 'MEDICINE LOG',
    medicineLogDesc: 'Record medicine'
  },
  scan: {
    title: 'Identify Patient',
    nfcTitle: 'NFC Scan',
    nfcDesc: 'Tap the patient\'s health card to the back of your phone',
    qrTitle: 'QR Code Scan',
    qrDesc: 'Scan the QR code printed on the patient\'s health card',
    manualTitle: 'Manual Entry',
    manualDesc: 'Enter the 6-digit UID manually',
    nfcNotSupported: 'NFC not available on this device, use QR instead',
    checkingNfc: 'NFC active. Bring card close...',
    invalidUid: 'Invalid UID. Luhn checksum check failed.',
    notFoundTitle: 'Patient Not Found',
    notFoundDesc: 'UID {uid} does not exist in local database or server.',
    registerPrompt: 'Would you like to register a new patient?',
    registerBtn: 'Register New Patient',
    noCardOption: 'Patient does not have a card',
    enterUidPlaceholder: 'Enter 6 digit UID'
  },
  registration: {
    title: 'New Patient Registration',
    stepPhoto: 'Patient Photo',
    stepPersonal: 'Personal Details',
    stepLocation: 'Location',
    stepContact: 'Contact Info',
    stepAadhaar: 'Aadhaar Verification',
    stepConfirm: 'Confirm Details',
    capturePhoto: 'Take Photo',
    skipPhoto: 'Skip Photo',
    nameLabel: 'Full Name',
    ageLabel: 'Age (Years)',
    genderLabel: 'Gender',
    bloodGroupLabel: 'Blood Group',
    villageLabel: 'Village Name',
    districtLabel: 'District',
    householdLabel: 'Household / Door Number',
    phoneLabel: 'Primary Phone Number',
    altPhoneLabel: 'Alternate Phone Number (Optional)',
    linkFamilyLabel: 'Link to Family Account?',
    familyPhoneLabel: 'Primary Family Phone Number',
    aadhaarLabel: 'Aadhaar Number (12 Digits)',
    aadhaarPrivacy: 'Aadhaar is stored encrypted and used only for identity verification.',
    noAadhaarLabel: 'Patient does not have Aadhaar',
    registerBtn: 'Register Patient',
    regSuccess: 'Patient registered successfully!',
    uidDisplay: 'Patient Health ID:',
    shareBtn: 'Share ID via WhatsApp',
    printBtn: 'Print ID Card'
  },
  screening: {
    title: 'Diabetes & BP Screening',
    stepXofY: 'Step {x} of {y}',
    nextStep: 'Next Step',
    prevStep: 'Back',
    previewLabel: 'Live Assessment:',
    notAvailable: 'Reading not available',
    
    // Step 1
    step1Question: 'How old is the patient?',
    optAge1: 'Under 35 years',
    optAge2: '35 to 49 years',
    optAge3: '50 years or older',

    // Step 2
    step2Question: 'What is the waist measurement?',
    selectGenderFirst: 'Please select gender first',
    optWaistMen1: 'Under 80 cm',
    optWaistMen2: '80 - 89 cm',
    optWaistMen3: '90 cm or more',
    optWaistWomen1: 'Under 75 cm',
    optWaistWomen2: '75 - 84 cm',
    optWaistWomen3: '85 cm or more',

    // Step 3
    step3Question: 'How active is the patient daily?',
    optActivity1: 'Very active — farms/walks a lot',
    optActivity2: 'Somewhat active — some walking',
    optActivity3: 'Not active — mostly sitting',

    // Step 4
    step4Question: 'Does anyone in the family have diabetes?',
    optFamily1: 'No family history',
    optFamily2: 'One parent has diabetes',
    optFamily3: 'Both parents have diabetes',

    // Step 5
    step5Question: 'Enter blood pressure reading',
    sysLabel: 'Upper Number (Systolic)',
    diaLabel: 'Lower Number (Diastolic)',

    // Step 6
    step6Question: 'Enter blood glucose reading (mg/dL)',
    glucosePlaceholder: 'e.g. 110',

    // Step 7
    step7Question: 'Does the patient have any of these? (Select all)',
    symptomThirst: 'Frequent thirst',
    symptomVision: 'Blurry vision',
    symptomNumbness: 'Numbness in feet',
    symptomUrination: 'Frequent urination',
    symptomTiredness: 'Unexplained tiredness',
    symptomNone: 'None of the above'
  },
  result: {
    title: 'Screening Result',
    idrsLabel: 'IDRS Score',
    bpLabel: 'Blood Pressure',
    adviceTitle: 'ASHA Clinical Guidance',
    shareWhatsapp: 'Share via WhatsApp',
    saveBtn: 'Save and Continue',
    newScreeningBtn: 'New Screening'
  },
  patients: {
    title: 'Patient Directory',
    lastScreened: 'Last Screened',
    villageFilter: 'Village',
    riskFilter: 'Risk Level',
    noPatients: 'No patients found in local database.'
  },
  medicine: {
    title: 'Medicine Distribution Log',
    selectPatient: 'Select Patient',
    selectMedicine: 'Select Medicine',
    quantity: 'Quantity Distributed',
    stockAlert: 'Low stock: {name} — only {count} left. Request from PHC.',
    loggedSuccess: 'Medicine distribution recorded.',
    nextDue: 'Next Due Date: {date}'
  }
};

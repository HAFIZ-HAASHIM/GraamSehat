/**
 * pages/NewRegistration.jsx
 * Patient Registration Wizard.
 * Guides ASHA workers through registering or editing patients with full device-native features:
 * Step 1: Camera photo capture
 * Step 2: Personal info, gender selector, blood group grids
 * Step 3: Location details
 * Step 4: Contact details and family account matching
 * Step 5: Aadhaar privacy protection fields
 * Step 6: Full summaries with edit jumps.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { savePatientLocal, getPatientByUidLocal } from '../db/patients.local';
import { generateNextUID } from '../utils/uidGenerator';
import { KARNATAKA_DISTRICTS } from '../utils/constants';
import { validateName, validatePhone, validateAadhaar } from '../utils/validators';
import { ProgressBar } from '../components/ProgressBar';
import { GameCard } from '../components/GameCard';
import {
  Camera, ArrowLeft, Image, ShieldCheck, Check,
  Trash2, Phone, MapPin, Sparkles, RefreshCw, Printer, AlertTriangle
} from 'lucide-react';

export function NewRegistration() {
  const { t } = useLanguage();
  const { ashaWorkerId } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramUid = searchParams.get('uid');
  const isEditMode = searchParams.get('edit') === 'true';

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(''); // 'male' | 'female' | 'other'
  const [bloodGroup, setBloodGroup] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Bangalore Urban');
  const [household, setHousehold] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [linkFamily, setLinkFamily] = useState(false);
  const [familyPhone, setFamilyPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [noAadhaar, setNoAadhaar] = useState(false);

  // Success screen state
  const [registeredUid, setRegisteredUid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Camera Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  // Pre-load edit details
  useEffect(() => {
    if (isEditMode && paramUid) {
      setIsLoading(true);
      getPatientByUidLocal(paramUid).then((pat) => {
        if (pat) {
          setPhoto(pat.photo || null);
          setName(pat.name || '');
          setAge(pat.age || '');
          setGender(pat.gender || '');
          setBloodGroup(pat.bloodGroup || '');
          setVillage(pat.village || '');
          setDistrict(pat.district || 'Bangalore Urban');
          setHousehold(pat.household || '');
          setPhone(pat.phone || '');
          setAltPhone(pat.altPhone || '');
          setLinkFamily(!!pat.familyPhone);
          setFamilyPhone(pat.familyPhone || '');
          setAadhaar(pat.aadhaarEncrypted || ''); // In real app, decrypted
          setNoAadhaar(!!pat.noAadhaar);
        }
        setIsLoading(false);
      }).catch((err) => {
        console.error('Failed to load patient for editing:', err);
        setIsLoading(false);
      });
    }
  }, [isEditMode, paramUid]);

  // Handle Camera streams
  const startCamera = async () => {
    setValidationError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access failed:', err);
      setValidationError('Cannot open device camera. Make sure permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = 300;
      canvas.height = 300;

      context.drawImage(
        video,
        (video.videoWidth - size) / 2,
        (video.videoHeight - size) / 2,
        size,
        size,
        0,
        0,
        300,
        300
      );

      const base64Img = canvas.toDataURL('image/jpeg', 0.85);
      setPhoto(base64Img);
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [step]);

  // Validation routines per step
  const validateCurrentStep = () => {
    setValidationError(null);
    if (step === 2) {
      if (!validateName(name)) {
        setValidationError('Please enter a valid patient name (letters only).');
        return false;
      }
      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 125) {
        setValidationError('Please enter a valid age.');
        return false;
      }
      if (!gender) {
        setValidationError('Please select a gender.');
        return false;
      }
      if (!bloodGroup) {
        setValidationError('Please select a blood group.');
        return false;
      }
    }
    if (step === 3) {
      if (!village.trim()) {
        setValidationError('Village name cannot be empty.');
        return false;
      }
      if (!district) {
        setValidationError('Please select a district.');
        return false;
      }
      if (!household.trim()) {
        setValidationError('Household number is required.');
        return false;
      }
    }
    if (step === 4) {
      if (!validatePhone(phone)) {
        setValidationError('Enter a valid 10-digit primary mobile number.');
        return false;
      }
      if (altPhone && !validatePhone(altPhone)) {
        setValidationError('Enter a valid 10-digit alternate mobile number.');
        return false;
      }
      if (linkFamily && !validatePhone(familyPhone)) {
        setValidationError('Enter a valid 10-digit family phone number.');
        return false;
      }
    }
    if (step === 5) {
      if (!noAadhaar && !validateAadhaar(aadhaar)) {
        setValidationError('Enter a valid 12-digit Aadhaar number or mark "No Aadhaar".');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Registers the patient
  const handleRegister = async () => {
    setIsLoading(true);
    try {
      let finalUid = isEditMode ? paramUid : generateNextUID();

      const patientPayload = {
        uid: finalUid,
        name: name.trim(),
        age: parseInt(age, 10),
        gender,
        bloodGroup,
        village: village.trim(),
        district,
        household: household.trim(),
        phone: phone.replace(/\D/g, ''),
        altPhone: altPhone.replace(/\D/g, ''),
        familyPhone: linkFamily ? familyPhone.replace(/\D/g, '') : '',
        aadhaarEncrypted: noAadhaar ? '' : aadhaar.replace(/\D/g, ''),
        noAadhaar: !!noAadhaar,
        photo,
        ashaWorkerId: ashaWorkerId || 'offline_dev',
        createdAt: isEditMode ? undefined : new Date().toISOString()
      };

      if (isEditMode) {
        const original = await getPatientByUidLocal(paramUid);
        if (original) {
          patientPayload.id = original.id;
          patientPayload.createdAt = original.createdAt;
          patientPayload.currentRiskLevel = original.currentRiskLevel;
          patientPayload.lastScreenedAt = original.lastScreenedAt;
          patientPayload.nextApptDate = original.nextApptDate;
        }
      }

      await savePatientLocal(patientPayload);
      setRegisteredUid(finalUid);
    } catch (err) {
      console.error('Registration failed:', err);
      setValidationError('Failed to save patient record locally.');
    } finally {
      setIsLoading(false);
    }
  };

  const shareUIDViaWhatsApp = () => {
    const text = `GraamSehat Health Registry: ${name} is registered successfully. Health ID: ${registeredUid}.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Success Screen
  if (registeredUid) {
    return (
      <div className="w-full flex-grow flex flex-col justify-between items-center text-center bg-bg-primary p-6 animate-scale-in overflow-y-auto pb-12">
        <div className="flex-grow flex flex-col justify-center items-center gap-6 max-w-md w-full">

          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-md">
            <Check size={40} className="stroke-[3]" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-green-dark">
              {isEditMode ? 'Profile Updated!' : t('registration.regSuccess')}
            </h2>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-semibold">
              The record is stored locally and will be synchronized when online.
            </p>
          </div>

          {/* Large UID Display Card */}
          <div className="glass-panel bg-white border border-cream-300 p-6 w-full flex flex-col items-center gap-3 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">
              {t('registration.uidDisplay')}
            </span>
            <span className="text-3xl font-black text-green-dark tracking-widest bg-cream-200/50 py-2.5 px-6 rounded-xl border border-cream-300 shadow-inner">
              {registeredUid}
            </span>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-green-primary" />
              <span>UID Generated via Luhn Checksum</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={shareUIDViaWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Phone size={16} fill="white" />
              {t('registration.shareBtn')}
            </button>

            <button
              onClick={() => window.print()}
              className="w-full py-3.5 px-4 rounded-xl bg-white border border-cream-300 text-slate-700 hover:bg-slate-50 font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer size={16} />
              {t('registration.printBtn')}
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate(`/patient/${registeredUid}`)}
          className="w-full max-w-md py-4 bg-green-primary hover:bg-green-dark rounded-xl text-white font-bold text-sm tracking-wide transition-transform active:scale-[0.98] mt-8 cursor-pointer shadow-md"
        >
          Go to Patient Profile
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex flex-col bg-bg-primary overflow-y-auto pb-12 animate-slide-in">

      {/* Wizard Header (Forest Green native band) */}
      <div className="bg-green-primary text-white px-5 py-5 rounded-b-[20px] shadow-md flex flex-col shrink-0">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={step === 1 ? () => navigate('/scan') : handleBack}
              className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-base font-black tracking-wide">
                {isEditMode ? 'Edit Patient Info' : t('registration.title')}
              </h2>
              <span className="text-[10px] text-green-light/80 font-bold uppercase tracking-widest mt-0.5 block">
                Step {step} of {totalSteps}
              </span>
            </div>
          </div>

          <ProgressBar current={step} total={totalSteps} />
        </div>
      </div>

      {/* Main wizard fields with padding wrapper */}
      <div className="px-5 py-6 flex flex-col gap-4 max-w-xl mx-auto w-full flex-grow">

        {/* Validation Error Feedback */}
        {validationError && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs leading-normal font-semibold animate-scale-in">
            <AlertTriangle size={18} className="shrink-0 text-red-500" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Dynamic Screen Content */}
        <div className="py-2">

          {/* STEP 1: Photo Capture */}
          {step === 1 && (
            <div className="flex flex-col gap-5 animate-scale-in">
              <h3 className="text-base font-extrabold text-green-dark mb-1">{t('registration.stepPhoto')}</h3>

              {cameraActive ? (
                <div className="relative w-full aspect-square max-w-[260px] mx-auto rounded-2xl overflow-hidden border border-cream-300 bg-black shadow-lg">
                  <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" playsInline />
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-white hover:bg-slate-200 active:scale-95 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {photo ? (
                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-cream-300 shadow-md bg-white mb-4">
                      <img src={photo} alt="Patient snapshot" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPhoto(null)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-red-400 hover:text-red-300 hover:bg-black/80 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-cream-300 bg-white flex flex-col items-center justify-center text-slate-400 gap-2 mb-4 shadow-inner">
                      <Image size={36} className="opacity-40" />
                      <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">No Photo</span>
                    </div>
                  )}

                  <button
                    onClick={startCamera}
                    className="py-2.5 px-4 rounded-xl bg-green-primary hover:bg-green-dark text-white text-xs font-bold flex items-center gap-2 tracking-wide transition-colors cursor-pointer shadow-sm"
                  >
                    <Camera size={15} />
                    {t('registration.capturePhoto')}
                  </button>
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          )}

          {/* STEP 2: Personal Details */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-scale-in">
              <h3 className="text-base font-extrabold text-green-dark mb-1">{t('registration.stepPersonal')}</h3>

              <div className="flex flex-col gap-1.5">
                <label>{t('registration.nameLabel')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ravi Kumar"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label>{t('registration.ageLabel')}</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="42"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label>{t('registration.genderLabel')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-xl border text-xs font-bold tracking-wide transition-all cursor-pointer ${gender === g
                        ? 'bg-green-primary border-green-primary text-white font-extrabold shadow-sm'
                        : 'bg-white border-cream-300 text-slate-500'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label>{t('registration.bloodGroupLabel')}</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-', 'Unknown'].map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 rounded-lg border text-[10px] font-black transition-all cursor-pointer ${bloodGroup === bg
                        ? 'bg-green-primary border-green-primary text-white'
                        : 'bg-white border-cream-300 text-slate-500'
                        } ${bg === 'Unknown' ? 'col-span-2' : ''}`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {step === 3 && (
            <div className="flex flex-col gap-4 animate-scale-in">
              <h3 className="text-base font-extrabold text-green-dark mb-1">{t('registration.stepLocation')}</h3>

              <div className="flex flex-col gap-1.5">
                <label>{t('registration.villageLabel')}</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Hanchipura"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label>{t('registration.districtLabel')}</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="bg-white border border-cream-300 text-slate-800 font-semibold cursor-pointer"
                >
                  {KARNATAKA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label>{t('registration.householdLabel')}</label>
                <input
                  type="text"
                  value={household}
                  onChange={(e) => setHousehold(e.target.value)}
                  placeholder="Door No 12/A"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Contact details */}
          {step === 4 && (
            <div className="flex flex-col gap-4 animate-scale-in">
              <h3 className="text-base font-extrabold text-green-dark mb-1">{t('registration.stepContact')}</h3>

              <div className="flex flex-col gap-1.5">
                <label>{t('registration.phoneLabel')}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label>{t('registration.altPhoneLabel')}</label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="Alternate phone"
                  maxLength={10}
                />
              </div>

              {/* Link to family toggle */}
              <div className="glass-panel bg-white border border-cream-300 p-4 flex flex-col gap-3 mt-2 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">{t('registration.linkFamilyLabel')}</span>
                  <input
                    type="checkbox"
                    checked={linkFamily}
                    onChange={(e) => setLinkFamily(e.target.checked)}
                    className="w-5 h-5 accent-green-primary rounded cursor-pointer"
                  />
                </div>

                {linkFamily && (
                  <div className="flex flex-col gap-1.5 mt-2 animate-[slideIn_0.2s_ease]">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t('registration.familyPhoneLabel')}</label>
                    <input
                      type="tel"
                      value={familyPhone}
                      onChange={(e) => setFamilyPhone(e.target.value)}
                      placeholder="Primary family mobile number"
                      maxLength={10}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Aadhaar Verification */}
          {step === 5 && (
            <div className="flex flex-col gap-4 animate-scale-in">
              <h3 className="text-base font-extrabold text-green-dark mb-1">{t('registration.stepAadhaar')}</h3>

              <div className="glass-panel bg-green-50 border border-green-200 text-green-800 p-4 flex items-start gap-3 rounded-2xl mb-2">
                <ShieldCheck size={22} className="shrink-0 mt-0.5 text-green-primary" />
                <span className="text-xs leading-normal font-semibold">
                  {t('registration.aadhaarPrivacy')}
                </span>
              </div>

              {!noAadhaar && (
                <div className="flex flex-col gap-1.5 animate-[slideIn_0.2s_ease]">
                  <label>{t('registration.aadhaarLabel')}</label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="e.g. 123456789012"
                    maxLength={12}
                  />
                </div>
              )}

              <div className="flex items-center gap-2.5 mt-4">
                <input
                  type="checkbox"
                  id="no-aadhaar-chk"
                  checked={noAadhaar}
                  onChange={(e) => setNoAadhaar(e.target.checked)}
                  className="w-5 h-5 accent-green-primary rounded cursor-pointer"
                />
                <label htmlFor="no-aadhaar-chk" className="text-xs text-slate-700 font-extrabold uppercase tracking-wide cursor-pointer">
                  {t('registration.noAadhaarLabel')}
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation Summary */}
          {step === 6 && (
            <div className="flex flex-col gap-5 animate-scale-in max-h-[350px] overflow-y-auto pr-1">
              <h3 className="text-base font-extrabold text-green-dark mb-1">{t('registration.stepConfirm')}</h3>

              <div className="glass-panel bg-white border border-cream-300 p-5 flex flex-col gap-4 text-xs rounded-2xl shadow-sm text-slate-800">

                {/* Photo section */}
                <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">Photo</span>
                  <div className="flex items-center gap-3">
                    {photo ? (
                      <img src={photo} alt="Avatar" className="w-9 h-9 rounded-lg object-cover" />
                    ) : (
                      <span className="text-slate-400 italic">No Photo</span>
                    )}
                    <button onClick={() => setStep(1)} className="text-green-primary font-black hover:underline cursor-pointer">Edit</button>
                  </div>
                </div>

                {/* Personal Details Section */}
                <div className="flex flex-col gap-2 border-b border-cream-200 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Personal</span>
                    <button onClick={() => setStep(2)} className="text-green-primary font-black hover:underline cursor-pointer">Edit</button>
                  </div>
                  <div className="flex flex-col gap-1 text-slate-600 font-semibold">
                    <div>Name: <strong className="text-slate-800">{name}</strong></div>
                    <div>Age: <strong className="text-slate-800">{age} Years</strong></div>
                    <div>Gender: <strong className="text-slate-800">{gender}</strong></div>
                    <div>Blood Group: <strong className="text-slate-800">{bloodGroup}</strong></div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="flex flex-col gap-2 border-b border-cream-200 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Location</span>
                    <button onClick={() => setStep(3)} className="text-green-primary font-black hover:underline cursor-pointer">Edit</button>
                  </div>
                  <div className="flex flex-col gap-1 text-slate-600 font-semibold">
                    <div>Village: <strong className="text-slate-800">{village}</strong></div>
                    <div>District: <strong className="text-slate-800">{district}</strong></div>
                    <div>Household No: <strong className="text-slate-800">{household}</strong></div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col gap-2 border-b border-cream-200 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Contact</span>
                    <button onClick={() => setStep(4)} className="text-green-primary font-black hover:underline cursor-pointer">Edit</button>
                  </div>
                  <div className="flex flex-col gap-1 text-slate-600 font-semibold">
                    <div>Primary Phone: <strong className="text-slate-800">{phone}</strong></div>
                    {altPhone && <div>Alternate Phone: <strong className="text-slate-800">{altPhone}</strong></div>}
                    {linkFamily && <div>Family Link Phone: <strong className="text-slate-800">{familyPhone}</strong></div>}
                  </div>
                </div>

                {/* Aadhaar Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Identity</span>
                    <button onClick={() => setStep(5)} className="text-green-primary font-black hover:underline cursor-pointer">Edit</button>
                  </div>
                  <div className="flex flex-col gap-1 text-slate-600 font-semibold">
                    {noAadhaar ? (
                      <span className="text-slate-400 italic">No Aadhaar Provided</span>
                    ) : (
                      <div>Aadhaar: <strong className="text-slate-800">•••• •••• {aadhaar.slice(-4)}</strong></div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* Next/Back Wizard Actions Bar */}
      <div className="px-5 py-4 border-t border-border-color bg-bg-secondary mt-auto shrink-0">
        <div className="max-w-xl mx-auto w-full flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 px-4 bg-white border border-border-color rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-sm transition-colors cursor-pointer"
            >
              {t('screening.prevStep')}
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="flex-2 py-3.5 px-6 bg-green-primary hover:bg-green-dark rounded-xl text-white font-bold text-sm tracking-wide transition-all cursor-pointer shadow-sm active:scale-[0.99]"
            >
              {t('common.next')}
            </button>
          ) : (
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="flex-2 py-3.5 px-6 bg-green-primary hover:bg-green-dark text-white font-bold text-sm tracking-wide rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                isEditMode ? 'Save Profile' : t('registration.registerBtn')
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

export default NewRegistration;

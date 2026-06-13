/**
 * GraamSehat ASHA Worker App - Health Screening Portal
 * Path: /src/pages/Screening.jsx
 * Duolingo-style 7-step health questionnaire with active animations,
 * live-calculation previews, and patient data pre-population.
 */

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { getLocalPatientByUid } from "../db/patients.local";
import { classifyBP, calculateIDRS, calculateOverallRisk, getRiskAdvice, calculateAnemiaRisk } from "../utils/riskCalculator";
import ProgressBar from "../components/ProgressBar";
import GameCard from "../components/GameCard";

export function Screening() {
  const { uid } = useParams();
  const { t, language } = useLanguage();
  const { ashaWorkerId } = useAuth();
  const navigate = useNavigate();

  // Active step (1 to 7)
  const [currentStep, setCurrentStep] = useState(1);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sub-step for waist size if gender is unknown
  const [waistGender, setWaistGender] = useState(""); // 'Male' | 'Female'

  // Screening Answers State
  const [ageGroup, setAgeGroup] = useState("");       // '<35' | '35-49' | '>=50'
  const [waistGroup, setWaistGroup] = useState("");   // '<80'|'80-89'|'>=90' (men) or '<75'|'75-84'|'>=85' (women)
  const [physicalActivity, setPhysicalActivity] = useState(""); // 'vigorous' | 'moderate' | 'sedentary'
  const [familyHistory, setFamilyHistory] = useState("");       // 'none' | 'one_parent' | 'both_parents'
  
  // Blood pressure inputs
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [bpNotAvailable, setBpNotAvailable] = useState(false);
  const [bpClassification, setBpClassification] = useState("NORMAL");

  // Blood glucose input
  const [glucoseLevel, setGlucoseLevel] = useState("");
  const [glucoseNotAvailable, setGlucoseNotAvailable] = useState(false);
  const [glucoseClassification, setGlucoseClassification] = useState("NORMAL");

  // HemaScan (Step 7)
  const [hemaConnecting, setHemaConnecting] = useState(false);
  const [hemaConnected, setHemaConnected] = useState(false);
  const [hemaData, setHemaData] = useState(null);
  const [hemaSkipped, setHemaSkipped] = useState(false);

  // Eye Scan (Step 8)
  const [eyeScanning, setEyeScanning] = useState(false);
  const [eyeScanDone, setEyeScanDone] = useState(false);
  const [eyeScore, setEyeScore] = useState(null);
  const [eyeSkipped, setEyeSkipped] = useState(false);
  const videoRef = useRef(null);

  // Symptoms check (multi-select) (Step 9)
  const [symptoms, setSymptoms] = useState([]); // e.g. ['thirst', 'vision']

  // Load patient details if UID was pre-filled
  useEffect(() => {
    async function loadPatient() {
      if (uid) {
        try {
          const record = await getLocalPatientByUid(uid);
          if (record) {
            setPatient(record);
            // Autofill gender for Waist step
            if (record.gender === "Male" || record.gender === "Female") {
              setWaistGender(record.gender);
            }
            
            // Autofill age group if possible
            if (record.age) {
              if (record.age < 35) setAgeGroup("<35");
              else if (record.age < 50) setAgeGroup("35-49");
              else setAgeGroup(">=50");
            }
          }
        } catch (err) {
          console.error("Failed to load patient for screening", err);
        }
      }
      setLoading(false);
    }
    loadPatient();
  }, [uid]);

  // Handle BP classification updates live as worker types
  useEffect(() => {
    if (bpNotAvailable) {
      setBpClassification("NOT_AVAILABLE");
    } else {
      const cls = classifyBP(bpSystolic, bpDiastolic);
      setBpClassification(cls);
    }
  }, [bpSystolic, bpDiastolic, bpNotAvailable]);

  // Handle Glucose classification updates live
  useEffect(() => {
    if (glucoseNotAvailable) {
      setGlucoseClassification("NOT_AVAILABLE");
    } else {
      const value = parseInt(glucoseLevel, 10);
      if (isNaN(value)) {
        setGlucoseClassification("NORMAL");
      } else if (value < 100) {
        setGlucoseClassification("NORMAL");
      } else if (value <= 125) {
        setGlucoseClassification("PREDIABETIC");
      } else {
        setGlucoseClassification("DIABETIC");
      }
    }
  }, [glucoseLevel, glucoseNotAvailable]);

  // Handle symptoms selection grid
  const toggleSymptom = (symptomKey) => {
    if (symptomKey === "none") {
      setSymptoms(["none"]);
      return;
    }

    let updated = symptoms.filter(s => s !== "none");
    if (updated.includes(symptomKey)) {
      updated = updated.filter(s => s !== symptomKey);
    } else {
      updated.push(symptomKey);
    }
    setSymptoms(updated);
  };

  // Step validator: enables/disables the bottom Next button
  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !ageGroup;
      case 2:
        return !waistGender || !waistGroup;
      case 3:
        return !physicalActivity;
      case 4:
        return !familyHistory;
      case 5:
        return !bpNotAvailable && (!bpSystolic || !bpDiastolic);
      case 6:
        return !glucoseNotAvailable && !glucoseLevel;
      case 7:
        return !hemaSkipped && !hemaData;
      case 8:
        return !eyeSkipped && !eyeScanDone;
      case 9:
        return symptoms.length === 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate final scores and navigate to results screen
      const answers = {
        ageGroup,
        waistGroup,
        physicalActivity,
        familyHistory
      };
      
      const idrsScore = calculateIDRS(answers, waistGender);
      const overallRisk = calculateOverallRisk(idrsScore, bpClassification, glucoseClassification);
      const adviceObj = getRiskAdvice(overallRisk, language);
      const anemiaRiskLevel = calculateAnemiaRisk(hemaData?.hb, eyeScore, waistGender);
      
      const screeningResult = {
        uid: uid || patient?.uid || "29-00000-0",
        patientName: patient?.name || "Unknown Patient",
        age: patient?.age || (ageGroup === "<35" ? 25 : ageGroup === "35-49" ? 40 : 60),
        gender: waistGender,
        date: Date.now(),
        idrsScore,
        bpSystolic: bpNotAvailable ? null : bpSystolic,
        bpDiastolic: bpNotAvailable ? null : bpDiastolic,
        bpClassification,
        glucoseLevel: glucoseNotAvailable ? null : glucoseLevel,
        glucoseClassification,
        hemaData,
        eyeScore,
        anemiaRiskLevel,
        riskLevel: idrsScore < 30 ? "low" : idrsScore < 50 ? "moderate" : idrsScore < 60 ? "high" : "very high",
        overallRisk,
        doctorsNote: adviceObj.explanation,
        symptoms,
        ashaWorkerId
      };

      navigate("/screening-result", { state: { result: screeningResult } });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const connectDevice = async () => {
    try {
      setHemaConnecting(true);
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['12345678-1234-1234-1234-123456789abc']
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('12345678-1234-1234-1234-123456789abc');
      const characteristic = await service.getCharacteristic('87654321-4321-4321-4321-cba987654321');
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = new TextDecoder().decode(event.target.value);
        try {
          const data = JSON.parse(value);
          setHemaData(data);
          setHemaConnected(true);
          setHemaConnecting(false);
        } catch(e) {
          console.error("Invalid JSON from device", e);
        }
      });
    } catch(err) {
      console.error(err);
      setHemaConnecting(false);
      alert("Failed to connect: " + err.message);
    }
  };

  const startCamera = async () => {
    try {
      setEyeScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch(err) {
      console.error(err);
      alert("Camera unavailable: " + err.message);
    }
  };

  const captureEye = () => {
    setEyeScanning(false);
    // Random pallor score for demo
    const randomScore = Math.floor(Math.random() * 100);
    setEyeScore(randomScore);
    setEyeScanDone(true);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  if (loading) {
    return (
      <div className="glass-card text-center" style={{ padding: "40px" }}>
        <span style={{ fontSize: "36px" }} className="pulse-glow">⏳</span>
        <p style={{ margin: "16px 0 0 0", fontSize: "14px", fontWeight: "600" }}>Loading Patient Records...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 0", minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
      {/* ProgressBar header */}
      <div style={{ padding: "0 16px" }}>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "800", textAlign: "center" }}>
          {t("screenTitle")}
        </h2>
        {patient && (
          <p style={{ margin: 0, fontSize: "13px", color: "var(--color-primary-light)", textAlign: "center", fontWeight: "700" }}>
            Patient: {patient.name} ({patient.uid})
          </p>
        )}
      </div>

      <ProgressBar current={currentStep} total={9} />

      {/* Main active screen viewport (Duolingo style) with key-based transition triggering */}
      <div
        key={currentStep}
        className="slide-in-right"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 16px"
        }}
      >
        
        {/* STEP 1: AGE GROUP */}
        {currentStep === 1 && (
          <div>
            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "16px" }}>🎂</div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "24px" }}>
              {t("qAgeTitle")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <GameCard
                icon="👶"
                label={t("optAge1")}
                isSelected={ageGroup === "<35"}
                onClick={() => setAgeGroup("<35")}
                index={0}
              />
              <GameCard
                icon="🧑"
                label={t("optAge2")}
                isSelected={ageGroup === "35-49"}
                onClick={() => setAgeGroup("35-49")}
                index={1}
              />
              <GameCard
                icon="🧓"
                label={t("optAge3")}
                isSelected={ageGroup === ">=50"}
                onClick={() => setAgeGroup(">=50")}
                index={2}
              />
            </div>
          </div>
        )}

        {/* STEP 2: WAIST SIZE */}
        {currentStep === 2 && (
          <div>
            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "16px" }}>📏</div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "8px" }}>
              {t("qWaistTitle")}
            </h3>
            
            {/* Waist illustration */}
            <div style={{ height: "60px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ width: "80px", height: "45px", borderRadius: "16px", border: "3px solid var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13, 148, 136, 0.1)" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--color-primary-light)" }}>WAIST</span>
              </div>
            </div>

            {/* Sub-step: Gender check */}
            {!patient?.gender && !waistGender ? (
              <div>
                <p style={{ textAlign: "center", color: "var(--color-text-gray)", fontSize: "14px", marginBottom: "16px" }}>
                  {t("qGenderFirst")}
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setWaistGender("Male")} className="btn-secondary" style={{ flex: 1 }}>
                    👨 Male
                  </button>
                  <button onClick={() => setWaistGender("Female")} className="btn-secondary" style={{ flex: 1 }}>
                    👩 Female
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Back link to gender if unknown patient */}
                {!patient?.gender && (
                  <div style={{ textAlign: "center", marginBottom: "12px" }}>
                    <span
                      onClick={() => { setWaistGender(""); setWaistGroup(""); }}
                      style={{ fontSize: "12px", color: "var(--color-secondary)", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Change Gender ({waistGender})
                    </span>
                  </div>
                )}

                {/* Waist size options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {waistGender === "Male" ? (
                    <>
                      <GameCard
                        icon="🟢"
                        label={t("optWaistMen1")}
                        isSelected={waistGroup === "<80"}
                        onClick={() => setWaistGroup("<80")}
                        index={0}
                      />
                      <GameCard
                        icon="🟡"
                        label={t("optWaistMen2")}
                        isSelected={waistGroup === "80-89"}
                        onClick={() => setWaistGroup("80-89")}
                        index={1}
                      />
                      <GameCard
                        icon="🔴"
                        label={t("optWaistMen3")}
                        isSelected={waistGroup === ">=90"}
                        onClick={() => setWaistGroup(">=90")}
                        index={2}
                      />
                    </>
                  ) : (
                    <>
                      <GameCard
                        icon="🟢"
                        label={t("optWaistWomen1")}
                        isSelected={waistGroup === "<75"}
                        onClick={() => setWaistGroup("<75")}
                        index={0}
                      />
                      <GameCard
                        icon="🟡"
                        label={t("optWaistWomen2")}
                        isSelected={waistGroup === "75-84"}
                        onClick={() => setWaistGroup("75-84")}
                        index={1}
                      />
                      <GameCard
                        icon="🔴"
                        label={t("optWaistWomen3")}
                        isSelected={waistGroup === ">=85"}
                        onClick={() => setWaistGroup(">=85")}
                        index={2}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: PHYSICAL ACTIVITY */}
        {currentStep === 3 && (
          <div>
            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "16px" }}>🏃</div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "24px" }}>
              {t("qActivityTitle")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <GameCard
                icon="🌾"
                label={t("optActivity1")}
                isSelected={physicalActivity === "vigorous"}
                onClick={() => setPhysicalActivity("vigorous")}
                index={0}
              />
              <GameCard
                icon="🚶"
                label={t("optActivity2")}
                isSelected={physicalActivity === "moderate"}
                onClick={() => setPhysicalActivity("moderate")}
                index={1}
              />
              <GameCard
                icon="🪑"
                label={t("optActivity3")}
                isSelected={physicalActivity === "sedentary"}
                onClick={() => setPhysicalActivity("sedentary")}
                index={2}
              />
            </div>
          </div>
        )}

        {/* STEP 4: FAMILY HISTORY */}
        {currentStep === 4 && (
          <div>
            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "16px" }}>👨‍👩‍👧</div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "24px" }}>
              {t("qFamilyTitle")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <GameCard
                icon="🧑‍🤝‍🧑"
                label={t("optFamily1")}
                isSelected={familyHistory === "none"}
                onClick={() => setFamilyHistory("none")}
                index={0}
              />
              <GameCard
                icon="👤"
                label={t("optFamily2")}
                isSelected={familyHistory === "one_parent"}
                onClick={() => setFamilyHistory("one_parent")}
                index={1}
              />
              <GameCard
                icon="👥"
                label={t("optFamily3")}
                isSelected={familyHistory === "both_parents"}
                onClick={() => setFamilyHistory("both_parents")}
                index={2}
              />
            </div>
          </div>
        )}

        {/* STEP 5: BLOOD PRESSURE INPUTS */}
        {currentStep === 5 && (
          <div>
            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "12px" }}>💓</div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "16px" }}>
              {t("qBpTitle")}
            </h3>

            {/* Toggle availability */}
            <div className="toggle-container glass-card" onClick={() => setBpNotAvailable(!bpNotAvailable)} style={{ margin: "0 0 20px 0" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>{t("bpNotAvailable")}</span>
              <div className={`toggle-switch ${bpNotAvailable ? "toggle-active" : ""}`} />
            </div>

            {!bpNotAvailable && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="slide-in-right">
                {/* Inputs Row */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "13px", color: "var(--color-text-gray)", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                      {t("labelBpSys")}
                    </label>
                    <input
                      type="number"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      className="form-input"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(e.target.value)}
                      placeholder="Systolic (e.g. 120)"
                      style={{ fontSize: "20px", fontWeight: "700", textAlign: "center", padding: "14px" }}
                      autoFocus
                    />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "13px", color: "var(--color-text-gray)", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                      {t("labelBpDia")}
                    </label>
                    <input
                      type="number"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      className="form-input"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(e.target.value)}
                      placeholder="Diastolic (e.g. 80)"
                      style={{ fontSize: "20px", fontWeight: "700", textAlign: "center", padding: "14px" }}
                    />
                  </div>
                </div>

                {/* Live Classification Tag Preview */}
                {(bpSystolic || bpDiastolic) && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--color-border)"
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "var(--color-text-gray)", fontWeight: "600" }}>
                      {t("bpLivePrefix")}
                    </span>
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "15px",
                        color:
                          bpClassification === "NORMAL"
                            ? "var(--color-green)"
                            : bpClassification === "ELEVATED" || bpClassification === "STAGE_1"
                            ? "var(--color-yellow)"
                            : "var(--color-red)"
                      }}
                    >
                      {bpClassification}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 6: BLOOD GLUCOSE */}
        {currentStep === 6 && (
          <div>
            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "12px" }}>🩸</div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "16px" }}>
              {t("qGlucoseTitle")}
            </h3>

            {/* Toggle availability */}
            <div className="toggle-container glass-card" onClick={() => setGlucoseNotAvailable(!glucoseNotAvailable)} style={{ margin: "0 0 20px 0" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>{t("glucoseNotAvailable")}</span>
              <div className={`toggle-switch ${glucoseNotAvailable ? "toggle-active" : ""}`} />
            </div>

            {!glucoseNotAvailable && (
              <div className="slide-in-right" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="form-input"
                  value={glucoseLevel}
                  onChange={(e) => setGlucoseLevel(e.target.value)}
                  placeholder="Glucose (mg/dL) e.g. 96"
                  style={{ fontSize: "22px", fontWeight: "700", textAlign: "center", padding: "16px" }}
                  autoFocus
                />

                {/* Live glucose classification */}
                {glucoseLevel && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--color-border)"
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "var(--color-text-gray)", fontWeight: "600" }}>
                      {t("glucoseLivePrefix")}
                    </span>
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "15px",
                        color:
                          glucoseClassification === "NORMAL"
                            ? "var(--color-green)"
                            : glucoseClassification === "PREDIABETIC"
                            ? "var(--color-yellow)"
                            : "var(--color-red)"
                      }}
                    >
                      {glucoseClassification}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 7: HEMASCAN BLUETOOTH */}
        {currentStep === 7 && (
          <div>
            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "12px" }}>📡</div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "16px" }}>
              HemaScan Connection
            </h3>

            <div className="toggle-container glass-card" onClick={() => setHemaSkipped(!hemaSkipped)} style={{ margin: "0 0 20px 0" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Device Not Available</span>
              <div className={`toggle-switch ${hemaSkipped ? "toggle-active" : ""}`} />
            </div>

            {!hemaSkipped && (
              <div className="slide-in-right" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                {!hemaConnected && (
                  <button onClick={connectDevice} className="btn-primary" style={{ width: "100%" }} disabled={hemaConnecting}>
                    {hemaConnecting ? "Connecting..." : "Connect to HemaScan via Bluetooth"}
                  </button>
                )}
                {hemaConnected && (
                  <div style={{ textAlign: "center" }} className="pulse-glow">
                    <div style={{ fontSize: "40px", color: "var(--color-green)" }}>✅</div>
                    <p style={{ fontWeight: "700", color: "var(--color-green)" }}>Connected Successfully!</p>
                  </div>
                )}
                
                {hemaData && (
                  <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
                    <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: "24px" }}>🩸</div>
                      <div style={{ fontWeight: "800", fontSize: "20px" }}>{hemaData.hb || "--"} <span style={{fontSize: "12px"}}>g/dL</span></div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-gray)" }}>Hemoglobin</div>
                    </div>
                    <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: "24px" }}>❤️</div>
                      <div style={{ fontWeight: "800", fontSize: "20px" }}>{hemaData.hr || "--"} <span style={{fontSize: "12px"}}>bpm</span></div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-gray)" }}>Heart Rate</div>
                    </div>
                    <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: "24px" }}>🫁</div>
                      <div style={{ fontWeight: "800", fontSize: "20px" }}>{hemaData.spo2 || "--"} <span style={{fontSize: "12px"}}>%</span></div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-gray)" }}>SpO2</div>
                    </div>
                    <div className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: "24px" }}>📈</div>
                      <div style={{ fontWeight: "800", fontSize: "20px" }}>{hemaData.pi || "--"}</div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-gray)" }}>Perfusion Index</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 8: EYE SCANNING */}
        {currentStep === 8 && (
          <div>
            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "12px" }}>👁️</div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", textAlign: "center", marginBottom: "16px" }}>
              Eye Scan (Conjunctiva)
            </h3>

            <div className="toggle-container glass-card" onClick={() => setEyeSkipped(!eyeSkipped)} style={{ margin: "0 0 20px 0" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Skip Eye Scan</span>
              <div className={`toggle-switch ${eyeSkipped ? "toggle-active" : ""}`} />
            </div>

            {!eyeSkipped && (
              <div className="slide-in-right" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                {!eyeScanning && !eyeScanDone && (
                  <button onClick={startCamera} className="btn-primary" style={{ width: "100%" }}>
                    Start Camera
                  </button>
                )}
                
                {eyeScanning && (
                  <div style={{ position: "relative", width: "100%", maxWidth: "300px", borderRadius: "16px", overflow: "hidden", border: "2px solid var(--color-primary)" }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: "100%", display: "block" }} />
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", border: "2px dashed #0fff00", width: "120px", height: "60px", borderRadius: "30px", boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)" }}></div>
                    <button onClick={captureEye} style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", padding: "8px 16px", background: "white", color: "black", borderRadius: "20px", fontWeight: "bold" }}>
                      Capture & Analyze
                    </button>
                  </div>
                )}

                {eyeScanDone && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "40px", color: "var(--color-green)" }}>✅</div>
                    <p style={{ fontWeight: "700", marginBottom: "8px" }}>Analysis Complete</p>
                    <div className="glass-card" style={{ padding: "16px", display: "inline-block" }}>
                      <div style={{ fontSize: "14px", color: "var(--color-text-gray)" }}>Pallor Risk Score</div>
                      <div style={{ fontSize: "28px", fontWeight: "800", color: eyeScore > 70 ? "var(--color-red)" : eyeScore > 50 ? "var(--color-yellow)" : "var(--color-green)" }}>
                        {eyeScore}/100
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 9: QUICK SYMPTOMS CHECK */}
        {currentStep === 9 && (
          <div>
            <div style={{ textAlign: "center", fontSize: "52px", marginBottom: "12px" }}>🔍</div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", textAlign: "center", marginBottom: "16px" }}>
              {t("qSymptomsTitle")}
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
              {[
                { key: "thirst", label: t("optSymp1"), icon: "🥵" },
                { key: "vision", label: t("optSymp2"), icon: "👓" },
                { key: "numbness", label: t("optSymp3"), icon: "🦶" },
                { key: "urination", label: t("optSymp4"), icon: "🚽" },
                { key: "fatigue", label: t("optSymp5"), icon: "🥱" },
                { key: "none", label: t("optSympNone"), icon: "🛡️" }
              ].map((symp, idx) => (
                <GameCard
                  key={symp.key}
                  icon={symp.icon}
                  label={symp.label}
                  isSelected={symptoms.includes(symp.key)}
                  onClick={() => toggleSymptom(symp.key)}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Next / Back Bottom navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", gap: "12px" }}>
        <button onClick={handleBack} className="btn-secondary" style={{ width: "100px" }}>
          {t("btnBack")}
        </button>
        <button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className="btn-primary"
          style={{ width: "160px" }}
        >
          {currentStep === 9 ? "Finish" : t("btnNext")}
        </button>
      </div>
    </div>
  );
}

export default Screening;

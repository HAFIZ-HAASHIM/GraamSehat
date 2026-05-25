/**
 * firebase/patients.js
 * Firestore read/write helpers for uploading patient data, screenings, and medicine logs.
 * Falls back to mock resolvers when Firebase is not configured.
 */

import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db, isFirebaseMock } from './config';

/**
 * Uploads a patient record to Firestore patients collection.
 */
export async function uploadPatientRecord(patient) {
  if (isFirebaseMock) {
    console.log('[Mock Firestore] Patient uploaded:', patient.uid);
    return `mock_doc_${patient.uid}`;
  }

  // Sanitized copy for Firestore without local database id
  const { id, ...firestoreData } = patient;
  
  const docRef = doc(db, 'patients', patient.uid);
  await setDoc(docRef, {
    ...firestoreData,
    syncedAt: new Date().toISOString()
  });
  
  return docRef.id;
}

/**
 * Uploads a screening record for a patient to subcollection.
 */
export async function uploadScreeningRecord(uid, screening) {
  if (isFirebaseMock) {
    console.log('[Mock Firestore] Screening uploaded for patient:', uid);
    return `mock_screen_doc_${Date.now()}`;
  }

  const { id, ...firestoreData } = screening;
  
  const screeningsCollection = collection(db, 'patients', uid, 'screenings');
  const docRef = await addDoc(screeningsCollection, {
    ...firestoreData,
    syncedAt: new Date().toISOString()
  });
  
  return docRef.id;
}

/**
 * Uploads a medicine distribution log to subcollection.
 */
export async function uploadMedicineLogRecord(uid, log) {
  if (isFirebaseMock) {
    console.log('[Mock Firestore] Medicine log uploaded for patient:', uid);
    return `mock_med_doc_${Date.now()}`;
  }

  const { id, ...firestoreData } = log;
  
  const medicinesCollection = collection(db, 'patients', uid, 'medicines');
  const docRef = await addDoc(medicinesCollection, {
    ...firestoreData,
    syncedAt: new Date().toISOString()
  });
  
  return docRef.id;
}

/**
 * Fetches a patient record from Firestore by their UID.
 */
export async function fetchPatientFromFirestore(uid) {
  if (isFirebaseMock) {
    console.log('[Mock Firestore] Fetching patient:', uid);
    return null; // Simulate empty Firestore check offline
  }

  const docRef = doc(db, 'patients', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

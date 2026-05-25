/**
 * db/localDB.js
 * Database initialization for Dexie.js (IndexedDB).
 * Stores patients, screening logs, distributed medicines, and the sync queue offline.
 */

import Dexie from 'dexie';

export const db = new Dexie('GraamSehrat_ASHA');

// Define database tables and index fields
db.version(3).stores({
  patients: '++id, &uid, name, age, gender, village, district, phone, bloodGroup, ashaWorkerId, createdAt, syncStatus, firebaseDocId, currentRiskLevel, lastScreenedAt, nextApptDate',
  screenings: '++id, uid, date, idrsScore, bpSystolic, bpDiastolic, glucoseLevel, riskLevel, overallRisk, ashaWorkerId, syncStatus, firebaseDocId',
  medicines: '++id, uid, medicineName, dose, quantity, distributedAt, nextDueDate, ashaWorkerId, syncStatus',
  syncQueue: '++id, table, localId, operation, addedAt, attempts'
});

/**
 * Gets the next patient serial number for UID generation.
 * Increments and returns the next value.
 */
db.getNextSerial = async () => {
  const SERIAL_KEY = 'graamsehat_serial';
  const START_SERIAL = 10000;
  
  let currentSerial = localStorage.getItem(SERIAL_KEY);
  if (!currentSerial) {
    currentSerial = START_SERIAL;
  } else {
    currentSerial = parseInt(currentSerial, 10);
  }
  
  const nextSerial = currentSerial + 1;
  localStorage.setItem(SERIAL_KEY, nextSerial.toString());
  return currentSerial;
};

export default db;

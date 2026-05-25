/**
 * db/patients.local.js
 * Local CRUD operations for the patients database table.
 */

import { db } from './localDB';
import { addToSyncQueue } from './pendingSync.local';

/**
 * Saves or updates a patient record locally and queues it for syncing.
 * @param {Object} patientData - The patient record object
 * @returns {Promise<Object>} The saved patient record
 */
export async function savePatientLocal(patientData) {
  const isUpdate = !!patientData.id;
  const operation = isUpdate ? 'update' : 'create';
  
  const record = {
    ...patientData,
    syncStatus: 'pending',
    updatedAt: new Date().toISOString(),
    createdAt: patientData.createdAt || new Date().toISOString()
  };

  let localId;
  if (isUpdate) {
    localId = patientData.id;
    await db.patients.update(localId, record);
  } else {
    localId = await db.patients.add(record);
    record.id = localId;
  }

  // Queue for syncing
  await addToSyncQueue('patients', localId, operation, record);

  return record;
}

/**
 * Retrieves a patient by their unique 6-digit UID.
 * @param {string} uid - 6-digit UID
 * @returns {Promise<Object|undefined>} Patient object
 */
export async function getPatientByUidLocal(uid) {
  return await db.patients.where('uid').equals(uid).first();
}

/**
 * Retrieves all patients in the local database.
 * @returns {Promise<Array>} List of patients
 */
export async function getAllPatientsLocal() {
  return await db.patients.toArray();
}

/**
 * Marks a patient record as successfully synchronized.
 * @param {number} localId - Dexie internal ID
 * @param {string} firebaseDocId - ID of Firestore document
 */
export async function markPatientSyncedLocal(localId, firebaseDocId) {
  await db.patients.update(localId, {
    syncStatus: 'synced',
    firebaseDocId
  });
}

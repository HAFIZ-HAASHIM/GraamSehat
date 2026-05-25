/**
 * db/screenings.local.js
 * Local CRUD operations for the screenings database table.
 */

import { db } from './localDB';
import { addToSyncQueue } from './pendingSync.local';
import { getPatientByUidLocal } from './patients.local';

/**
 * Saves a patient screening log locally, updates the patient summary, and queues for syncing.
 * @param {Object} screeningData - The screening record object
 * @returns {Promise<Object>} The saved screening record
 */
export async function saveScreeningLocal(screeningData) {
  const record = {
    ...screeningData,
    date: screeningData.date || new Date().toISOString(),
    syncStatus: 'pending'
  };

  const localId = await db.screenings.add(record);
  record.id = localId;

  // Update corresponding patient summary if patient exists in local DB
  const patient = await getPatientByUidLocal(screeningData.uid);
  if (patient) {
    await db.patients.update(patient.id, {
      lastScreenedAt: record.date,
      currentRiskLevel: record.overallRisk
    });
  }

  // Queue for syncing
  await addToSyncQueue('screenings', localId, 'create', record);

  return record;
}

/**
 * Retrieves all screenings conducted for a specific patient UID.
 * @param {string} uid - 6-digit UID
 * @returns {Promise<Array>} List of screenings
 */
export async function getScreeningsByUidLocal(uid) {
  return await db.screenings.where('uid').equals(uid).sortBy('date');
}

/**
 * Marks a screening record as successfully synchronized.
 * @param {number} localId - Dexie internal ID
 * @param {string} firebaseDocId - ID of Firestore document
 */
export async function markScreeningSyncedLocal(localId, firebaseDocId) {
  await db.screenings.update(localId, {
    syncStatus: 'synced',
    firebaseDocId
  });
}

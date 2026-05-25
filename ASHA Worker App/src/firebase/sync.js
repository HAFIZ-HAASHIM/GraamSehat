/**
 * firebase/sync.js
 * Processes the offline sync queue and pushes local records to Firestore.
 */

import { getPendingSyncQueue, removeFromSyncQueue, incrementAttempts } from '../db/pendingSync.local';
import { markPatientSyncedLocal } from '../db/patients.local';
import { markScreeningSyncedLocal } from '../db/screenings.local';
import { markMedicineSyncedLocal } from '../db/medicines.local';
import { uploadPatientRecord, uploadScreeningRecord, uploadMedicineLogRecord } from './patients';

/**
 * Iterates through all queued sync operations and uploads them to Firebase.
 * @returns {Promise<{syncedCount: number, failedCount: number}>} Status summary
 */
export async function syncPendingRecords() {
  const queue = await getPendingSyncQueue();
  let syncedCount = 0;
  let failedCount = 0;

  for (const item of queue) {
    try {
      let docId;
      
      switch (item.table) {
        case 'patients':
          docId = await uploadPatientRecord(item.data);
          await markPatientSyncedLocal(item.localId, docId);
          break;
          
        case 'screenings':
          docId = await uploadScreeningRecord(item.data.uid, item.data);
          await markScreeningSyncedLocal(item.localId, docId);
          break;
          
        case 'medicines':
          await uploadMedicineLogRecord(item.data.uid, item.data);
          await markMedicineSyncedLocal(item.localId);
          break;
          
        default:
          throw new Error(`Unknown table in sync queue: ${item.table}`);
      }

      // If success, remove from queue
      await removeFromSyncQueue(item.id);
      syncedCount++;
    } catch (error) {
      console.error(`Sync failed for item ${item.id} in table ${item.table}:`, error);
      await incrementAttempts(item.id);
      failedCount++;
    }
  }

  return { syncedCount, failedCount };
}

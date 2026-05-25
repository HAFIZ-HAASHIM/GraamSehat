/**
 * db/pendingSync.local.js
 * Local CRUD helper functions for managing the syncQueue table.
 */

import { db } from './localDB';

/**
 * Adds an operation to the local synchronization queue.
 * @param {string} table - The target table ('patients', 'screenings', 'medicines')
 * @param {number} localId - The Dexie auto-incremented ID of the record
 * @param {string} operation - 'create' or 'update'
 * @param {Object} data - The payload to be sent to Firestore
 */
export async function addToSyncQueue(table, localId, operation, data) {
  try {
    // Add to Dexie syncQueue
    await db.syncQueue.add({
      table,
      localId,
      operation,
      data,
      addedAt: new Date().toISOString(),
      attempts: 0
    });
  } catch (error) {
    console.error('Failed to add record to sync queue:', error);
  }
}

/**
 * Retrieves all pending records from the sync queue.
 * @returns {Promise<Array>} List of queue entries
 */
export async function getPendingSyncQueue() {
  return await db.syncQueue.toArray();
}

/**
 * Removes a completed record from the sync queue.
 * @param {number} id - The queue ID to delete
 */
export async function removeFromSyncQueue(id) {
  await db.syncQueue.delete(id);
}

/**
 * Increments the attempts counter for a queue item.
 * @param {number} id - The queue ID to update
 */
export async function incrementAttempts(id) {
  const item = await db.syncQueue.get(id);
  if (item) {
    await db.syncQueue.update(id, { attempts: (item.attempts || 0) + 1 });
  }
}

/**
 * Gets the total number of records pending synchronization.
 * @returns {Promise<number>} Number of pending records
 */
export async function getPendingCount() {
  return await db.syncQueue.count();
}

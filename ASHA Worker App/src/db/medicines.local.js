/**
 * db/medicines.local.js
 * Local CRUD operations for medicine log entries and local stock levels.
 */

import { db } from './localDB';
import { addToSyncQueue } from './pendingSync.local';

/**
 * Saves a medicine log entry locally, updates local stock, and queues for syncing.
 * @param {Object} medicineData - Medicine log payload
 * @returns {Promise<Object>} The saved medicine log record
 */
export async function saveMedicineLogLocal(medicineData) {
  const record = {
    ...medicineData,
    distributedAt: medicineData.distributedAt || new Date().toISOString(),
    syncStatus: 'pending'
  };

  const localId = await db.medicines.add(record);
  record.id = localId;

  // Deduct from local stock
  deductMedicineStock(record.medicineName, record.quantity);

  // Queue for syncing
  await addToSyncQueue('medicines', localId, 'create', record);

  return record;
}

/**
 * Retrieves all medicine logs for a specific patient UID.
 * @param {string} uid - 6-digit UID
 * @returns {Promise<Array>} List of medicine logs
 */
export async function getMedicineLogsByUidLocal(uid) {
  return await db.medicines.where('uid').equals(uid).sortBy('distributedAt');
}

/**
 * Marks a medicine record as successfully synchronized.
 * @param {number} localId - Dexie internal ID
 */
export async function markMedicineSyncedLocal(localId) {
  await db.medicines.update(localId, {
    syncStatus: 'synced'
  });
}

// ═══════════════════════════════════
// LOCAL STOCK MANAGEMENT (localStorage)
// ═══════════════════════════════════

const STOCK_PREFIX = 'graamsehat_stock_';

/**
 * Gets stock quantity for a medicine. Defaults to 50 if uninitialized.
 * @param {string} medicineName - Name of the medicine
 * @returns {number} Current stock level
 */
export function getMedicineStock(medicineName) {
  const key = `${STOCK_PREFIX}${medicineName.replace(/\s+/g, '_')}`;
  const stock = localStorage.getItem(key);
  if (stock === null) {
    // Default initial stock for demo purposes
    localStorage.setItem(key, '50');
    return 50;
  }
  return parseInt(stock, 10);
}

/**
 * Sets stock quantity for a medicine.
 * @param {string} medicineName - Name of the medicine
 * @param {number} quantity - New stock quantity
 */
export function setMedicineStock(medicineName, quantity) {
  const key = `${STOCK_PREFIX}${medicineName.replace(/\s+/g, '_')}`;
  localStorage.setItem(key, Math.max(0, quantity).toString());
}

/**
 * Deducts quantity from medicine stock.
 * @param {string} medicineName - Name of the medicine
 * @param {number} quantity - Quantity to deduct
 */
export function deductMedicineStock(medicineName, quantity) {
  const current = getMedicineStock(medicineName);
  setMedicineStock(medicineName, current - quantity);
}

/**
 * Adds quantity to medicine stock (e.g., when refilled by PHC).
 * @param {string} medicineName - Name of the medicine
 * @param {number} quantity - Quantity to add
 */
export function addMedicineStock(medicineName, quantity) {
  const current = getMedicineStock(medicineName);
  setMedicineStock(medicineName, current + quantity);
}

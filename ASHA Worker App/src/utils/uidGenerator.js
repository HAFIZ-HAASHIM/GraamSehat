/**
 * uidGenerator.js
 * Generates and validates a 6-digit unique identifier for patients.
 * Format: 5-digit sequential serial + 1-digit Luhn checksum.
 * Example: 685586
 */

/**
 * Calculates the Luhn checksum check digit for a 5-digit number string.
 * @param {string} digitsStr - The 5-digit base serial number
 * @returns {number} The check digit (0-9)
 */
export function calculateLuhnChecksum(digitsStr) {
  let totalSum = 0;
  let shouldDouble = true; // Starts doubling from the rightmost digit of the 5-digit prefix

  for (let i = digitsStr.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsStr.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    totalSum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (10 - (totalSum % 10)) % 10;
}

/**
 * Validates whether a 6-digit UID string passes the Luhn checksum.
 * @param {string} uidStr - The 6-digit UID to validate
 * @returns {boolean} True if valid
 */
export function validateLuhn(uidStr) {
  if (!uidStr || typeof uidStr !== 'string') return false;
  
  // Clean input - only allow numbers
  const cleaned = uidStr.replace(/\D/g, '');
  if (cleaned.length !== 6) return false;

  let sum = 0;
  let shouldDouble = false; // The check digit (index 5) is not doubled

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

/**
 * Generates the next sequential 6-digit UID.
 * Increments the serial number stored in localStorage.
 * @returns {string} The generated 6-digit UID
 */
export function generateNextUID() {
  const SERIAL_KEY = 'graamsehat_serial';
  const START_SERIAL = 10000; // 5 digits starting at 10000

  let currentSerial = localStorage.getItem(SERIAL_KEY);
  if (!currentSerial) {
    currentSerial = START_SERIAL;
  } else {
    currentSerial = parseInt(currentSerial, 10);
  }

  const nextSerial = currentSerial + 1;
  localStorage.setItem(SERIAL_KEY, nextSerial.toString());

  const serialStr = currentSerial.toString().padStart(5, '0');
  const checkDigit = calculateLuhnChecksum(serialStr);

  return `${serialStr}${checkDigit}`;
}

/**
 * Peeks at the next UID that will be generated without incrementing the counter.
 * @returns {string} The next 6-digit UID preview
 */
export function peekNextUID() {
  const SERIAL_KEY = 'graamsehat_serial';
  const START_SERIAL = 10000;

  let currentSerial = localStorage.getItem(SERIAL_KEY);
  if (!currentSerial) {
    currentSerial = START_SERIAL;
  } else {
    currentSerial = parseInt(currentSerial, 10);
  }

  const serialStr = currentSerial.toString().padStart(5, '0');
  const checkDigit = calculateLuhnChecksum(serialStr);
  return `${serialStr}${checkDigit}`;
}

/**
 * validators.js
 * Validation helpers for patient registration forms.
 */

/**
 * Validates a person's name
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid (at least 2 letters, spaces allowed)
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  // Name should be at least 2 characters, letters and spaces only
  return trimmed.length >= 2 && /^[a-zA-Z\s.]+$/.test(trimmed);
}

/**
 * Validates a 10-digit Indian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Validates an alternate phone number (optional)
 * @param {string} phone - Alternate phone to validate
 * @returns {boolean} True if valid or empty
 */
export function validateAlternatePhone(phone) {
  if (!phone) return true; // Optional field
  return validatePhone(phone);
}

/**
 * Validates a 12-digit Aadhaar number
 * @param {string} aadhaar - Aadhaar number to validate
 * @returns {boolean} True if valid
 */
export function validateAadhaar(aadhaar) {
  if (!aadhaar || typeof aadhaar !== 'string') return false;
  const cleaned = aadhaar.replace(/\D/g, '');
  return cleaned.length === 12;
}

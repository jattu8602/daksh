import QRCode from 'qrcode';

/**
 * Generate a QR code from provided data
 * @param {object|string} data - Data to encode in the QR code
 * @returns {Promise<string>} Base64 encoded QR code image
 */
export async function generateQRCode(data) {
  try {
    // Convert data to string if it's an object
    const dataString = typeof data === 'object' ? JSON.stringify(data) : data;

    // Generate QR code
    const dataUrl = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 200,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate a username based on name, class and school
 * @param {string} name - The user's name
 * @param {string} className - The class name
 * @param {string} schoolCode - The school code
 * @returns {string} - A generated username
 */
export function generateUsername(name, className, schoolCode) {
  // Remove spaces and special characters
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Generate a username based on name, class, and school code
  const username = `${cleanName}_${className.toLowerCase()}_${schoolCode.toLowerCase()}`;

  return username;
}

/**
 * Generate a random password of specified length
 * @param {number} length - The length of the password
 * @returns {string} - A random password
 */
export function generatePassword(length = 8) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
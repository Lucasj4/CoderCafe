import crypto from 'crypto';

export const generateRandomCode = (lenght) => {
    return crypto.randomBytes(length).toString('hex');
}
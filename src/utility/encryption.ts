import crypto from 'crypto';


// Defining algorithm
const algorithm = 'aes-256-cbc';
  
// Defining key
const key = crypto.randomBytes(32);
  
// Defining iv
const iv = crypto.randomBytes(16);

export interface CipherResult{
    iv: string; encryptedData: string; key: string;
}
  
// An encrypt function
export function encrypt(text: string): CipherResult {
  
    // Creating Cipheriv with its parameter
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    
    // Updating text
    let encrypted = cipher.update(text);
    
    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Returning iv and encrypted data
    return { 
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        key: key.toString('hex')
    };
}
  
// A decrypt function
export function decrypt(text: CipherResult) {
  
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let k = Buffer.from(text.key, 'hex');
  
    // Creating Decipher
    let decipher = crypto.createDecipheriv(
            'aes-256-cbc', Buffer.from(k), iv);
    
    // Updating encrypted text
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    // returns data after decryption
    return decrypted.toString();
}
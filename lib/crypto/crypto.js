import {Buffer} from 'safe-buffer'
import CryptoJs from 'crypto-js'
import lemoUtils from 'lemo-utils'

/**
 * sha3
 * @param {string} value
 * @param {string} salt
 * @return {string}
 */
export function hashWithSalt(value, salt) {
    return lemoUtils.sha3(Buffer.from(salt + value)).toString('hex')
}

/**
 * Encrypt with AES algorithm
 * @param {string} message
 * @param {string} key
 * @return {string} Base64
 */
export function aesEncrypt(message, key) {
    return CryptoJs.AES.encrypt(message, key).toString();
}

/**
 * Decrypt with AES algorithm
 * @param {string} cipherText
 * @param {string} key
 * @return {string} Base64
 */
export function aesDecrypt(cipherText, key) {
    return CryptoJs.AES.decrypt(cipherText, key).toString(CryptoJs.enc.Utf8)
}

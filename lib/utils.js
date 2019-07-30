import {SALT_PASSWORD, PASSWORD_HASH, SALT_PRIV} from './const'

const CryptoJs = require('crypto-js')

/**
 * encrypt the password with the password 对密码进行加密
 * @param {string} password The user's payment password
 * @return {string}
 */
export function initPassword(password) {
    return CryptoJs.AES.encrypt(SALT_PASSWORD, password)
}
/**
 * encrypt the privateKey with the password 对私钥进行加密
 * @param {string} priv privateKey
 * @return {string}
 */
export function initPrivate(priv) {
    return CryptoJs.AES.encrypt(SALT_PRIV, priv)
}
/**
 * Decrypt the privateKey with the password 对私钥进行解密
 * @param {string} encodePriv The user's payment password
 * @return {string}
 */
export function dncodePrivate(encodePriv) {
    const bytes = CryptoJs.AES.decrypt(encodePriv.toString(), SALT_PRIV)
    return bytes.toString()
}
/**
 * verify password 校验密码
 * @param {string} password
 * @return {boolean}
 */
export function verifyPassword(password) {
    const pwdHash = this.storage.getItem(PASSWORD_HASH)
    return initPassword(password) === pwdHash
}

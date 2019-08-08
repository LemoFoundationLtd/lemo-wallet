import {aesDecrypt, aesEncrypt, hashWithSalt} from '../crypto/crypto';
import {SALT_PRIV} from '../const';
import errors from '../errors';


/**
 * Build and encode account information
 * @param {object} info
 * @param {string} info.privKey
 * @param {string, optional} info.mnemonic
 * @param {string} password
 * @return {object}
 */
export function encodeAccount(info, password) {
    return {
        ...info,
        privKey: encodePrivate(info.privKey, password),
        mnemonic: info.mnemonic && encodeMnemonic(info.mnemonic, password),
    }
}

/**
 * Decode the fields in account
 * @param {object} info account information or password
 * @param {string} info.privKey
 * @param {string, optional} info.mnemonic
 * @param {string} password
 * @return {object}
 */
export function decodeAccount(info, password) {
    return {
        // copy 'info' to avoid modification of the fields in storage through 'info'
        ...info,
        privKey: decodePrivate(info.privKey, password),
        mnemonic: info.mnemonic && decodeMnemonic(info.mnemonic, password),
    }
}

/**
 * encrypt the privateKey with the password 对私钥进行加密
 * @param {string} priv privateKey
 * @param {string} password password
 * @return {string}
 */
function encodePrivate(priv, password) {
    const pwdHash = hashWithSalt(password, SALT_PRIV)
    return aesEncrypt(priv, pwdHash)
}

/**
 * Decrypt the privateKey with the password 对私钥进行解密
 * @param {string} encodedPriv The user's payment password
 * @param {string} password password
 * @return {string}
 */
function decodePrivate(encodedPriv, password) {
    const pwdHash = hashWithSalt(password, SALT_PRIV)
    const priv = aesDecrypt(encodedPriv, pwdHash)
    if (!priv) {
        throw new Error(errors.DecryptionError())
    }
    return priv
}

/**
 * encrypt the mnemonic with the password
 * @param {string} mnemonic
 * @param {string} password
 * @return {string}
 */
function encodeMnemonic(mnemonic, password) {
    const pwdHash = hashWithSalt(password, SALT_PRIV)
    return aesEncrypt(mnemonic, pwdHash)
}

/**
 * Decrypt the mnemonic with the password
 * @param {string} encodedMnemonic
 * @param {string} password
 * @return {string}
 */
function decodeMnemonic(encodedMnemonic, password) {
    const pwdHash = hashWithSalt(password, SALT_PRIV)
    const mnemonic = aesDecrypt(encodedMnemonic, pwdHash)
    if (!mnemonic) {
        throw new Error(errors.DecryptionError())
    }
    return mnemonic
}

import {Buffer} from 'safe-buffer'
import {SALT_PASSWORD, PASSWORD_HASH, SALT_PRIV, ethereumPath, MNEMONIC_LENGTH, ACCOUNT_NAME, ACCOUNT_LIST} from './const'
import errors from './errors'
import {mnemonicToSeedSync} from './crypto/mnemonic/index'
import {privateToAddress, keccak256} from './crypto/crypto'

const CryptoJs = require('crypto-js')
const HDKey = require('./crypto/hdkey')

/**
 * encrypt the password with the password 对密码进行加密
 * @param {string} password The user's payment password
 * @return {string}
 */
export function encodePassword(password) {
    const encode = keccak256(Buffer.from(SALT_PASSWORD + password))
    return encode.toString('hex')
}
/**
 * encrypt the privateKey with the password 对私钥进行加密
 * @param {string} priv privateKey
 * @param {string} password password
 * @return {string}
 */
export function encodePrivate(priv, password) {
    const encodePwd = keccak256(Buffer.from(SALT_PRIV + password))
    const encode = CryptoJs.AES.encrypt(priv, encodePwd).toString()
    return Buffer.from(encode).toString('hex')
}
/**
 * Decrypt the privateKey with the password 对私钥进行解密
 * @param {string} encodePriv The user's payment password
 * @param {string} password password
 * @return {string}
 */
export function decodePrivate(encodePriv, password) {
    console.log(10000, encodePriv)
    encodePriv = encodePriv.slice(2)
    console.log(1111, encodePriv)
    const bytes = CryptoJs.AES.decrypt(encodePriv, password)
    console.log(2222, bytes)
    return Buffer.from(bytes).toString()
}
/**
 * verify password 校验密码
 * @param {string} password
 * @return {boolean}
 */
export function verifyPassword(password) {
    const pwdHash = this.storage.getItem(PASSWORD_HASH)
    return encodePassword(password) === pwdHash
}
/**
 * 生成账户信息
 * @param {string | array} mnemonic
 * @return {object}
 */
export function generateAccount(mnemonic) {
    const seed = mnemonicToSeedSync(mnemonic)
    const Hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'))
    console.log(222222, Hdkey)
    // 生成私钥和公钥
    let privKey = Hdkey.derive(ethereumPath.path).privateExtendedKey
    privKey = `0x${Buffer.from(privKey).toString('hex')}`
    const address = privateToAddress(privKey)
    return {
        privKey,
        address,
        mnemonic,
    }
}
/**
 * 校验助记词
 * @param {string | array} mnemonic
 * @return {array}
 */
export function verifyMnemonic(mnemonic) {
    if (typeof mnemonic === 'string') {
        mnemonic = mnemonic.split(' ')
    }
    if (Array.isArray(mnemonic)) {
        if (mnemonic.length === MNEMONIC_LENGTH) {
            return mnemonic
        } else {
            throw new Error(errors.MnemonicLengthError())
        }
    }
    throw new Error(errors.ValueMistake('mnemonic'))
}
/**
 * 账户信息存储格式
 * @param {object | string} data account information or password
 * @return {object | string}
 */
export function formatStorageAccount(data) {
    if (typeof data === 'object') {
        if (!data.addressName) {
            data.addressName = ACCOUNT_NAME
        }
        if (!data.mnemonic) {
            data.mnemonic = ''
        }
        data.privKey = encodePrivate(data.privKey)
        data.path = ethereumPath.path
    }
    // if (typeof data === 'string') {
    //     data = initPassword(data)
    // }
    return data
}
/**
 * 存储账户校验
 * @param {object} data
 * @return {object}
 */
export function insertAccount(data) {
    data = formatStorageAccount(data)
    const list = this.storage.getItem(ACCOUNT_LIST)
    const oldAccount = list.find(item => item.address === data.address)
    if (!oldAccount) {
        this.storage.setItem(ACCOUNT_LIST, list.push(data)) // 改
    }
    return data
}
/**
 * 存储密码校验
 * @param {string} value
 * @param {string} password
 * @return {object}
 */
export function verifyStoragePassword(value, password) {
    const pwd = this.storage.getItem(PASSWORD_HASH)
    if (pwd) {
        this.storage.setItem(PASSWORD_HASH, formatStorageAccount(password))
    }
    return encodePassword(password) === pwd
}

export default {
    encodePassword,
    encodePrivate,
    decodePrivate,
    verifyPassword,
    generateAccount,
    verifyMnemonic,
    formatStorageAccount,
    insertAccount,
    verifyStoragePassword,
}

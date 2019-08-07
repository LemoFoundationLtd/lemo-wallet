import * as HDKey from 'hdkey'
import {Buffer} from 'safe-buffer'
import CryptoJs from 'crypto-js'
import {SALT_PASSWORD, PASSWORD_HASH, SALT_PRIV, ethereumPath, MNEMONIC_LENGTH, ACCOUNT_NAME, ACCOUNT_LIST} from './const'
import errors from './errors'
import {mnemonicToSeedSync} from './crypto/mnemonic/index'
import {privateToAddress, keccak256} from './crypto/crypto'

/**
 * encrypt the password with the password 对密码进行加密
 * @param {string} password The user's payment password
 * @return {string}
 */
export function encodePassword(password) {
    password = password.trim()
    const encode = keccak256(Buffer.from(SALT_PASSWORD + password))
    return encode.toString('hex')
}

/**
 * 存储密码校验
 * @param {object} storage
 * @param {string} password
 * @return {boolean}
 */
export function verifyPassword(storage, password) {
    const pwd = storage.getItem(PASSWORD_HASH)
    const encode = encodePassword(password)
    if (encode !== pwd) {
        throw new Error('wrong password')
    }
}

/**
 * encrypt the privateKey with the password 对私钥进行加密
 * @param {string} priv privateKey
 * @param {string} password password
 * @return {string}
 */
export function encodePrivate(priv, password) {
    const encodePwd = keccak256(Buffer.from(SALT_PASSWORD + password)).toString('hex')
    return CryptoJs.AES.encrypt((SALT_PRIV + priv), encodePwd).toString()
}

/**
 * Decrypt the privateKey with the password 对私钥进行解密
 * @param {string} encodedPriv The user's payment password
 * @param {string} password password
 * @return {string}
 */
export function decodePrivate(encodedPriv, password) {
    const encodePwd = keccak256(Buffer.from(SALT_PASSWORD + password)).toString('hex')
    const bytes = CryptoJs.AES.decrypt(encodedPriv, encodePwd)
    const priv = bytes.toString(CryptoJs.enc.Utf8).slice(SALT_PRIV.length)
    if (priv === '') {
        throw new Error(errors.DecryptionError())
    }
    return priv
}

/**
 * encrypt the mnemonic with the password
 * @param {string} mnemonic
 * @param {string} password password
 * @return {string}
 */
export function encodeMnemonic(mnemonic, password) {
    const encodePwd = keccak256(Buffer.from(SALT_PASSWORD + password)).toString('hex')
    return CryptoJs.AES.encrypt((SALT_PRIV + mnemonic), encodePwd).toString()
}

/**
 * Decrypt the mnemonic with the password
 * @param {string} encodedMnemonic
 * @param {string} password password
 * @return {string}
 */
export function decodeMnemonic(encodedMnemonic, password) {
    const encodePwd = keccak256(Buffer.from(SALT_PASSWORD + password)).toString('hex')
    const bytes = CryptoJs.AES.decrypt(encodedMnemonic, encodePwd)
    const mnemonic = bytes.toString(CryptoJs.enc.Utf8).slice(SALT_PRIV.length)
    if (mnemonic === '') {
        throw new Error(errors.DecryptionError())
    }
    return mnemonic
}

/**
 * 生成账户信息
 * @param {string} addressName
 * @param {Array<string>} mnemonicArr
 * @param {string} password
 * @return {object}
 */
export function buildAccountByMnemonic(addressName, mnemonicArr, password) {
    const mnemonic = mnemonicArr.join(' ')
    const privKey = mnemonicToPrivate(mnemonic)
    const address = privateToAddress(privKey)
    const plainAccount = {
        privKey,
        address,
        mnemonic,
        addressName,
    }
    return formatAccount(plainAccount, password)
}

/**
 * 生成账户信息
 * @param {string} addressName
 * @param {string} privKey
 * @param {string} password
 * @return {object}
 */
export function buildAccount(addressName, privKey, password) {
    const address = privateToAddress(privKey)
    const plainAccount = {
        privKey,
        address,
        addressName,
    }
    return formatAccount(plainAccount, password)
}

/**
 * 根据助记词字符串获取私钥
 * @param {string} mnemonic
 * @return {string}
 */
function mnemonicToPrivate(mnemonic) {
    const hdKey = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic))
    // 取第0个私钥和公钥
    const privKey = hdKey.derive(`${ethereumPath.path}/0`).privateKey
    return `0x${Buffer.from(privKey).toString('hex')}`
}

/**
 * 账户信息存储格式
 * @param {object} data account information or password
 * @param {string} password
 * @return {object}
 */
export function formatAccount(data, password) {
    if (!data.addressName) {
        data.addressName = ACCOUNT_NAME
    }
    if (data.mnemonic && data.mnemonic.length) {
        data.mnemonic = encodeMnemonic(data.mnemonic, password)
    }
    data.privKey = encodePrivate(data.privKey, password)
    data.path = ethereumPath.path
    return data
}

/**
 * 存储账户校验
 * @param {object} accountInfo
 * @param {object} storage
 * @return {object}
 */
export function insertAccount(accountInfo, storage) {
    const list = storage.getItem(ACCOUNT_LIST)
    const oldAccount = list.find(item => item.address === accountInfo.address)
    if (!oldAccount) {
        list.push(accountInfo)
        storage.setItem(ACCOUNT_LIST, list)
    }
    return accountInfo
}

/**
 * 根据地址查找账户信息
 * @param {object} storage
 * @param {string} address
 * @return {object}
 */
export function findAccount(storage, address) {
    const info = storage.getItem(ACCOUNT_LIST).find(item => item.address === address)
    if (!info) {
        throw new Error(errors.AccountNotExist(address))
    }
    return info
}

/**
 * Format the mnemonic to array
 * @param {string | Array<string>} mnemonic
 * @return {Array<string>}
 */
export function formatMnemonic(mnemonic) {
    if (typeof mnemonic === 'string') {
        return mnemonic.trim().split(/\s+/)
    }
    if (!Array.isArray(mnemonic)) {
        return mnemonic.map(item => item.trim())
    }
    throw new Error(errors.MnemonicTypeError())
}

/**
 * 校验助记词
 * @param {Array<string>} mnemonicArr
 */
export function verifyMnemonic(mnemonicArr) {
    if (mnemonicArr.length !== MNEMONIC_LENGTH) {
        throw new Error(errors.MnemonicLengthError())
    }
}


export default {
    encodePassword,
    encodePrivate,
    decodePrivate,
    encodeMnemonic,
    decodeMnemonic,
    verifyPassword,
    buildAccount,
    buildAccountByMnemonic,
    verifyMnemonic,
    insertAccount,
    findAccount,
}

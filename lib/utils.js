import * as HDKey from 'hdkey'
import {Buffer} from 'safe-buffer'
import {SALT_PASSWORD, PASSWORD_HASH, SALT_PRIV, ethereumPath, MNEMONIC_LENGTH, ACCOUNT_NAME, ACCOUNT_LIST} from './const'
import errors from './errors'
import {mnemonicToSeedSync} from './crypto/mnemonic/index'
import {privateToAddress, keccak256} from './crypto/crypto'

const CryptoJs = require('crypto-js')

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
 * 存储密码校验
 * @param {object} storage
 * @param {string} password
 * @return {boolean}
 */
export function verifyPassword(storage, password) {
    const pwd = storage.getItem(PASSWORD_HASH)
    const encode = encodePassword(password)
    console.log(encode)
    if (encode !== pwd) {
        throw new Error(errors.ValueMistake('password'))
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
 * @param {string} encodePriv The user's payment password
 * @param {string} password password
 * @return {string}
 */
export function decodePrivate(encodePriv, password) {
    const encodePwd = keccak256(Buffer.from(SALT_PASSWORD + password)).toString('hex')
    const bytes = CryptoJs.AES.decrypt(encodePriv, encodePwd)
    const priv = bytes.toString(CryptoJs.enc.Utf8).slice(10)
    if (priv === '') {
        throw new Error(errors.DecryptionError())
    }
    return priv
}

/**
 * 生成账户信息
 * @param {string | array} mnemonic
 * @param {string} addressName
 * @return {object}
 */
export function buildAccount(mnemonic, addressName) {
    mnemonic = verifyMnemonic(mnemonic).join(' ')
    const hdKey = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic))
    // 取第0个私钥和公钥
    let privKey = hdKey.derive(`${ethereumPath.path}/0`).privateKey
    privKey = `0x${Buffer.from(privKey).toString('hex')}`
    const address = privateToAddress(privKey)
    return {
        privKey,
        address,
        mnemonic,
        addressName,
    }
}

/**
 * 账户信息存储格式
 * @param {object | string} data account information or password
 * @param {string} password
 * @return {object | string}
 */
export function formatAccount(data, password) {
    if (typeof data === 'object') {
        if (!data.addressName) {
            data.addressName = ACCOUNT_NAME
        }
        if (!data.mnemonic) {
            data.mnemonic = []
        } else data.mnemonic = verifyMnemonic(data.mnemonic)
        data.privKey = encodePrivate(data.privKey, password)
        data.path = ethereumPath.path
    }
    return data
}

/**
 * 存储账户校验
 * @param {object} data
 * @param {string} password
 * @param {object} storage
 * @return {object}
 */
export function insertAccount(data, password, storage) {
    data = formatAccount(data, password)
    const list = storage.getItem(ACCOUNT_LIST)
    const oldAccount = list.find(item => item.address === data.address)
    if (!oldAccount) {
        list.push(data)
        storage.setItem(ACCOUNT_LIST, list)
    }
    return data
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


export default {
    encodePassword,
    encodePrivate,
    decodePrivate,
    verifyPassword,
    buildAccount,
    verifyMnemonic,
    insertAccount,
}

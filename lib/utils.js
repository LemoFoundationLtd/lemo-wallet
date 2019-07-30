import {Buffer} from 'safe-buffer'
import {SALT_PASSWORD, PASSWORD_HASH, SALT_PRIV} from './const'
import {keccak256} from './crypto'

const bip39 = require('bip39')

/**
 * Decrypt the privateKey with the password 对密码进行加密
 * @param {string} password The user's payment password
 * @return {string}
 */
export function initPassword(password) {
    const decodePwd = keccak256(Buffer.concat([SALT_PASSWORD, password]))
    this.storage.setItem(PASSWORD_HASH, `0x${decodePwd.toString('hex')}`)
    return `0x${decodePwd.toString('hex')}`
}

export function initPrivate(prvi) {
    const decodePwd = keccak256(Buffer.concat([SALT_PRIV, prvi]))
    this.storage.setItem(PASSWORD_HASH, `0x${decodePwd.toString('hex')}`)
    return `0x${decodePwd.toString('hex')}`
}
/**
 * Randomly generate mnemonic words 随机创建助记词
 * @return {string} mnemonic string
 */
export function createMnemonic() {
    return bip39.generateMnemonic(128)
}
/**
 * Seeds are obtained by mnemonic words 通过助记词得到种子
 * @return {string} seed string
 */
export function generateSeed() {
    const mnemonics = createMnemonic()
    return bip39.mnemonicToSeedSync(mnemonics).toString('hex')
}
/**
 * verify password 校验密码
 * @param {Buffer} password
 * @return {boolean}
 */
export function verifyPassword(password) {
    const pwdHash = this.storage.getItem(PASSWORD_HASH)
    return initPassword(password) === pwdHash
}

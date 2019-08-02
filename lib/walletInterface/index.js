import {verifyPassword, encodePassword, formatStorageAccount, decodePrivate, generateAccount, insertAccount} from '../utils'
import {ACCOUNT_LIST, PASSWORD_HASH} from '../const'
import {privateToAddress} from '../crypto/crypto'
import errors from '../errors'
import {generateMnemonic} from '../crypto/mnemonic'

const LemoClient = require('lemo-client')


export default {
    /**
     * Create account 创建账户
     * @param {string} password
     * @param {string} addressName
     * @return {object}
     */
    createAccount(password, addressName) {
        this.storage.setItem(PASSWORD_HASH, formatStorageAccount(password))
        const mnemonic = generateMnemonic()
        const info = generateAccount(mnemonic)
        info.addressName = addressName
        return insertAccount(ACCOUNT_LIST, info)
    },
    /**
     * Import mnemonic to eget account information 导入助记词，得到用户账户信息
     * @param {string} mnemonic Creator address
     * @param {string} password User id
     * @return {object}
     */
    importMnemonic(mnemonic, password) {
        this.storage.setItem(PASSWORD_HASH, formatStorageAccount(password))
        const info = generateAccount(mnemonic)
        return insertAccount(ACCOUNT_LIST, info)
    },
    /**
     * import privateKey 导入私钥
     * @param {string} privKey
     * @param {string} password
     * @return {object}
     */
    importPrivate(privKey, password) {
        this.storage.setItem(PASSWORD_HASH, formatStorageAccount(password))
        const address = privateToAddress(privKey)
        const accountInfo = {
            address,
            privKey,
        }
        return insertAccount(ACCOUNT_LIST, accountInfo)
    },
    /**
     * export mnemonic 导出助记词
     * @param {string} address Creator address
     * @param {string} password User id
     * @return {array}
     */
    exportMnemonic(address, password) {
        if (verifyPassword(password) === false) {
            throw new Error(errors.ValueMistake('password'))
        }
        const result = this.storage.getItem(ACCOUNT_LIST)
        if (result.length === 0) {
            throw new Error(errors.AccountNoValue('mnemonic'))
        }
        return result
    },
    /**
     * export privateKey 导出私钥
     * @param {string} address Creator address
     * @param {string} password User id
     * @return {string}
     */
    exportPrivateKey(address, password) {
        if (verifyPassword(password) === false) {
            throw new Error(errors.ValueMistake('password'))
        }
        const info = this.storage.getItem(ACCOUNT_LIST)
        if (info.address === address) {
            return decodePrivate(info.private)
        } else {
            throw new Error(errors.ValueMistake('address'))
        }
    },
    /**
     * get account list 获取账户列表
     * @return {array} account list
     */
    getAccountList() {
        return this.storage.getItem(ACCOUNT_LIST)
    },
    /**
     * verify the password is correct 校验密码
     * @param {string} password Creator address
     * @return {boolean}
     */
    verifyPassword,
    /**
     * Decrypt the privateKey with the password 对密码进行加密
     * @param {string} address Creator address
     * @param {string} password User id
     * @return {string} privateKey
     */
    encodePassword,
    /**
     * Sign a transaction
     * @param {string} address Creator address
     * @param {string} txConfig transaction information
     * @param {string} password
     * @return {string} Signed string
     */
    sign(address, txConfig, password) {
        if (verifyPassword(password) === false) {
            throw new Error(errors.ValueMistake('password'))
        }
        txConfig = JSON.parse(txConfig)
        const accountInfo = this.storage.getItem(ACCOUNT_LIST).filter(item => item.address === address)
        return LemoClient.signTx(accountInfo.privKey, txConfig)
    },
    /**
     * modify password
     * @param {string} oldPassword
     * @param {string} newPassword
     */
    modifyPassword(oldPassword, newPassword) {
        if (verifyPassword(oldPassword) === false) {
            throw new Error(errors.ValueMistake('password'))
        }
        this.storage.setItem(PASSWORD_HASH, newPassword)
        return newPassword
    },
    /**
     * delete account
     * @param {string} address Creator address
     * @param {string} password User id
     */
    deleteAccount(address, password) {
        if (verifyPassword(password) === false) {
            throw new Error(errors.ValueMistake('password'))
        }
        const addressInfo = this.storage.getItem(ACCOUNT_LIST).filter(item => item.address !== address)
        this.storage.setItem(ACCOUNT_LIST, addressInfo)
    },
}

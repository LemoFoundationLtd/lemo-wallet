import {verifyPassword, encodePassword, decodePrivate, buildAccount, insertAccount} from './utils'
import {ACCOUNT_LIST, PASSWORD_HASH} from './const'
import {privateToAddress} from './crypto/crypto'
import errors from './errors'
import {generateMnemonic} from './crypto/mnemonic/index'

const LemoClient = require('lemo-client')

class LemoWallet {
    constructor(config = {}) {
        this.config = {}
        this.storage = config.storage
    }

    savePassword(password) {
        const encode = encodePassword(password)
        this.storage.setItem(PASSWORD_HASH, encode)
        return encode
    }

    /**
     * Create account 创建账户
     * @param {string} password
     * @param {string} addressName
     * @return {object} account information
     */
    createAccount(password, addressName) {
        const mnemonic = generateMnemonic()
        return this.importMnemonic(mnemonic, password, addressName)
    }

    /**
     * Import mnemonic to eget account information 导入助记词，得到用户账户信息
     * @param {string} mnemonic
     * @param {string} password
     * @param {string} addressName
     * @return {object} account information
     */
    importMnemonic(mnemonic, password, addressName) {
        verifyPassword(this.storage, password)
        const accountInfo = buildAccount(mnemonic, addressName)
        return insertAccount(accountInfo, password, this.storage)
    }

    /**
     * import privateKey 导入私钥
     * @param {string} privKey
     * @param {string} password
     * @param {string} addressName
     * @return {object}
     */
    importPrivate(privKey, password, addressName) {
        verifyPassword(this.storage, password)
        const address = privateToAddress(privKey)
        const accountInfo = {
            address,
            privKey,
            addressName,
        }
        return insertAccount(accountInfo, password, this.storage)
    }

    /**
     * export mnemonic 导出助记词
     * @param {string} address Creator address
     * @param {string} password User id
     * @return {array}
     */
    exportMnemonic(address, password) {
        verifyPassword(this.storage, password)
        const result = this.storage.getItem(ACCOUNT_LIST).filter(item => item.address === address)
        if (result.length === 0) {
            throw new Error(errors.AccountNoValue('mnemonic'))
        }
        return result[0].mnemonic
    }

    /**
     * export privateKey 导出私钥
     * @param {string} address Creator address
     * @param {string} password User id
     * @return {string}
     */
    exportPrivateKey(address, password) {
        verifyPassword(this.storage, password)
        const info = this.storage.getItem(ACCOUNT_LIST).filter(item => item.address === address)
        if (info[0].address === address) {
            return decodePrivate(info[0].privKey, password)
        } else {
            throw new Error(errors.ValueMistake('address'))
        }
    }

    /**
     * get account list 获取账户列表
     * @return {array} account list
     */
    getAccountList() {
        return this.storage.getItem(ACCOUNT_LIST)
    }

    /**
     * Sign a transaction
     * @param {string} address Creator address
     * @param {object} txConfig transaction information
     * @param {string} password
     * @return {string} Signed string
     */
    sign(address, txConfig, password) {
        verifyPassword(this.storage, password)
        const accountInfo = this.storage.getItem(ACCOUNT_LIST).filter(item => item.address === address)
        const privKey = decodePrivate(accountInfo[0].privKey, password)
        return LemoClient.signTx(privKey, txConfig)
    }

    /**
     * modify password
     * @param {string} oldPassword
     * @param {string} newPassword
     */
    modifyPassword(oldPassword, newPassword) {
        verifyPassword(this.storage, oldPassword)
        return this.savePassword(newPassword)
    }

    /**
     * delete account
     * @param {string} address Creator address
     * @param {string} password User id
     */
    deleteAccount(address, password) {
        verifyPassword(this.storage, password)
        const addressInfo = this.storage.getItem(ACCOUNT_LIST).filter(item => item.address !== address)
        if (addressInfo && addressInfo.length) {
            this.storage.setItem(ACCOUNT_LIST, addressInfo)
        }
    }
}


export default LemoWallet

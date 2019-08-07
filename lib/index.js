import LemoClient from 'lemo-client'
import {
    verifyPassword,
    encodePassword,
    formatMnemonic,
    decodePrivate,
    decodeMnemonic,
    buildAccount,
    buildAccountByMnemonic,
    insertAccount,
    findAccount, verifyMnemonic
} from './utils'
import {ACCOUNT_LIST, PASSWORD_HASH} from './const'
import {generateMnemonic} from './crypto/mnemonic/index'

class LemoWallet {
    constructor(config = {}) {
        this.config = {}
        this.storage = config.storage
    }

    /**
     * setup password
     * @param {string} password
     */
    savePassword(password) {
        const encode = encodePassword(password)
        this.storage.setItem(PASSWORD_HASH, encode)
    }

    /**
     * Create account
     * @param {string} password
     * @param {string} addressName
     * @return {object} account information
     */
    createAccount(password, addressName) {
        const mnemonicArr = generateMnemonic()
        return this.importMnemonic(mnemonicArr, password, addressName)
    }

    /**
     * Import mnemonic to storage and return account information
     * @param {string | Array<string>} mnemonic
     * @param {string} password
     * @param {string} addressName
     * @return {object} account information
     */
    importMnemonic(mnemonic, password, addressName) {
        verifyPassword(this.storage, password)
        const mnemonicArr = formatMnemonic(mnemonic)
        verifyMnemonic(mnemonicArr)

        const accountInfo = buildAccountByMnemonic(addressName, mnemonicArr, password)
        return insertAccount(accountInfo, this.storage)
    }

    /**
     * Import privateKey
     * @param {string} privKey
     * @param {string} password
     * @param {string} addressName
     * @return {object}
     */
    importPrivate(privKey, password, addressName) {
        verifyPassword(this.storage, password)

        const accountInfo = buildAccount(addressName, privKey, password)
        return insertAccount(accountInfo, this.storage)
    }

    /**
     * export mnemonic 导出助记词
     * @param {string} address Creator address
     * @param {string} password User id
     * @return {Array<string>}
     */
    exportMnemonic(address, password) {
        verifyPassword(this.storage, password)
        const info = findAccount(this.storage, address)
        return decodeMnemonic(info.mnemonic, password).split(' ')
    }

    /**
     * export privateKey 导出私钥
     * @param {string} address Creator address
     * @param {string} password User id
     * @return {string}
     */
    exportPrivateKey(address, password) {
        verifyPassword(this.storage, password)
        const info = findAccount(this.storage, address)
        return decodePrivate(info.privKey, password)
    }

    /**
     * get account list 获取账户列表
     * @return {array} account list
     */
    getAccountList() {
        return this.storage.getItem(ACCOUNT_LIST)
            .map(item => ({
                addressName: item.addressName,
                address: item.address,
            }))
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
        const info = findAccount(this.storage, address)
        const privKey = decodePrivate(info.privKey, password)
        return LemoClient.signTx(privKey, txConfig)
    }

    /**
     * modify password
     * @param {string} oldPassword
     * @param {string} newPassword
     */
    modifyPassword(oldPassword, newPassword) {
        verifyPassword(this.storage, oldPassword)
        this.savePassword(newPassword)
        // TODO decode all accounts by old password and encode them by the new password
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

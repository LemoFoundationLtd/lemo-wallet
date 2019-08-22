import LemoTx from 'lemo-tx'
import errors from './errors'
import {generateMnemonic} from './crypto/mnemonic/index'
import PwdStorage from './storage/password_storage'
import AccountsStorage from './storage/accounts_storage'

class LemoWallet {
    constructor(config = {}) {
        if (!config.storage) {
            throw new Error(errors.NoStorage())
        }

        this.pwd = new PwdStorage(config.storage)
        this.accounts = new AccountsStorage(config.storage)
    }

    /**
     * setup password
     * @param {string} password
     */
    setupPassword(password) {
        this.pwd.setupPassword(password)
    }

    /**
     * Create account
     * @param {string} addressName
     * @param {string} password
     * @return {object} account information
     */
    createAccount(addressName, password) {
        this.pwd.verifyPassword(password)
        const mnemonicArr = generateMnemonic()
        return this.accounts.insertByMnemonic(mnemonicArr, addressName, password)
    }

    /**
     * Import mnemonic to storage and return account information
     * @param {string | Array<string>} mnemonic
     * @param {string} addressName
     * @param {string} password
     * @return {object} account information
     */
    importMnemonic(mnemonic, addressName, password) {
        this.pwd.verifyPassword(password)
        return this.accounts.insertByMnemonic(mnemonic, addressName, password)
    }

    /**
     * Import privateKey
     * @param {string} privKey
     * @param {string} addressName
     * @param {string} password
     * @return {object}
     */
    importPrivate(privKey, addressName, password) {
        if (!/0x?\w{64}/i.test(privKey)) {
            throw new Error(errors.DecryptionError())
        }
        this.pwd.verifyPassword(password)
        return this.accounts.insertByPrivate(privKey, addressName, password)
    }

    /**
     * export mnemonic 导出助记词
     * @param {string} address Creator address
     * @param {string} password User id
     * @return {Array<string>}
     */
    exportMnemonic(address, password) {
        this.pwd.verifyPassword(password)
        const info = this.accounts.decodeAccount(address, password)
        return info.mnemonic.split(' ')
    }

    /**
     * export privateKey 导出私钥
     * @param {string} address Creator address
     * @param {string} password
     * @return {string}
     */
    exportPrivateKey(address, password) {
        this.pwd.verifyPassword(password)
        const info = this.accounts.decodeAccount(address, password)
        return info.privKey
    }

    /**
     * Get account list 获取账户列表
     * @return {Array<{addressName:string, address:string}>} account list
     */
    getAccountList() {
        return this.accounts.listAccounts()
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
        this.pwd.verifyPassword(password)
        const info = this.accounts.decodeAccount(address, password)
        return LemoTx.sign(info.privKey, txConfig)
    }

    /**
     * Sign a asset transaction
     * @param {string} address Creator address
     * @param {object} txConfig transaction information
     * @param {object} transferAssetInfo TransferAsset information
     * @param {string} password
     * @return {string} Signed string
     */
    signAsset(address, txConfig, transferAssetInfo, password) {
        this.pwd.verifyPassword(password)
        const info = this.accounts.decodeAccount(address, password)
        return LemoTx.signTransferAsset(info.privKey, txConfig, transferAssetInfo)
    }

    /**
     * Modify password
     * @param {string} oldPassword
     * @param {string} newPassword
     */
    modifyPassword(oldPassword, newPassword) {
        this.pwd.modifyPassword(oldPassword, newPassword)
    }

    /**
     * Delete account
     * @param {string} address Creator address
     * @param {string} password User id
     */
    deleteAccount(address, password) {
        this.pwd.verifyPassword(password)
        this.accounts.deleteAccount(address)
    }
}

export default LemoWallet

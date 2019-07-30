import {verifyPassword, initPassword, initPrivate, dncodePrivate} from '../utils'
import {ethereumPath, ACCOUNT_INFO, ACCOUNT_LIST, PASSWORD_HASH, WALLET_NAME} from '../const'
import {privateToAddress, encodeAddress} from '../crypto'
import errors from '../errors'

const bip39 = require('bip39')
const LemoClient = require('lemo-client')
const HDKey = require('../HDkey/hdkey')


export default {
    /**
     * Create account 创建账户
     * @param {string} password
     * @param {string} addressName
     * @return {object}
     */
    createAccount(password, addressName) {
        this.storage.setItem(PASSWORD_HASH, initPassword(password))
        const mnemonic = bip39.generateMnemonic(128)
        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
        const privKey = HDKey.fromMasterSeed(seed)
        const address = privateToAddress(privKey)
        this.storage.setItem(ACCOUNT_INFO, {
            address: encodeAddress(address),
            privKey: initPrivate(privKey),
            mnemonic: mnemonic.split(' '),
            path: ethereumPath.path,
        })
        this.storage.setItem(ACCOUNT_LIST, [{
            address: privateToAddress(privKey),
            addressName,
        }])
        return this.storage.getItem(ACCOUNT_INFO)
    },
    /**
     * Import mnemonic to eget account information 导入助记词，得到用户账户信息
     * @param {string} mnemonics Creator address
     * @param {string} password User id
     * @return {string}
     */
    importMnemonic(mnemonics, password) {
        this.storage.setItem(PASSWORD_HASH, initPassword(password))
        const seed = bip39.mnemonicToSeed(mnemonics)
        const privKey = HDKey.fromMasterSeed(seed)
        const address = privateToAddress(privKey)
        this.storage.setItem(ACCOUNT_INFO, {
            address: encodeAddress(address),
            privKey: initPrivate(privKey),
            mnemonic: mnemonics,
            path: ethereumPath.path,
        })
        this.storage.setItem(ACCOUNT_LIST, [{
            address: privateToAddress(privKey),
            addressName: WALLET_NAME,
        }])
        return {
            address: encodeAddress(address),
            privKey: initPrivate(privKey),
            mnemonic: mnemonics,
            path: ethereumPath.path,
        }
    },
    /**
     * import privateKey 导入私钥
     * @param {string} privateKey
     * @param {string} password User id
     * @return {string}
     */
    importPrivate(privateKey, password) {
        this.storage.setItem(PASSWORD_HASH, initPassword(password))
        const address = privateToAddress(privateKey)
        this.storage.setItem(ACCOUNT_INFO, {
            address: encodeAddress(address),
            privKey: initPrivate(privateKey),
            mnemonic: [],
            path: ethereumPath.path,
        })
        this.storage.setItem(ACCOUNT_LIST, [{
            address: privateToAddress(privateKey),
            addressName: WALLET_NAME,
        }])
        return {
            address: encodeAddress(address),
            privKey: initPrivate(privateKey),
            mnemonic: [],
            path: ethereumPath.path,
        }
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
        const result = this.storage.getItem(ACCOUNT_INFO)
        if (result.mnemonic.length === 0) {
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
        const info = this.storage.getItem(ACCOUNT_INFO)
        if (info.address === address) {
            return dncodePrivate(info.private)
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
    initPassword,
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
        const priv = this.storage.getItem(ACCOUNT_INFO).privKey
        return LemoClient.signTx(priv, txConfig)
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
        this.storage.getItem(PASSWORD_HASH, newPassword)
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
        const addressInfo = this.storage.getItem(ACCOUNT_INFO)
        if (addressInfo.address === address) {
            this.storage.removeItem(ACCOUNT_INFO)
        }
    },
}

import lemoUtils from 'lemo-utils'
import {ACCOUNT_LIST, WALLET_NAME, ETHEREUM_PATH, MNEMONIC_LENGTH} from '../const';
import {mnemonicToPrivate} from '../crypto/mnemonic/index';
import {encodeAccount, decodeAccount} from './account_crypto_util';
import errors from '../errors';

export default class {
    constructor(storage) {
        this.storage = storage
    }

    /**
     * Import mnemonic to storage and return account information
     * @param {string | Array<string>} mnemonic
     * @param {string} addressName
     * @param {string} password
     * @return {object}
     */
    insertByMnemonic(mnemonic, addressName, password) {
        mnemonic = formatMnemonic(mnemonic)

        const privKey = mnemonicToPrivate(mnemonic)
        const accountInfo = createAccount(privKey, mnemonic, addressName)
        insertAccount(accountInfo, this.storage, password)
        accountInfo.mnemonic = accountInfo.mnemonic.split(' ')
        return accountInfo
    }

    /**
     * Import private to storage and return account information
     * @param {string} privKey
     * @param {string} addressName
     * @param {string} password
     * @return {object}
     */
    insertByPrivate(privKey, addressName, password) {
        privKey = formatPrivate(privKey)

        const accountInfo = createAccount(privKey, undefined, addressName)
        insertAccount(accountInfo, this.storage, password)
        return accountInfo
    }

    /**
     * Find and decode account information
     * @param {string} address
     * @param {string} password
     * @return {object}
     */
    decodeAccount(address, password) {
        const info = findAccount(this.storage, address)
        return decodeAccount(info, password)
    }

    /**
     * Get encoded account list
     * @return {Array} account list
     */
    listAccounts() {
        const data = this.storage.getItem(ACCOUNT_LIST)
        return JSON.parse(data)
    }

    /**
     * Delete account
     * @param {string} address
     */
    deleteAccount(address) {
        let result = this.storage.getItem(ACCOUNT_LIST)
        if (!result) {
            throw new Error(errors.NoStorageData())
        }
        result = result.filter(item => item.address !== address)
        this.storage.setItem(ACCOUNT_LIST, result)
    }
}

/**
 * Format the private key
 * @param {string} privKey
 * @return {string}
 */
function formatPrivate(privKey) {
    privKey = privKey.trim()
    return privKey
}

/**
 * Format and verify the mnemonic to string
 * @param {string | Array<string>} mnemonic
 * @return {string}
 */
function formatMnemonic(mnemonic) {
    let mnemonicArr
    if (typeof mnemonic === 'string') {
        mnemonicArr = mnemonic.trim().split(/\s+/)
    } else if (!Array.isArray(mnemonic)) {
        throw new Error(errors.MnemonicTypeError())
    } else {
        mnemonicArr = mnemonic
    }

    // verify
    if (mnemonicArr.length !== MNEMONIC_LENGTH) {
        throw new Error(errors.MnemonicLengthError())
    }
    // trim and toLowerCase every words
    mnemonicArr = mnemonicArr.map(item => item.trim().toLowerCase())
    return mnemonicArr.join(' ')
}

/**
 * Build account information
 * @param {string} privKey
 * @param {string, optional} mnemonic
 * @param {string} addressName
 * @return {object}
 */
function createAccount(privKey, mnemonic, addressName) {
    return {
        privKey,
        address: lemoUtils.privateKeyToAddress(privKey),
        mnemonic,
        addressName: addressName || WALLET_NAME,
        path: ETHEREUM_PATH.path,
    }
}

/**
 * Insert account to storage
 * @param {object} accountInfo
 * @param {object} storage
 * @param {string} password
 */
function insertAccount(accountInfo, storage, password) {
    accountInfo = encodeAccount(accountInfo, password)
    let list = storage.getItem(ACCOUNT_LIST)
    if (!list) {
        throw new Error(errors.NoStorageData())
    }
    list = JSON.parse(list)
    const oldAccount = list.find(item => item.address === accountInfo.address)
    if (!oldAccount) {
        list.push(accountInfo)
        storage.setItem(ACCOUNT_LIST, list)
    }
}

/**
 * 根据地址查找账户信息
 * @param {object} storage
 * @param {string} address
 * @return {object}
 */
function findAccount(storage, address) {
    let info = storage.getItem(ACCOUNT_LIST)
    if (!info) {
        throw new Error(errors.NoStorageData())
    }
    info = JSON.parse(info)
    const list = info.find(item => item.address === address)
    if (!list && list.length === 0) {
        throw new Error(errors.AccountNotExist(address))
    }
    return list
}

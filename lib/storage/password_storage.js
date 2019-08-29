import errors from '../errors';
import {hashWithSalt} from '../crypto/crypto';
import {ACCOUNT_LIST, PASSWORD_HASH, SALT_PASSWORD} from '../const';
import {decodeAccount, encodeAccount} from './account_crypto_util'

export default class {
    constructor(storage) {
        this.storage = storage
    }

    /**
     * Encrypt and save the password
     * @param {string} password The user's payment password
     */
    setupPassword(password) {
        const encode = encodePassword(password)
        this.storage.setItem(PASSWORD_HASH, encode)
    }

    /**
     * 存储密码校验
     * @param {string} password
     * @return {boolean}
     */
    verifyPassword(password) {
        const pwd = this.storage.getItem(PASSWORD_HASH)
        const encode = encodePassword(password)
        if (encode !== pwd) {
            throw new Error(errors.WrongPassword())
        }
    }

    /**
     * Modify password
     * @param {string} oldPassword
     * @param {string} newPassword
     */
    modifyPassword(oldPassword, newPassword) {
        this.verifyPassword(oldPassword)
        let list = this.storage.getItem(ACCOUNT_LIST)
        list = JSON.parse(list)
        list = list.map(item => decodeAccount(item, oldPassword))
        let encodeList = list.map(item => encodeAccount(item, newPassword))
        encodeList = JSON.stringify(encodeList)
        this.storage.setItem(ACCOUNT_LIST, encodeList)
        this.setupPassword(newPassword)
    }
}

/**
 * Get a hash by the password
 * @param {string} password The user's payment password
 * @return {string}
 */
function encodePassword(password) {
    password = password.trim()
    return hashWithSalt(password, SALT_PASSWORD)
}

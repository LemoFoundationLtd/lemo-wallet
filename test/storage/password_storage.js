import {assert} from 'chai'
import PwdStorage from '../../lib/storage/password_storage'
import {ACCOUNT_LIST, PASSWORD_HASH} from '../../lib/const'
import {testData} from '../data'
import errors from '../../lib/errors'

function copyObj(v) {
    return JSON.parse(JSON.stringify(v))
}

const storage = {
    memorys: {
        [ACCOUNT_LIST]: JSON.stringify([testData.testenCode]),
        [PASSWORD_HASH]: '8574dcb5f69e1303cdaf0dc8eae797a9bdc5af09f3e8784165165e93a0019c10', // 123AbC789
    },
    setItem(k, v) {
        if (typeof v === 'string') {
            this.memorys[k] = v
        } else {
            this.memorys[k] = JSON.stringify(v)
        }
    },
    getItem(k) {
        return copyObj(this.memorys[k])
    },
}
const passWord = new PwdStorage(storage)

// 保存密码
describe('password_setupPassword', () => {
    it('success', () => {
        storage.memorys[PASSWORD_HASH] = ''
        const passw = '123AbC789'
        passWord.setupPassword(passw)
        passWord.verifyPassword(passw)
    })
})

// 校验密码
describe('password_verifyPassword', () => {
    it('success', () => {
        const passw = '123AbC789'
        passWord.verifyPassword(passw)
    })
    it('password_error', () => {
        const passw = '123aaa789'
        assert.throws(() => {
            passWord.verifyPassword(passw)
        }, errors.WrongPassword())
    })
})

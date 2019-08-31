import {assert} from 'chai'
import accounts from '../../lib/storage/account_crypto_util'
import {testData} from '../data'
import {ACCOUNT_LIST, PASSWORD_HASH} from '../../lib/const'

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
// this file only two methods export
describe('encodeAccount_and_decodeAccount', () => {
    it('normal', () => {
        storage.memorys[ACCOUNT_LIST] = []
        const info = testData.testDecode
        const result1 = accounts.encodeAccount(info, testData.testDecodePwd)
        const result2 = accounts.decodeAccount(result1, testData.testDecodePwd)
        assert.deepEqual(result2, info)
    })
})

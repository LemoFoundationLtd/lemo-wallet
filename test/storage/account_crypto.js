import {assert} from 'chai'
import accounts from '../../lib/storage/account_crypto_util'
import {testData} from '../data'

// this file only two methods export
describe('encodeAccount_and_decodeAccount', () => {
    it('normal', () => {
        const info = testData.testDecode
        const result1 = accounts.encodeAccount(info, testData.testDecodePwd)
        const result2 = accounts.decodeAccount(result1, testData.testDecodePwd)
        assert.deepEqual(result2, info)
    })
})

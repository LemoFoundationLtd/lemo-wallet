import {assert} from 'chai'
import Account from '../../lib/storage/accounts_storage'
import {testData, storage} from '../data'
import errors from '../../lib/errors'

const account = new Account(storage)

describe('account_insertByMnemonic', () => {
    it('normal', () => {
        const mnemonic = testData.testDecode.mnemonic
        const addressName = testData.testDecode.addressName
        const pwd = testData.testDecodePwd
        const result = account.insertByMnemonic(mnemonic, addressName, pwd)
        result.mnemonic = result.mnemonic.join(' ')
        assert.deepEqual(result, testData.testDecode)
    })
    it('mnemonic_isArray', () => {
        const mnemonic = ['certain', 'blade', 'someone', 'unusual', 'time', 'clarify', 'minute', 'airport', 'long', 'claw', 'roast', 'wink']
        const addressName = testData.testDecode.addressName
        const pwd = testData.testDecodePwd
        const result = account.insertByMnemonic(mnemonic, addressName, pwd)
        result.mnemonic = result.mnemonic.join(' ')
        assert.deepEqual(result, testData.testDecode)
    })
    it('mnemonic_error', () => {
        const mnemonic = 'certain blade someone unusual time clarify minute airport long claw roast'
        const addressName = testData.testDecode.addressName
        const pwd = testData.testDecodePwd
        assert.throws(() => {
            account.insertByMnemonic(mnemonic, addressName, pwd)
        }, errors.MnemonicLengthError())
    })
    it('mnemonic_trim', () => {
        let mnemonic = ['certain', 'blade', 'someone', 'unusual', ' time', 'clarify ', 'minute', 'airport', 'long', 'claw', 'roast', 'wink']
        const addressName = testData.testDecode.addressName
        const pwd = testData.testDecodePwd
        const result = account.insertByMnemonic(mnemonic, addressName, pwd)
        mnemonic = mnemonic.map(item => item.trim())
        assert.deepEqual(result.mnemonic, mnemonic)
    })
    it('mnemonic_capital_letters', () => {
        let mnemonic = ['certain', 'blade', 'Someone', 'unusual', 'time', 'clarify', 'minute', 'aiRport', 'long', 'claw', 'roast', 'wink']
        const addressName = testData.testDecode.addressName
        const pwd = testData.testDecodePwd
        const result = account.insertByMnemonic(mnemonic, addressName, pwd)
        mnemonic = mnemonic.map(item => item.toLowerCase())
        assert.deepEqual(result.mnemonic, mnemonic)
    })
})

describe('account_insertByPrivate', () => {
    it('normal ', () => {
        const privKey = testData.testDecode.privKey
        const addressName = testData.testDecode.addressName
        const pwd = testData.testDecodePwd
        const result = account.insertByPrivate(privKey, addressName, pwd)
        assert.equal(result.mnemonic, undefined)
        assert.equal(result.privKey, privKey)
    })
})

// describe('account_listAccounts', () => {
//     it('get_Account_list ', () => {
//         const result = account.listAccounts()
//         console.log(result)
//         assert.equal(result[0].address, testData.testDecode.address)
//     })
// })

describe('account_deleteAccount', () => {
    it('should111 ', () => {
        account.deleteAccount('Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q')
    })
})

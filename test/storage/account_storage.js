import {assert} from 'chai'
import Account from '../../lib/storage/accounts_storage'
import {testData} from '../data'
import errors from '../../lib/errors'
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

describe('account_listAccounts', () => {
    it('get_Account_list ', () => {
        const result = account.listAccounts()
        assert.equal(result[0].address, testData.testDecode.address)
    })
    it('no_list_account ', () => {
        storage.memorys[ACCOUNT_LIST] = ''
        const result = account.listAccounts()
        assert.equal(result, '')
    })
})

describe('account_deleteAccount', () => {
    it('normal ', () => {
        storage.memorys[ACCOUNT_LIST] = JSON.stringify([testData.testenCode])
        account.deleteAccount('Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q')
    })
    it('no_account ', () => {
        storage.memorys[ACCOUNT_LIST] = ''
        assert.throws(() => {
            account.deleteAccount('Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q')
        }, errors.NoStorageData())
    })
})

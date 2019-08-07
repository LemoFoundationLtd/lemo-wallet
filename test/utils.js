import {assert} from 'chai'
import Utils from '../lib/utils'
import errors from '../lib/errors'

describe('utils_encodePrivate_and_decodePrivate', () => {
    it('normal', () => {
        const priv = '0x59d06271da5276ae03fd2e18fbc78fc91e7405f08d33c5e02cbb74e06d9b322f'
        const encode = Utils.encodePrivate(priv, '0xwjfjfkfkkdkk')
        const result = Utils.decodePrivate(encode, '0xwjfjfkfkkdkk')
        assert.equal(result, priv)
    })
    it('decodePrivate_pwd_error', () => {
        const priv = '0x59d06271da5276ae03fd2e18fbc78fc91e7405f08d33c5e02cbb74e06d9b322f'
        const encode = Utils.encodePrivate(priv, '0xwjfjfkfkkdkk')
        assert.throws(() => {
            const a = Utils.decodePrivate(encode, '0fjfkdkk')
            console.log(a)
        }, errors.DecryptionError())
    })
})

describe('utils_getGenerateAccount', () => {
    it('mnemonic_to_account', () => {
        const mnemonic = 'leader verify nut neither motion memory shallow where volcano monkey edge carpet'
        const name = 'demo'
        const a = Utils.buildAccount(mnemonic, name)
        assert.equal(a.mnemonic, mnemonic)
    })
    it('mnemonic_is_array', () => {
        const mnemonic = ['leader', 'verify', 'nut', 'neither', 'motion', 'memory', 'shallow', 'where', 'volcano', 'monkey', 'edge', 'carpet']
        const name = 'demo'
        const a = Utils.buildAccount(mnemonic, name)
        assert.equal(a.addressName, name)
    })
    it('mnemonic_only_11_word', () => {
        const mnemonic = 'leader nut neither motion memory shallow where volcano monkey edge carpet'
        const name = 'demo'
        assert.throws(() => {
            Utils.buildAccount(mnemonic, name)
        }, errors.MnemonicLengthError())
    })
})

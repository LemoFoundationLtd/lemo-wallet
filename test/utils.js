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
            Utils.decodePrivate(encode, '0fjfkdkk')
        }, errors.DecryptionError())
    })
})

describe('utils_encodeMnemonic_and_decodeMnemonic', () => {
    it('normal', () => {
        const mnemonic = 'leader verify nut neither motion memory shallow where volcano monkey edge carpet'
        const encode = Utils.encodeMnemonic(mnemonic, '0xwjfjfkfkkdkk')
        const result = Utils.decodeMnemonic(encode, '0xwjfjfkfkkdkk')
        assert.equal(result, mnemonic)
    })
    it('wrong password', () => {
        const mnemonic = ['leader', 'verify', 'nut', 'neither', 'motion', 'memory', 'shallow', 'where', 'volcano', 'monkey', 'edge', 'carpet']
        const encode = Utils.encodeMnemonic(mnemonic, '0xwjfjfkfkkdkk')
        assert.throws(() => {
            Utils.decodeMnemonic(encode, '0fjfkdkk')
        }, errors.DecryptionError())
    })
})

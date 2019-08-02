import {assert} from 'chai'
import Utils from '../lib/utils'

describe('utils_initPassword', () => {
    it('normal', () => {
        const passw = '123Abc789'
        const a = Utils.encodePassword(passw)
        console.log(a)
    })
})
describe('utils_initPrivate', () => {
    it('normal', () => {
        const priv = '0x59d06271da5276ae03fd2e18fbc78fc91e7405f08d33c5e02cbb74e06d9b322f'
        const a = Utils.initPrivate(priv, '0xwjfjfkfkkdkk')
        console.log(a)
    })
})
describe('utils_decodePrivate', () => {
    it('normal', () => {
        const priv = '0x59d06271da5276ae03fd2e18fbc78fc91e7405f08d33c5e02cbb74e06d9b322f'
        const a = Utils.encodePrivate(priv, '0xwjfjfkfkkdkk')
        const b = Utils.decodePrivate(a, '0xwjfjfkfkkdkk')
        console.log('------->', b)
    })
})
describe('utils_verifyPassword', () => {
    it('normal', () => {
        const passw = '123Abc789'
        const a = Utils.initPassword(passw)
        const b = Utils.verifyPassword(passw)
        console.log(a)
    })
})
describe('utils_getGenerateAccount', () => {
    it('mnemonic_to_account', () => {
        const mnemonic = 'leader verify nut neither motion memory shallow where volcano monkey edge carpet'
        const a = Utils.generateAccount(mnemonic)
        console.log(a)
    })
    it('no_mnemonic_to_account', () => {
        const a = Utils.generateAccount()
        console.log(a)
    })
    it('mnemonic_is_array', () => {
        const mnemonic = ['leader', 'nut', 'neither', 'motion', 'memory', 'shallow', 'where', 'volcano', 'monkey', 'edge', 'carpet']
        const a = Utils.generateAccount(mnemonic)
        console.log(a)
    })
    it('mnemonic_delete_one', () => {
        const mnemonic = 'leader nut neither motion memory shallow where volcano monkey edge carpet'
        const a = Utils.getGenerateAccount(mnemonic)
        console.log(a)
    })
})

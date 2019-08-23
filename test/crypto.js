import {assert} from 'chai'
import cry from '../lib/crypto/crypto'

describe('export_mnemonic', () => {
    it('normal', () => {
        const priv = '0xb16043f818288c75627feb6ec52eb6246bfbf5dda2ce0055e499850423919a32'
        const key = '568bcac8571d393a77426719ecf95433b56b3aac6dc2e2aa89eb14458579aede'
        const encode = cry.aesEncrypt(priv, key)
        const result = cry.aesDecrypt(encode, key)
        assert.equal(result, priv)
    })
})

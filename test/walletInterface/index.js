import {assert} from 'chai'
import LemoWallet from '../../lib/index'

const testStorage = {
    memory: {},
    setItem(k, v) {
        this.memory[k] = v
    },
    getItem(k) {
        return this.memory
    },
}
// demo
describe('demo', () => {
    it('empty demo', () => {
        const a = LemoWallet
        assert.equal(a, LemoWallet)
    })
})

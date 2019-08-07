import {assert} from 'chai'
import LemoWallet from '../../lib/index'

const testStorage = {
    memory: {
        ACCOUNT_LIST: [{
            privKey: 'U2FsdGVkX18xmx1tZrv89IFDJMVcTh38YbBMQFRdk4YmXLfILFUjIft7Yo27BvmgY/muNqmsXmYB2dGXu6yJC/eRxUf9vT4kdxdqZ/XZdSrNBUONYtoucD7b3WRWqVih',
            address: 'Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ',
            mnemonic: ['minor', 'half', 'image', 'census', 'endless', 'save', 'wreck', 'fork', 'key', 'wear', 'famous', 'mail'],
            addressName: 'demoWallet',
            path: 'm/44\'/60\'/0\'/0',
        }],
        PASSWORD_HASH: '8574dcb5f69e1303cdaf0dc8eae797a9bdc5af09f3e8784165165e93a0019c10', // 123AbC789
    },
    setItem(k, v) {
        if (k === 'account_list') {
            this.memory.ACCOUNT_LIST = v
        }
        if (k === 'password_hash') {
            this.memory.PASSWORD_HASH = v
        }
    },
    getItem(k) {
        return k === 'account_list' ? this.memory.ACCOUNT_LIST : this.memory.PASSWORD_HASH
    },
}

const wallet = new LemoWallet()
wallet.storage = testStorage

// 保存密码
describe('utils_savePassword', () => {
    it('save success', () => {
        const passw = '123AbC789'
        const result = wallet.savePassword(passw)
        assert.equal(result, testStorage.memory.PASSWORD_HASH)
    })
})
// 创建账户
describe('create_account', () => {
    it('normal', () => {
        const password = '123AbC789'
        const a = wallet.createAccount(password, 'demoWallet')
        assert.equal(a, testStorage.memory.ACCOUNT_LIST[1])
    })
})
// 导入助记词
describe('import_mnemonic', () => {
    it('empty_hhh', () => {
        const password = '123AbC789'
        const mnemonic = ['minor', 'half', 'image', 'census', 'endless', 'save', 'wreck', 'fork', 'key', 'wear', 'famous', 'mail']
        const name = 'hello'
        const a = wallet.importMnemonic(mnemonic, password, name)
        assert.equal(a.address, testStorage.memory.ACCOUNT_LIST[0].address)
    })
})
// 导入私钥
describe('import_private', () => {
    it('empty_hhh', () => {
        const password = '123AbC789'
        const priv = '0xb16043f818288c75627feb6ec52eb6246bfbf5dda2ce0055e499850423919a32'
        const name = 'hhh'
        const a = wallet.importPrivate(priv, password, name)
        console.log(a)
    })
})
// 导出助记词
describe('export_mnemonic', () => {
    it('empty_hhh', () => {
        const password = '123AbC789'
        const result = wallet.exportMnemonic('Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ', password)
        assert.equal(result, testStorage.memory.ACCOUNT_LIST[0].mnemonic)
    })
})
// 导出私钥
describe('export_private', () => {
    it('empty_hhh', () => {
        const password = '123AbC789'
        const result = wallet.exportPrivateKey('Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ', password)
        console.log(result) // 0xb16043f818288c75627feb6ec52eb6246bfbf5dda2ce0055e499850423919a32
        assert.equal(result.mnemonic, undefined)
    })
})
// 获取账户列表
describe('get_account_list', () => {
    it('normal', () => {
        const result = wallet.getAccountList()
        assert.equal(result, testStorage.memory.ACCOUNT_LIST)
    })
})
// 交易签名
describe('tx_sign', () => {
    it('normal', () => {
        const txConfig = {
            chainID: 100,
            from: 'Lemo83YZQ7Z77QS744FWSD4BQ3YBCF222ACTWFRQ',
            to: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            amount: '1000',
        }
        const password = '123AbC789'
        let a = wallet.sign('Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ', txConfig, password)
        a = JSON.parse(a)
        assert.equal(a.from, txConfig.from)
        assert.equal(a.amount, txConfig.amount)
    })
})
// 修改密码
describe('modify_password', () => {
    it('modify_success', () => {
        const oldPwd = '123AbC789'
        const newPwd = '111111111'
        const result = wallet.modifyPassword(oldPwd, newPwd)
        console.log(result)
        // assert.equal(result, testStorage.memory.ACCOUNT_LIST)
    })
})

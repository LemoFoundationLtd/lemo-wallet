import {assert} from 'chai'
import LemoTx from 'lemo-tx'
import LemoWallet from '../lib'
import {ACCOUNT_LIST, PASSWORD_HASH} from '../lib/const'
import errors from '../lib/errors'
import {testData} from './data'

function copyObj(v) {
    if (!v) {
        return v
    }
    return JSON.parse(JSON.stringify(v))
}

const storage = {
    memorys: {
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

const wallet = new LemoWallet({storage})


// 保存密码
describe('utils_savePassword', () => {
    it('save success', () => {
        const passw = testData.testDecodePwd
        const result = wallet.setupPassword(passw)
        assert.equal(result, undefined)
    })
})
// 创建账户
describe('create_account', () => {
    it('normal', () => {
        const password = testData.testDecodePwd
        const a = wallet.createAccount('hello', password)
        assert.equal(a.addressName, 'hello')
        const aa = wallet.getAccountList()
        assert.equal(aa[0].address, a.address)
    })
})
// 导入助记词
describe('import_mnemonic', () => {
    it('mnemonic_isArray', () => {
        const password = '123AbC789'
        const mnemonic = ['minor', 'half', 'image', 'census', 'endless', 'save', 'wreck', 'fork', 'key', 'wear', 'famous', 'mail']
        const name = 'hello'
        const result = wallet.importMnemonic(mnemonic, name, password)
        assert.equal(result.address, 'Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ')
        assert.deepEqual(result.mnemonic, mnemonic)
    })
    it('mnemonic_is_string', () => {
        const password = testData.testDecodePwd
        const mnemonic = testData.testDecode.mnemonic
        const name = testData.testDecode.addressName
        const result = wallet.importMnemonic(mnemonic, name, password)
        assert.deepEqual(result.mnemonic, mnemonic.split(' '))
    })
})
// 导入私钥
describe('import_private', () => {
    it('empty_hhh', () => {
        const password = '123AbC789'
        const priv = '0xb16043f818288c75627feb6ec52eb6246bfbf5dda2ce0055e499850423919a32'
        const name = 'hhh'
        const result = wallet.importPrivate(priv, name, password)
        assert.equal(result.privKey, priv)
        assert.equal(result.addressName, name)
    })
    it('privkey_error', () => {
        const password = '123AbC789'
        const priv = '0xb16043f818288c75627feb6ec52eb6246bfbf5dda2ce0055e49989a32'
        const name = 'hhh'
        assert.throws(() => {
            wallet.importPrivate(priv, name, password)
        }, errors.DecryptionError())
    })
})
// 导出助记词
describe('export_mnemonic', () => {
    it('empty_hhh', () => {
        const password = '123AbC789'
        const info = wallet.createAccount('hello', password)
        const address = info.address
        const mnemonic = info.mnemonic
        const result = wallet.exportMnemonic(address, password)
        assert.deepEqual(result, mnemonic)
    })
})
// 导出私钥
describe('export_private', () => {
    it('storage_no_address', () => {
        const password = '123AbC789'
        const info = wallet.createAccount('hello', password)
        const address = info.address
        const result = wallet.exportPrivateKey(address, password)
        assert.equal(result, info.privKey)
    })
})
// 获取账户列表
describe('get_account_list', () => {
    it('normal', () => {
        const result = wallet.getAccountList()
        const json = JSON.parse(storage.memorys[ACCOUNT_LIST])
        assert.deepEqual(result[0].address, json[0].address)
    })
    it('no_list', () => {
        storage.memorys[ACCOUNT_LIST] = '[]'
        const result = wallet.getAccountList()
        assert.deepEqual(result, [])
    })
})
// 交易签名
describe('tx_sign', () => {
    it('normal', () => {
        const password = '123AbC789'
        const info = wallet.createAccount('hello', password)
        const address = info.address
        const txConfig = {
            chainID: 100,
            from: 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q',
            to: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            amount: '1000',
        }
        const signedTx = wallet.sign(address, txConfig, password)
        assert.equal(signedTx.from, txConfig.from)
        assert.equal(signedTx.amount, txConfig.amount)
    })
    it('sign_createTransferAsset', () => {
        const txConfig = {
            chainID: 100,
            from: 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q',
            to: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            amount: '1000',
        }
        const info1 = {
            assetId: '0x14f7e16b4fcfcb6007c23827e686f4dc8c84bfcce12d4feef22804e9b9689947',
            transferAmount: '1000000',
        }
        const unsigned = LemoTx.createTransferAsset(txConfig, info1)
        const password = '123AbC789'
        const info = wallet.createAccount('hello', password)
        const address = info.address
        const signedTx = wallet.sign(address, unsigned, password)
        assert.equal(signedTx.from, txConfig.from)
        assert.equal(signedTx.amount, '0')
    })
    it('no_chainID', () => {
        const password = '123AbC789'
        const info = wallet.createAccount('hello', password)
        const address = info.address
        const txConfig = {
            from: 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q',
            to: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            amount: '1000',
        }
        assert.throws(() => {
            wallet.sign(address, txConfig, password)
        }, errors.TXInvalidChainID())
    })
})

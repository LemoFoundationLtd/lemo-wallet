import PwdStorage from '../../lib/storage/password_storage'
import {ACCOUNT_LIST, PASSWORD_HASH} from '../../lib/const'

const storage = {
    memorys: {
        [ACCOUNT_LIST]: [
            {
                privKey:
                    'U2FsdGVkX19JsPcOwWnX1UVeI21dY5KPO0+FnbXa6TqAs4DXkbVUC4XGJVnnilrToS35zBkrsne+ZskCf9q7/SDC7eb8E1RF7YBLHpdFB4N0dIqEfJmT0QSnbo+DR8NM',
                address: 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q',
                mnemonic:
                    'U2FsdGVkX1/PwGnDnuIFwZY0RJUk3wNLHmpTGtBAZmbEr01U+qvEt8Ug2Hx6ZuyifM2kR5b1RjY0lJZAcFOzczE2JlPkHISpEuI/vJ56NQVXXQ1qFXX60JFidMwX91wY',
                addressName: 'hello',
                path: 'm/44\'/60\'/0\'/0',
            },
        ],
        [PASSWORD_HASH]: '8574dcb5f69e1303cdaf0dc8eae797a9bdc5af09f3e8784165165e93a0019c10', // 123AbC789
    },
    setItem(k, v) {
        this.memorys[k] = copyObj(v)
    },
    getItem(k) {
        return copyObj(this.memorys[k])
    },
}

function copyObj(v) {
    return JSON.parse(JSON.stringify(v))
}

const passWord = new PwdStorage(storage)

// 保存密码
describe('password_modifyPassword', () => {
    it('success', () => {
        const passw = '123AbC789'
        const newPwd = '11111111'
        const result = passWord.modifyPassword(passw, newPwd)
    })
})

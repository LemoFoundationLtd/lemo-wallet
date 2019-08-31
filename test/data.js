import {ACCOUNT_LIST, PASSWORD_HASH} from '../lib/const'

function copyObj(v) {
    return JSON.parse(JSON.stringify(v))
}

export const testData = {
    testenCode: {
        privKey:
            'U2FsdGVkX19E0h17Y2dqcLra30FgPy79GdKnGMdvEVKvDL2k0Ve1hFK4EPKDq+cJJwxMX2IG8KJhTN3JqrRIwL4RI6Xiq3tWioNKsxScQq9X8cQn2prblWvBrmeSZsAL',
        address: 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q',
        mnemonic:
            'U2FsdGVkX1/TQI6vcK/OXAfUHgy/XsdYnMPAADurRoI/YDDPUqiGC06D4xhihAmFoc7VRe2a1CSaAhCK0IwpuBlLkiaFchoXkbv4hjjTY62DZh+3w6vDTRfGSOdFRQ1w',
        addressName: 'hello',
        path: 'm/44\'/60\'/0\'/0'},
    testDecode: {
        privKey:
            '0xb14d625287b2c2c02c860da9cea763f2433360e732147a13ed0a9647edd78b7d',
        address: 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q',
        mnemonic:
            'certain blade someone unusual time clarify minute airport long claw roast wink',
        addressName: 'hello',
        path: 'm/44\'/60\'/0\'/0',
    },
    testEncodePwd: '8574dcb5f69e1303cdaf0dc8eae797a9bdc5af09f3e8784165165e93a0019c10',
    testDecodePwd: '123AbC789',
}

export const storage = {
    memorys: {
        [ACCOUNT_LIST]: JSON.stringify([testData.testenCode]),
        [PASSWORD_HASH]: '8574dcb5f69e1303cdaf0dc8eae797a9bdc5af09f3e8784165165e93a0019c10', // 123AbC789
    },
    setItem(k, v) {
        this.memorys[k] = copyObj(v)
    },
    getItem(k) {
        return copyObj(this.memorys[k])
    },
}

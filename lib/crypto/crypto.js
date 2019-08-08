import {Buffer} from 'safe-buffer'
import keccak from 'keccak'
import BigNumber from 'bignumber.js'
import elliptic from 'elliptic'
import baseX from 'base-x'
import LemoClient from 'lemo-client'
import CryptoJs from 'crypto-js'
import secp256k1 from './secp256k1/index'
import messages from './secp256k1/messages'

const ec = new (elliptic.ec)('secp256k1') // eslint-disable-line
const N = secp256k1.N
const ADDRESS_LOGO = 'Lemo'

export const ADDRESS_VERSION = 1
const BASE26_ALPHABET = '83456729ABCDFGHJKNPQRSTWYZ'
const BASE26_0 = BASE26_ALPHABET[0]
const base26 = baseX(BASE26_ALPHABET)

/**
 * Decode public key to LemoChain address
 * @param {Buffer} pubKey
 * @return {string}
 */
export function pubKeyToAddress(pubKey) {
    const addressBin = Buffer.concat([Buffer.from([ADDRESS_VERSION]), keccak256(pubKey.slice(1)).slice(0, 19)])
    return encodeAddress(addressBin)
}

/**
 * sha3
 * @param {Buffer} data
 * @return {Buffer}
 */
function keccak256(data) {
    return keccak('keccak256').update(data).digest()
}

/**
 * sha3
 * @param {string} value
 * @param {string} salt
 * @return {string}
 */
export function hashWithSalt(value, salt) {
    return keccak256(Buffer.from(salt + value)).toString('hex')
}

export function privateToAddress(privKey) {
    privKey = LemoClient.toBuffer(privKey)
    const privNum = new BigNumber(privKey)
    if (privNum.gt(N) || privNum.isZero()) {
        throw new Error(messages.EC_PUBLIC_KEY_CREATE_FAIL)
    }

    const ecKey = ec.keyFromPrivate(privKey);
    const pub = Buffer.from(ecKey.getPublic().encode())
    return pubKeyToAddress(pub)
}

/**
 * Encode hex address to LemoChain address
 * @param {string|Buffer} data
 * @return {string}
 */
export function encodeAddress(data) {
    data = LemoClient.toBuffer(data)

    let checkSum = 0
    for (let i = 0; i < data.length; i++) {
        checkSum ^= data[i]
    }

    const fullPayload = Buffer.concat([data, Buffer.from([checkSum])])

    let encoded = base26.encode(fullPayload)
    while (encoded.length < 36) {
        encoded = BASE26_0 + encoded
    }

    return ADDRESS_LOGO + encoded
}

/**
 * Encrypt with AES algorithm
 * @param {string} message
 * @param {string} key
 * @return {string} Base64
 */
export function aesEncrypt(message, key) {
    return CryptoJs.AES.encrypt(message, key).toString();
}

/**
 * Decrypt with AES algorithm
 * @param {string} cipherText
 * @param {string} key
 * @return {string} Base64
 */
export function aesDecrypt(cipherText, key) {
    return CryptoJs.AES.decrypt(cipherText, key).toString(CryptoJs.enc.Utf8)
}

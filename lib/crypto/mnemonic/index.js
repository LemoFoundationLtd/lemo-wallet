import * as HDKey from 'hdkey';
import {Buffer} from 'safe-buffer';
import {ETHEREUM_PATH} from '../../const';

const createHash = require('create-hash');
const pbkdf2_1 = require('pbkdf2');
const DEFAULT_WORDLIST = require('./english');

const INVALID_ENTROPY = 'Invalid entropy';

function lpad(str, padString, length) {
    while (str.length < length) str = padString + str;
    return str;
}

function binaryToByte(bin) {
    return parseInt(bin, 2);
}

function bytesToBinary(bytes) {
    return bytes.map(x => lpad(x.toString(2), '0', 8)).join('');
}

function deriveChecksumBits(entropyBuffer) {
    const ENT = entropyBuffer.length * 8;
    const CS = ENT / 32;
    const hash = createHash('sha256')
        .update(entropyBuffer)
        .digest();
    return bytesToBinary([...hash]).slice(0, CS);
}

function salt(password) {
    return `mnemonic${password || ''}`;
}

function entropyToMnemonic(entropy) {
    if (!Buffer.isBuffer(entropy)) {
        entropy = Buffer.from(entropy, 'hex');
    }
    const wordlist = DEFAULT_WORDLIST.default;
    // 128 <= ENT <= 256
    if (entropy.length < 16 || entropy.length > 32 || entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    const entropyBits = bytesToBinary([...entropy]);
    const checksumBits = deriveChecksumBits(entropy);
    const bits = entropyBits + checksumBits;
    const chunks = bits.match(/(.{1,11})/g);
    return chunks.map((binary) => {
        const index = binaryToByte(binary);
        return wordlist[index];
    });
}

/**
 * @param {string} mnemonic
 * @param {string, optional} password
 * @return {HDKey}
 */
function mnemonicToSeedSync(mnemonic, password) {
    const mnemonicBuffer = Buffer.from((mnemonic || ''), 'utf8');
    const saltBuffer = Buffer.from(salt(password || ''), 'utf8');
    return pbkdf2_1.pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
}

function randomBytes(size) {
    const numArr = new Array(size).fill(0).map(() => Math.floor(Math.random() * 256))
    return Buffer.from(numArr)
}
/**
 * @return {Array<string>}
 */
export function generateMnemonic() {
    return entropyToMnemonic(randomBytes(128 / 8));
}

/**
 * @param {string} mnemonic words separated by space
 * @return {string} private key starts with 0x
 */
export function mnemonicToPrivate(mnemonic) {
    const hdKey = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic))
    // Get the first private key
    const privKey = hdKey.derive(`${ETHEREUM_PATH.path}/0`).privateKey
    return `0x${Buffer.from(privKey).toString('hex')}`
}

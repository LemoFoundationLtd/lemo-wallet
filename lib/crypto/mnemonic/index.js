const createHash = require('create-hash');
const pbkdf2_1 = require('pbkdf2');
const randomBytes = require('randombytes');
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
    const words = chunks.map((binary) => {
        const index = binaryToByte(binary);
        return wordlist[index];
    });
    return words.join(' ');
}

export function mnemonicToSeedSync(mnemonic, password) {
    const mnemonicBuffer = Buffer.from((mnemonic || '').normalize('NFKD'), 'utf8');
    const saltBuffer = Buffer.from(salt((password || '').normalize('NFKD')), 'utf8');
    return pbkdf2_1.pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
}

export function generateMnemonic() {
    return entropyToMnemonic(randomBytes(128 / 8));
}

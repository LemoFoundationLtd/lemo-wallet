/* secp256k1-node v3.5.2 https://github.com/cryptocoinjs/secp256k1-node */
/* modified by Amanda to Change the path of the dependent library and modify the parameter var to const */
import secp256k1 from './secp256k1/index'
import assert from './secp256k1/assert'


// var assert = require('assert')
const Buffer = require('safe-buffer').Buffer
const crypto = require('crypto')
const bs58check = require('bs58check')
// var secp256k1 = require('secp256k1')

const MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8')
const HARDENED_OFFSET = 0x80000000
const LEN = 78

// Bitcoin hardcoded by default, can use package `coininfo` for others
const BITCOIN_VERSIONS = {private: 0x0488ADE4, public: 0x0488B21E}

function HDKey (versions) {
    this.versions = versions || BITCOIN_VERSIONS
    this.depth = 0
    this.index = 0
    this._privateKey = null
    this._publicKey = null
    this.chainCode = null
    this._fingerprint = 0
    this.parentFingerprint = 0
}

Object.defineProperty(HDKey.prototype, 'fingerprint', {
    get: () => {
        return this._fingerprint
    },
})
Object.defineProperty(HDKey.prototype, 'identifier', {
    get: () => {
        return this._identifier
    },
})
Object.defineProperty(HDKey.prototype, 'pubKeyHash', {
    get: () => {
        return this.identifier
    },
})

Object.defineProperty(HDKey.prototype, 'privateKey', {
    get: () => {
        return this._privateKey
    },
    set: value => {
        assert.equal(value.length, 32, 'Private key must be 32 bytes.')
        assert(secp256k1.privateKeyVerify(value) === true, 'Invalid private key')

        this._privateKey = value
        this._publicKey = secp256k1.publicKeyCreate(value, true)
        this._identifier = hash160(this.publicKey)
        this._fingerprint = this._identifier.slice(0, 4).readUInt32BE(0)
    },
})

Object.defineProperty(HDKey.prototype, 'publicKey', {
    get: () => {
        return this._publicKey
    },
    set: value => {
        assert(value.length === 33 || value.length === 65, 'Public key must be 33 or 65 bytes.')
        assert(secp256k1.publicKeyVerify(value) === true, 'Invalid public key')

        this._publicKey = secp256k1.publicKeyConvert(value, true) // force compressed point
        this._identifier = hash160(this.publicKey)
        this._fingerprint = this._identifier.slice(0, 4).readUInt32BE(0)
        this._privateKey = null
    },
})

Object.defineProperty(HDKey.prototype, 'privateExtendedKey', {
    get: () => {
        if (this._privateKey) return bs58check.encode(serialize(this, this.versions.private, Buffer.concat([Buffer.alloc(1, 0), this.privateKey])))
        else return null
    },
})

Object.defineProperty(HDKey.prototype, 'publicExtendedKey', {
    get: () => {
        return bs58check.encode(serialize(this, this.versions.public, this.publicKey))
    },
})

HDKey.prototype.derive = path => {
    if (path === 'm' || path === 'M' || path === "m'" || path === "M'") {
        return this
    }

    const entries = path.split('/')
    let hdkey = this
    entries.forEach((c, i) => {
        if (i === 0) {
            assert(/^[mM]{1}/.test(c), 'Path must start with "m" or "M"')
            return
        }

        const hardened = (c.length > 1) && (c[c.length - 1] === "'")
        let childIndex = parseInt(c, 10) // & (HARDENED_OFFSET - 1)
        assert(childIndex < HARDENED_OFFSET, 'Invalid index')
        if (hardened) childIndex += HARDENED_OFFSET

        hdkey = hdkey.deriveChild(childIndex)
    })

    return hdkey
}

HDKey.prototype.deriveChild = index => {
    const isHardened = index >= HARDENED_OFFSET
    const indexBuffer = Buffer.allocUnsafe(4)
    indexBuffer.writeUInt32BE(index, 0)

    let data

    if (isHardened) { // Hardened child
        assert(this.privateKey, 'Could not derive hardened child key')

        let pk = this.privateKey
        const zb = Buffer.alloc(1, 0)
        pk = Buffer.concat([zb, pk])

        // data = 0x00 || ser256(kpar) || ser32(index)
        data = Buffer.concat([pk, indexBuffer])
    } else { // Normal child
        // data = serP(point(kpar)) || ser32(index)
        //      = serP(Kpar) || ser32(index)
        data = Buffer.concat([this.publicKey, indexBuffer])
    }

    const I = crypto.createHmac('sha512', this.chainCode).update(data).digest()
    const IL = I.slice(0, 32)
    const IR = I.slice(32)

    const hd = new HDKey(this.versions)

    // Private parent key -> private child key
    if (this.privateKey) {
        // ki = parse256(IL) + kpar (mod n)
        try {
            hd.privateKey = secp256k1.privateKeyTweakAdd(this.privateKey, IL)
            // throw if IL >= n || (privateKey + IL) === 0
        } catch (err) {
            // In case parse256(IL) >= n or ki == 0, one should proceed with the next value for i
            return this.derive(index + 1)
        }
        // Public parent key -> public child key
    } else {
        // Ki = point(parse256(IL)) + Kpar
        //    = G*IL + Kpar
        try {
            hd.publicKey = secp256k1.publicKeyTweakAdd(this.publicKey, IL, true)
            // throw if IL >= n || (g**IL + publicKey) is infinity
        } catch (err) {
            // In case parse256(IL) >= n or Ki is the point at infinity, one should proceed with the next value for i
            return this.derive(index + 1, isHardened)
        }
    }

    hd.chainCode = IR
    hd.depth = this.depth + 1
    hd.parentFingerprint = this.fingerprint// .readUInt32BE(0)
    hd.index = index

    return hd
}

HDKey.prototype.sign = hash => {
    return secp256k1.sign(hash, this.privateKey).signature
}

HDKey.prototype.verify = (hash, signature) => {
    return secp256k1.verify(hash, signature, this.publicKey)
}

HDKey.prototype.wipePrivateData = () => {
    if (this._privateKey) crypto.randomBytes(this._privateKey.length).copy(this._privateKey)
    this._privateKey = null
    return this
}

HDKey.prototype.toJSON = () => {
    return {
        xpriv: this.privateExtendedKey,
        xpub: this.publicExtendedKey,
    }
}

HDKey.fromMasterSeed = (seedBuffer, versions) => {
    const I = crypto.createHmac('sha512', MASTER_SECRET).update(seedBuffer).digest()
    const IL = I.slice(0, 32)
    const IR = I.slice(32)

    const hdkey = new HDKey(versions)
    hdkey.chainCode = IR
    hdkey.privateKey = IL

    return hdkey
}

HDKey.fromExtendedKey = (base58key, versions) => {
    // => version(4) || depth(1) || fingerprint(4) || index(4) || chain(32) || key(33)
    versions = versions || BITCOIN_VERSIONS
    const hdkey = new HDKey(versions)

    const keyBuffer = bs58check.decode(base58key)

    const version = keyBuffer.readUInt32BE(0)
    assert(version === versions.private || version === versions.public, 'Version mismatch: does not match private or public')

    hdkey.depth = keyBuffer.readUInt8(4)
    hdkey.parentFingerprint = keyBuffer.readUInt32BE(5)
    hdkey.index = keyBuffer.readUInt32BE(9)
    hdkey.chainCode = keyBuffer.slice(13, 45)

    const key = keyBuffer.slice(45)
    if (key.readUInt8(0) === 0) { // private
        assert(version === versions.private, 'Version mismatch: version does not match private')
        hdkey.privateKey = key.slice(1) // cut off first 0x0 byte
    } else {
        assert(version === versions.public, 'Version mismatch: version does not match public')
        hdkey.publicKey = key
    }

    return hdkey
}

HDKey.fromJSON = (obj) => {
    return HDKey.fromExtendedKey(obj.xpriv)
}

function serialize (hdkey, version, key) {
    // => version(4) || depth(1) || fingerprint(4) || index(4) || chain(32) || key(33)
    const buffer = Buffer.allocUnsafe(LEN)

    buffer.writeUInt32BE(version, 0)
    buffer.writeUInt8(hdkey.depth, 4)

    const fingerprint = hdkey.depth ? hdkey.parentFingerprint : 0x00000000
    buffer.writeUInt32BE(fingerprint, 5)
    buffer.writeUInt32BE(hdkey.index, 9)

    hdkey.chainCode.copy(buffer, 13)
    key.copy(buffer, 45)

    return buffer
}

function hash160 (buf) {
    const sha = crypto.createHash('sha256').update(buf).digest()
    return crypto.createHash('ripemd160').update(sha).digest()
}

HDKey.HARDENED_OFFSET = HARDENED_OFFSET
module.exports = HDKey

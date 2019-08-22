# LemoChain Wallet
[![npm](https://img.shields.io/npm/v/lemo-wallet.svg?style=flat-square)](https://www.npmjs.com/package/lemo-wallet)
[![Build Status](https://travis-ci.org/LemoFoundationLtd/lemo-wallet.svg?branch=master)](https://travis-ci.org/LemoFoundationLtd/lemo-wallet)
[![Coverage Status](https://coveralls.io/repos/github/LemoFoundationLtd/lemo-wallet/badge.svg?branch=master)](https://coveralls.io/github/LemoFoundationLtd/lemo-wallet?branch=master)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-wallet/blob/master/LICENSE)

This is the LemoChain Wallet library which is used to manage private keys.


[中文版](https://github.com/LemoFoundationLtd/lemo-wallet/blob/master/README_ZH.md)  
[English](https://github.com/LemoFoundationLtd/lemo-wallet/blob/master/README.md)

## Installing

### Using Yarn

```bash
yarn add lemo-wallet
```

### As Browser module

* Include `lemo-wallet.js` in your html file.
* Use the `LemoWallet` object directly from global namespace

## Example

```js
const LemoWallet = require('lemo-wallet')
const wallet = new LemoWallet({})
```

##lemoWallet API

| API                                                                        | description                         
| -------------------------------------------------------------------------- | ------------------------------ |
| [wallet.setupPassword(password)](#wallet-setupPassword)         | Setup wallet password       |
| [wallet.createAccount(addressName, password)](#wallet-createAccount)         | Create account       |
| [wallet.importMnemonic(mnemonic, addressName, password)](#wallet-importMnemonic)         | Restore the account information by import mnemonic words       |
| [wallet.importPrivate(privKey, addressName, password)](#wallet-importPrivate)         | Restore the account information by import the private key       |
| [wallet.exportMnemonic(address, password)](#wallet-exportMnemonic)         | Export mnemonic words       |
| [wallet.exportPrivateKey(address, password)](#wallet-exportPrivateKey)         | Export the private key       |
| [wallet.getAccountList()](#wallet-getAccountList)         | Load the account list       |
| [wallet.sign(address, txConfig, password)](#wallet-sign)         | Sign transaction       |
| [wallet.signAsset(address, txConfig, transferAssetInfo, password)](#wallet-signAsset)         | A shortcut to create and sign asset transaction       |
| [wallet.modifyPassword(oldPassword, newPassword)](#wallet-modifyPassword)         | Modify password       |
| [wallet.deleteAccount(address, password)](#wallet-deleteAccount)         | Delete account information       |



## Developing

### Requirements

* Node.js
* yarn

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install yarn
```
## data structure

<a name="data-structure-account"></a>

#### account

account information

```json
{
    "address": "Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D",
    "addressName": "hello",
    "privateKey": "U2FsdGVkX19E0h17Y2dqcLra30FgPy79GdKnGMdvEVKvDL2k0Ve1hFK4EPKDq+cJJwxMX2IG8KJhTN3JqrRIwL4RI6Xiq3tWioNKsxScQq9X8cQn2prblWvBrmeSZsAL",
    "mnemonic": "U2FsdGVkX1/TQI6vcK/OXAfUHgy/XsdYnMPAADurRoI/YDDPUqiGC06D4xhihAmFoc7VRe2a1CSaAhCK0IwpuBlLkiaFchoXkbv4hjjTY62DZh+3w6vDTRfGSOdFRQ1w",
    "basePath": "m/44\'/60\'/0\'/0",
}
```

-   `address` lemoChain address
-   `addressName` account name
-   `privateKey` private key, Save as encrypted private key information
-   `mnemonic` mnemonic, consists of 12 words, encrypted and stored locally to the user
-   `basePath` path, path to generate the private key


## API

<a name="wallet-setupPassword"></a>

#### wallet.setupPassword

```
wallet.setupPassword(password)
```

Create and save the password and store the encrypted password to storage

##### Parameters

1. `string` - The password set by the user

##### Returns

None

##### Example

```js
const pwd = '12345678'
wallet.setupPassword(pwd)
```

---

<a name="wallet-createAccount"></a>

#### wallet.createAccount

```
wallet.createAccount(addressName, password)
```

Create account and return the generated account information.

##### Parameters

1. `string` - account name
2. `string` - The password that passed in the [setupPassword](#wallet-setupPassword)

##### Returns

`object` - Return account information. Details refer to[account Information](#data-structure-account)

##### Example

```js
const password = '123AbC789'
const result = wallet.createAccount('hello', password)
console.log(JSON.stringify(result)) // {"privKey":"0xf9d8b666237ad79877cb8356c97f3aaa503700bb37a9c19767e97f059f0f9594","address":"Lemo83ZS6A5JFYQCHJJSZSSDKP2H26Z5FFRR5447","mnemonic":"reject job eight parade push miss honey leave pact genuine ivory put","addressName":"hello","path":"m/44'/60'/0'/0"}
```

---

<a name="wallet-importMnemonic"></a>

#### wallet.importMnemonic

```
wallet.importMnemonic(mnemonic, addressName, password)
```

Import mnemonic words, restore the account information

##### Parameters

1. `string|array` - mnemonic
2. `string` - addressName
2. `string` - The password that passed in the [setupPassword](#wallet-setupPassword)

##### Returns

`object` - Return account information. Details refer to[account Information](#data-structure-account)

##### Example

```js
const password = '123AbC789'
const mnemonic = ['minor', 'half', 'image', 'census', 'endless', 'save', 'wreck', 'fork', 'key', 'wear', 'famous', 'mail']
const addressName = 'hello'
const result = wallet.importMnemonic(mnemonic, addressName, password)
console.log(JSON.stringify(result)) // {"privKey":"0xb16043f818288c75627feb6ec52eb6246bfbf5dda2ce0055e499850423919a32","address":"Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ","mnemonic":["minor","half","image","census","endless","save","wreck","fork","key","wear","famous","mail"],"addressName":"hello","path":"m/44'/60'/0'/0"}
```

---

<a name="wallet-importPrivate"></a>

#### wallet.importPrivate

```
wallet.importPrivate(privKey, addressName, password)
```

Import the private key, restore the account information

##### Parameters

1. `string` - privKey
2. `string` - addressName
3. `string` - The password that passed in the [setupPassword](#wallet-setupPassword)

##### Returns

`object` - Return account information and no mnemonic. Details refer to[account Information](#data-structure-account)

##### Example

```js
const password = '123AbC789'
const priv = '0xb16043f818288c75627feb6ec52eb6246bfbf5dda2ce0055e499850423919a32'
const name = 'hhh'
const result = wallet.importPrivate(priv, name, password)
console.log(JSON.stringify(result)) // {"privKey":"0xb16043f818288c75627feb6ec52eb6246bfbf5dda2ce0055e499850423919a32","address":"Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ","addressName":"hhh","path":"m/44'/60'/0'/0"}
```

---

<a name="wallet-exportMnemonic"></a>

#### wallet.exportMnemonic

```
wallet.exportMnemonic(address, password)
```

Verify the user's password, find the user's locally stored account information through the account address, and export the mnemonic

##### Parameters

1. `string` - address
2. `string` - The password that passed in the [setupPassword](#wallet-setupPassword)

##### Returns

`array` - mnemonic

##### Example

```js
const password = '123AbC789'
const address = 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q'
const result = wallet.exportMnemonic(address, password)
console.log(result) // ['certain', 'blade', 'someone', 'unusual', 'time', 'clarify', 'minute', 'airport', 'long', 'claw', 'roast', 'wink']
```

---

<a name="wallet-exportPrivateKey"></a>

#### wallet.exportPrivateKey

```
wallet.exportPrivateKey(address, password)
```

Verify the user password, find the user's locally stored account information through the account address, and then export the private key

##### Parameters

1. `string` - address
2. `string` - The password that passed in the [setupPassword](#wallet-setupPassword)

##### Returns

`string` - PrivateKey

##### Example

```js
const password = '123AbC789'
const address = 'Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ'
const result = wallet.exportPrivateKey(address, password)
console.log(result) //"0xf9d8b666237ad79877cb8356c97f3aaa503700bb37a9c19767e97f059f0f9594"
```

---

<a name="wallet-getAccountList"></a>

#### wallet.getAccountList

```
wallet.getAccountList()
```

load account lists

##### Parameters

None

##### Returns

`array` - account list, it includes the following fields：
- `string` addressName
- `string` address

##### Example

```js
const result = wallet.getAccountList()
console.log(result) // [ { addressName: 'hello',address: 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q' }, {addressName: 'demo',address: 'Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ'} ]
```

---

<a name="wallet-sign"></a>

#### wallet.sign

```
wallet.sign(address, txConfig, password)
```

Verify the password, sign transaction

##### Parameters

1. `string` - address
2. `object` - The constructor params for [lemo-tx](https://github.com/LemoFoundationLtd/lemo-tx#constructor)
3. `string` - The password that passed in the [setupPassword](#wallet-setupPassword)

##### Returns

`string` - Sign information string

##### Example

```js
const txConfig = {
    chainID: 100,
    from: 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q',
    to: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
    amount: '1000',
}
const password = '123AbC789'
const address = 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q'
const result = wallet.sign(address, txConfig, password)// {"type":"0","version":"1","chainID":"100","from":"Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q","gasPrice":"3000000000","gasLimit":"2000000","amount":"1000","expirationTime":"1566352964","to":"Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG","sigs":["0xab17544ad52e965c71c67458911bb025020f58de0b147dd22f614347ac8bbe70121ef1c174860eebb7f63c8e0ec1c9f47e6e76851be08950c92bb8dec906e90301"],"gasPayerSigs":[]}
```

---

<a name="wallet-signAsset"></a>

#### wallet.signAsset

```
wallet.signAsset(address, txConfig, transferAssetInfo, password)
```

Verify passwords, sign asset transfer transaction

##### Parameters

1. `string` - address
2. `object` - The constructor params for [lemo-tx](https://github.com/LemoFoundationLtd/lemo-tx#constructor)
3. `object` - Transaction assets information which includes `assetID` and `transferAmount` fields
4. `string` - The password that passed in the [setupPassword](#wallet-setupPassword)

##### Returns

`string` - Signed information string

##### Example

```js
const password = '123AbC789'
const address = 'Lemo83QTS9H6DDWRC77SG774PF46TD46YA8RCBD7'
const txConfig = {
    chainID: 100,
    from: 'Lemo83QTS9H6DDWRC77SG774PF46TD46YA8RCBD7',
    to: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
    amount: '1000',
}
const transaferInfo = {assetId: '0xa458186f3f407e417196c388b11fa2517f2b9af0690671b8cd3d27ba6926280c', transferAmount: '2225'}
const result = wallet.signAsset(address, txConfig, transaferInfo, password)
console.log(JSON.stringify(a)) // {"type":"8","version":"1","chainID":"100","from":"Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1566368368","to":"Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG","data":"0x7b2261737365744964223a22307861343538313836663366343037653431373139366333383862313166613235313766326239616630363930363731623863643364323762613639323632383063222c227472616e73666572416d6f756e74223a2232323235227d","sigs":["0x0e1442ab0812dbacec4a47e9b7c3f26e7a7e368762069fc9fd7264e42ca7ff102d530985f23c5689a0a63343d2053bb1af179b8ff183f173351b0daf580a113200"],"gasPayerSigs":[]}
```

---

<a name="wallet-modifyPassword"></a>

#### wallet.modifyPassword

```
wallet.modifyPassword(oldPassword, newPassword)
```

Verify and change the password

##### Parameters

1. `string` - old password
2. `string` - new password

##### Returns

None

##### Example

```js
const oldPassword = '123AbC789'
const newPassword = 'aaaaaaa'
wallet.modifyPassword(oldPassword, newPassword)
```

---

<a name="wallet-deleteAccount"></a>

#### wallet.deleteAccount

```
wallet.deleteAccount(address, password)
```

Verify password and delete account information

##### Parameters

1. `string` - address
2. `string` - The password that passed in the [setupPassword](#wallet-setupPassword)

##### Returns

None

##### Example

```js
const address = 'Lemo83QTS9H6DDWRC77SG774PF46TD46YA8RCBD7'
const password = '123AbC789'
wallet.deleteAccount(address, password)
```

---


### Building

```bash
yarn build
```

### Testing

```bash
yarn test
```

## Licensing

LGPL-3.0

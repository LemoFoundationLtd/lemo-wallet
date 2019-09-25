# LemoChain Wallet
[![npm](https://img.shields.io/npm/v/lemo-wallet.svg?style=flat-square)](https://www.npmjs.com/package/lemo-wallet)
[![Build Status](https://travis-ci.org/LemoFoundationLtd/lemo-wallet.svg?branch=master)](https://travis-ci.org/LemoFoundationLtd/lemo-wallet)
[![Coverage Status](https://coveralls.io/repos/github/LemoFoundationLtd/lemo-wallet/badge.svg?branch=master)](https://coveralls.io/github/LemoFoundationLtd/lemo-wallet?branch=master)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-wallet/blob/master/LICENSE)

这是用于管理私钥的LemoChain钱包库。


[中文版](https://github.com/LemoFoundationLtd/lemo-wallet/blob/master/README_ZH.md)  
[English](https://github.com/LemoFoundationLtd/lemo-wallet/blob/master/README.md)

## 安装

### yarn

```bash
yarn add lemo-wallet
```

### 浏览器

* 在您的html文件中加入 `lemo-wallet.js`js文件
* 全局使用 `LemoWallet`对象

## Example

```js
const LemoWallet = require('lemo-wallet')
const wallet = new LemoWallet({storage: localStorage})
wallet.setupPassword('12345678')
const account = wallet.createAccount('my-wallet', '12345678')
const txConfig = {chainID: 1, to: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', amount: '100000000000000000000'}
const signedTx = wallet.sign(account.address, txConfig, '12345678')
console.log(signedTx.toString())
// send the signedTx by lemo client SDK
```

##lemoWallet API

| API                                                                        | 功能                         
| -------------------------------------------------------------------------- | ------------------------------ |
| [wallet.setupPassword(password)](#wallet-setupPassword)         | 设置钱包密码       |
| [wallet.createAccount(addressName, password)](#wallet-createAccount)         | 创建账户       |
| [wallet.importMnemonic(mnemonic, addressName, password)](#wallet-importMnemonic)         | 通过导入助记词还原账户信息       |
| [wallet.importPrivate(privKey, addressName, password)](#wallet-importPrivate)         | 通过导入私钥还原账户信息       |
| [wallet.exportMnemonic(address, password)](#wallet-exportMnemonic)         | 导出助记词       |
| [wallet.exportPrivateKey(address, password)](#wallet-exportPrivateKey)         | 导出私钥       |
| [wallet.getAccountList()](#wallet-getAccountList)         | 获取账户列表       |
| [wallet.sign(address, txConfig, password)](#wallet-sign)         | 签名交易       |
| [wallet.modifyPassword(oldPassword, newPassword)](#wallet-modifyPassword)         | 修改密码       |
| [wallet.deleteAccount(address, password)](#wallet-deleteAccount)         | 删除账户信息       |



## Developing

### Requirements

* Node.js
* yarn

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install yarn
```
## 数据结构

<a name="data-structure-account"></a>

#### account

账户信息

```json
{
    "address": "Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D",
    "addressName": "hello",
    "privateKey": "U2FsdGVkX19E0h17Y2dqcLra30FgPy79GdKnGMdvEVKvDL2k0Ve1hFK4EPKDq+cJJwxMX2IG8KJhTN3JqrRIwL4RI6Xiq3tWioNKsxScQq9X8cQn2prblWvBrmeSZsAL",
    "mnemonic": "U2FsdGVkX1/TQI6vcK/OXAfUHgy/XsdYnMPAADurRoI/YDDPUqiGC06D4xhihAmFoc7VRe2a1CSaAhCK0IwpuBlLkiaFchoXkbv4hjjTY62DZh+3w6vDTRfGSOdFRQ1w",
    "basePath": "m/44\'/60\'/0\'/0",
}
```

-   `address` lemo地址
-   `addressName` 账户名
-   `privateKey` 私钥，保存时为加密之后的私钥信息
-   `mnemonic` 助记词，由12个小写英文单词组成，加密之后存入storage
-   `basePath` 路径，主要为生成私钥的路径

<a name="data-structure-storage"></a>

#### storage

存储函数对象

-   `setItem(key, value)` 将数据保存到storage的函数，两个参数都是字符串
-   `getItem(key)` 通过key获取保存在storage中的数据，参数和返回值都是字符串

---

## 构造函数

```
wallet = new LemoWallet({
     storage: localStorage
})
```

-   `storage` 存储函数对象，在浏览器中为localStorage或sessionStorage


## API

<a name="wallet-setupPassword"></a>

#### wallet.setupPassword

```
wallet.setupPassword(password)
```

创建并保存密码，并将加密之后的密码存入storage

##### Parameters

1. `string` - 用户设置的密码

##### Returns

无返回值

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

生成账户，并返回生成的账户信息

##### Parameters

1. `string` - 账户名称
2. `string` - 通过[setupPassword](#wallet-setupPassword)设置进来的那个密码

##### Returns

`object` - 最后返回账户信息，细节参考[账户信息](#data-structure-account)

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

导入助记词，还原账户信息

##### Parameters

1. `string|array` - 助记词
2. `string` - 账户名称
3. `string` - 通过[setupPassword](#wallet-setupPassword)设置进来的那个密码

##### Returns

`object` - 生成账户信息，细节参考[账户信息](#data-structure-account)

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

导入私钥，还原账户信息

##### Parameters

1. `string` - 账户私钥
2. `string` - 账户名称
3. `string` - 通过[setupPassword](#wallet-setupPassword)设置进来的那个密码

##### Returns

`object` - 生成账户信息，细节参考[账户信息](#data-structure-account), 其中还原账户中无助记词

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

校验用户的密码，通过账户地址找到用户本地存储的账户信息，然后导出助记词

##### Parameters

1. `string` - 账户地址
3. `string` - 通过[setupPassword](#wallet-setupPassword)设置进来的那个密码

##### Returns

`array` - 助记词

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

校验用户密码，通过账户地址找到用户本地存储的账户信息，然后导出私钥

##### Parameters

1. `string` - 账户地址
3. `string` - 通过[setupPassword](#wallet-setupPassword)设置进来的那个密码

##### Returns

`string` - 私钥

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

获取账户列表

##### Parameters

无

##### Returns

`array` - 账户列表，包括以下字段：
- `string` addressName 账户名
- `string` address 账户地址

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

校验密码，签名交易

##### Parameters

1. `string` - 账户地址
2. `object` - [lemo-tx](https://github.com/LemoFoundationLtd/lemo-tx#constructor)的构造函数参数
3. `string` - 通过[setupPassword](#wallet-setupPassword)设置进来的那个密码

##### Returns

`LemoTx` - 签名后的交易对象

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

<a name="wallet-modifyPassword"></a>

#### wallet.modifyPassword

```
wallet.modifyPassword(oldPassword, newPassword)
```

校验并修改密码

##### Parameters

1. `string` - 旧密码
2. `string` - 新密码

##### Returns

无

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

校验密码，删除该地址下的账户信息

##### Parameters

1. `string` - 账户地址
3. `string` - 通过[setupPassword](#wallet-setupPassword)设置进来的那个密码

##### Returns

无

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

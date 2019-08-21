![Logo of the project](./logo.png)

# LemoChain Wallet
[![npm](https://img.shields.io/npm/v/lemo-wallet.svg?style=flat-square)](https://www.npmjs.com/package/lemo-wallet)
[![Build Status](https://travis-ci.org/LemoFoundationLtd/lemo-wallet.svg?branch=master)](https://travis-ci.org/LemoFoundationLtd/lemo-wallet)
[![Coverage Status](https://coveralls.io/repos/github/LemoFoundationLtd/lemo-wallet/badge.svg?branch=master)](https://coveralls.io/github/LemoFoundationLtd/lemo-wallet?branch=master)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-wallet/blob/master/LICENSE)

这是用于管理私钥的LemoChain钱包库。



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
const wallet = new LemoWallet({})
```

##lemoWallet API

| API                                                                        | 功能                         
| -------------------------------------------------------------------------- | ------------------------------ |
| [wallet.savePassword(password)](#submodule-wallet-savePassword)         | 保存钱包密码       |
| [wallet.createAccount(addressName, password)](#submodule-wallet-createAccount)         | 创建账户       |
| [wallet.importMnemonic(mnemonic, addressName, password)](#submodule-wallet-importMnemonic)         | 通过导入助记词还原账户信息       |
| [wallet.importPrivate(privKey, addressName, password)](#submodule-wallet-importPrivate)         | 通过导入私钥还原账户信息       |
| [wallet.exportMnemonic(address, password)](#submodule-wallet-exportMnemonic)         | 导出助记词       |
| [wallet.exportPrivateKey(address, password)](#submodule-wallet-exportPrivateKey)         | 导出私钥       |
| [wallet.getAccountList()](#submodule-wallet-getAccountList)         | 拉取账户列表       |
| [wallet.sign(address, txConfig, password)](#submodule-wallet-sign)         | 签名普通交易       |
| [wallet.signAsset(address, txConfig, transferAssetInfo, password)](#submodule-wallet-signAsset)         | 签名资产交易       |
| [wallet.modifyPassword(oldPassword, newPassword)](#submodule-wallet-modifyPassword)         | 修改密码       |
| [wallet.deleteAccount(address, password)](#submodule-wallet-deleteAccount)         | 删除账户信息       |



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
-   `mnemonic` 助记词，由12个单词组成，加密之后存储到用户本地
-   `basePath` 路径，主要为生成私钥的路径


## API

<a name="submodule-wallet-savePassword"></a>

#### wallet.savePassword

```
wallet.savePassword(password)
```

创建并保存密码，并将加密之后的密码存入用户本地

##### Parameters

1. `string` - 用户设置的密码

##### Returns

无返回值

##### Example

```js
const pwd = '12345678'
wallet.savePassword(pwd)
```

---

<a name="submodule-wallet-createAccount"></a>

#### wallet.createAccount

```
wallet.createAccount(addressName, password)
```

生成账户，并返回生成的账户信息，在生成账户信息之前需要校验密码是否相同

##### Parameters

1. `string` - 账户名称
2. `string` - 密码

##### Returns

`object` - 最后返回账户信息，细节参考[账户信息](#data-structure-account)

##### Example

```js
const password = '123AbC789'
const result = wallet.createAccount('hello', password)
console.log(JSON.stringify(result)) // {"privKey":"0xf9d8b666237ad79877cb8356c97f3aaa503700bb37a9c19767e97f059f0f9594","address":"Lemo83ZS6A5JFYQCHJJSZSSDKP2H26Z5FFRR5447","mnemonic":"reject job eight parade push miss honey leave pact genuine ivory put","addressName":"hello","path":"m/44'/60'/0'/0"}
```

---

<a name="submodule-wallet-importMnemonic"></a>

#### wallet.importMnemonic

```
wallet.importMnemonic(mnemonic, addressName, password)
```

校验密码是否正确，然后导入助记词，还原账户信息

##### Parameters

1. `string|array` - 助记词
2. `string` - 账户名称
3. `string` - 密码

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

<a name="submodule-wallet-importPrivate"></a>

#### wallet.importPrivate

```
wallet.importPrivate(privKey, addressName, password)
```

导入私钥，还原账户信息，在此之前需要校验密码

##### Parameters

1. `string` - 账户私钥
2. `string` - 账户名称
3. `string` - 密码

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

<a name="submodule-wallet-exportMnemonic"></a>

#### wallet.exportMnemonic

```
wallet.exportMnemonic(address, password)
```

校验用户的密码，通过账户地址找到用户本地存储的账户信息，然后导出助记词

##### Parameters

1. `string` - 账户地址
2. `string` - 密码

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

<a name="submodule-wallet-exportPrivateKey"></a>

#### wallet.exportPrivateKey

```
wallet.exportPrivateKey(address, password)
```

校验用户密码，通过账户地址找到用户本地存储的账户信息，然后导出私钥

##### Parameters

1. `string` - 账户地址
2. `string` - 密码

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

<a name="submodule-wallet-getAccountList"></a>

#### wallet.getAccountList

```
wallet.getAccountList()
```

拉取账户列表

##### Parameters

无

##### Returns

`array` - 账户列表，包括以下字段：
- `addressName` 账户名
- `address` 账户地址

##### Example

```js
const result = wallet.getAccountList()
console.log(result) // [ { addressName: 'hello',address: 'Lemo83S826GC446HF2FWQ2895FP8J7ARQTKRGG3Q' }, {addressName: 'demo',address: 'Lemo83B5737DA39JJHYJF8DBZ468S4GRAW7BNFAJ'} ]
```

---

<a name="submodule-wallet-sign"></a>

#### wallet.sign

```
wallet.sign(address, txConfig, password)
```

校验密码，签名普通交易

##### Parameters

1. `string` - 账户地址
2. `object` - 签名的交易信息
3. `string` - 密码

##### Returns

`string` - 签名信息字符串

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

<a name="submodule-wallet-signAsset"></a>

#### wallet.signAsset

```
wallet.signAsset(address, txConfig, transferAssetInfo, password)
```

校验密码，签名资产交易

##### Parameters

1. `string` - 账户地址
2. `object` - 签名的交易信息
3. `object` - 签名的资产信息
4. `string` - 密码

##### Returns

`string` - 签名信息字符串

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

<a name="submodule-wallet-modifyPassword"></a>

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

<a name="submodule-wallet-deleteAccount"></a>

#### wallet.deleteAccount

```
wallet.deleteAccount(address, password)
```

校验密码，删除该地址下的账户信息

##### Parameters

1. `string` - 账户地址
2. `string` - 密码

##### Returns

无

##### Example

```js
const address = 'Lemo83QTS9H6DDWRC77SG774PF46TD46YA8RCBD7'
const passWord = '123AbC789'
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

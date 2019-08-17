![Logo of the project](./logo.png)

# LemoChain Wallet
[![npm](https://img.shields.io/npm/v/lemo-wallet.svg?style=flat-square)](https://www.npmjs.com/package/lemo-wallet)
[![Build Status](https://travis-ci.org/LemoFoundationLtd/lemo-wallet.svg?branch=master)](https://travis-ci.org/LemoFoundationLtd/lemo-wallet)
[![Coverage Status](https://coveralls.io/repos/github/LemoFoundationLtd/lemo-wallet/badge.svg?branch=master)](https://coveralls.io/github/LemoFoundationLtd/lemo-wallet?branch=master)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-wallet/blob/master/LICENSE)

This is the LemoChain Wallet library which is used to manage private keys.



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

`object` - 最后返回账户信息，其中账户信息包括：
        - `address` 钱包的lemo地址
        - `mnemonic` 随机生成的助记词，助记词由12个单词组成
        - `privKey` 账户的私钥
        - `path` 路径
        - `addressName` 账户名称

##### Example

```js
const password = '123AbC789'
const a = wallet.createAccount('hello', password)
console.log(JSON.stringify(a)) // {"privKey":"0xf9d8b666237ad79877cb8356c97f3aaa503700bb37a9c19767e97f059f0f9594","address":"Lemo83ZS6A5JFYQCHJJSZSSDKP2H26Z5FFRR5447","mnemonic":"reject job eight parade push miss honey leave pact genuine ivory put","addressName":"hello","path":"m/44'/60'/0'/0"}
```

<a name="submodule-wallet-importMnemonic"></a>

#### wallet.importMnemonic

```
wallet.importMnemonic(mnemonic, addressName, password)
```

导入助记词，还原账户信息，在此之前需要校验密码

##### Parameters

1. `string` - 助记词
2. `string` - 账户名称
3. `string` - 密码

##### Returns

`object` - 生成账户信息，细节参考[账户信息](#submodule-wallet-createAccount)

##### Example

```js
const password = '123AbC789'
const a = wallet.createAccount('hello', password)
console.log(JSON.stringify(a)) // {"privKey":"0xf9d8b666237ad79877cb8356c97f3aaa503700bb37a9c19767e97f059f0f9594","address":"Lemo83ZS6A5JFYQCHJJSZSSDKP2H26Z5FFRR5447","mnemonic":"reject job eight parade push miss honey leave pact genuine ivory put","addressName":"hello","path":"m/44'/60'/0'/0"}
```


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

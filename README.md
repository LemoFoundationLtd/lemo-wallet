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



## Developing

### Requirements

* Node.js
* yarn

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install yarn
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

import Interface from './walletInterface/index'

class LemoWallet {
    constructor(config = {}) {
        this.config = {
        }
        this.storage = config.storage
        API(this)
    }
}

function API() {
    LemoWallet.createAccount = Interface.createAccount
    LemoWallet.initPassword = Interface.initPassword
    LemoWallet.verifyPassword = Interface.verifyPassword
    LemoWallet.importMnemonic = Interface.importMnemonic
    LemoWallet.importPrivate = Interface.importPrivate
    LemoWallet.exportMnemonic = Interface.exportMnemonic
    LemoWallet.exportPrivateKey = Interface.exportPrivateKey
    LemoWallet.getAccountList = Interface.getAccountList
    LemoWallet.modifyPassword = Interface.modifyPassword
    LemoWallet.deleteAccount = Interface.deleteAccount
    LemoWallet.sign = Interface.sign
}

export default LemoWallet

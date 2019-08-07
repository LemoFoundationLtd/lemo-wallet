export default {
    AccountNotExist: (address) => `Account ${address} is not existed`,
    MnemonicTypeError: () => 'Mnemonic must be 12 words',
    MnemonicLengthError: () => 'Mnemonic must be 12 words',
    DecryptionError: () => 'Password or private key error',
}

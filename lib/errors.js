export default {
    NoStorage: () => 'A storage with function "setItem" and "getItem" is required',
    WrongPassword: () => 'Wrong password',
    AccountNotExist: (address) => `Account ${address} is not existed`,
    MnemonicTypeError: () => 'Mnemonic must be 12 words',
    MnemonicLengthError: () => 'Mnemonic must be 12 words',
    DecryptionError: () => 'Password or private key error',
}

export default {
    // demo
    InvalidAPIDefinition: config => `invalid api config ${JSON.stringify(config)}`,
    InvalidAPIMethod: config => `should set only one property of 'value' or 'call' in api config: ${JSON.stringify(config)}`,
    UnavailableAPIName: name => `can not create api with name: ${name}, because this property is exist`,
    UnavailableAPIModule: moduleName => `can not create api into module: ${moduleName}, because this property is exist`,
    ValueMistake: (value) => `${value} mistake`,
    AccountNoValue: (value) => `This account does not have ${value}`,
}

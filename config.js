// ivairus nustatymai, kuriuos galima kaitalioti

const environments = {};

environments.dev = {
    httpPort: 3000,       // developmente
    envName: 'dev',
    hashingSecret: 'dummy-secret',     // uzkodavimo zodelis (salt)
    //changeNamePeriod: 60,            // kaip daznai keisti slaptazodi (sekundemis). Nera butina
}

environments.production = {
    httpPort: 5000,         //kai gyvai paleista sukasi anst port 5000
    envName: 'production',
    hashingSecret: 'super-secret-salt-for-production-please-change-it-before-using-it-thanks',
    //changeNamePeriod: 6000000,
}

const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';
const exportableEnvName = typeof environments[currentEnv] === 'object' ? currentEnv : 'dev';

module.exports = environments[exportableEnvName];
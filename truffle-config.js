require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { API_URL, MNEMONIC } = process.env;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        {
          return new HDWalletProvider(MNEMONIC, API_URL)
        },
      network_id: '3',
      gas: 4000000 
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: '^0.8.0',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

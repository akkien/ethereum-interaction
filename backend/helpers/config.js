const Web3 = require('web3');
const FULL_NODE =
  'https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1';
const web3 = new Web3(new Web3.providers.HttpProvider(FULL_NODE));

const PRIVATE_KEY =
  '8db71038d7607675d5871abaf043a69cd74fb256600f2dd00b0ad7169d405c25';
const MY_ADDRESS = '0x87C0E2fdb6AEC537b74c676909A5D9C70F69094A';

module.exports = {
  web3,
  FULL_NODE,
  PRIVATE_KEY,
  MY_ADDRESS
};

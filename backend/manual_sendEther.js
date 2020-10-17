const Web3 = require('web3');
const fullNodeHttp =
  'https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1';
const web3 = new Web3(new Web3.providers.HttpProvider(fullNodeHttp));

const { signTx } = require('./helpers');

var privateKey =
  '8db71038d7607675d5871abaf043a69cd74fb256600f2dd00b0ad7169d405c25';

const startApp = async () => {
  const nextNonce = await web3.eth.getTransactionCount(
    '0x87C0E2fdb6AEC537b74c676909A5D9C70F69094A'
  );

  const rawTx = {
    from: '0x87C0E2fdb6AEC537b74c676909A5D9C70F69094A',
    to: '0x5E4315DeD82f95c0CAda521C4B12767dF1375E2c',
    gasLimit: 5000000,
    gasPrice: 100 * 1000000000, //100 Gwei
    nonce: nextNonce,
    value: web3.utils.toHex(web3.utils.toWei('0.0001', 'ether'))
  };

  const signedTx = signTx(rawTx, privateKey);

  web3.eth
    .sendSignedTransaction(signedTx)
    .on('transactionHash', (hash) => {
      console.log('Hash:', hash);
    })
    .on('receipt', (receipt) => {
      console.log('Receipt:', receipt);
    });
};

startApp();

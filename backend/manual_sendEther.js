const {
  web3,
  PRIVATE_KEY,
  MY_ADDRESS,
  signTx,
  getCompiledContract
} = require('./helpers');

const startApp = async () => {
  const nextNonce = await web3.eth.getTransactionCount(MY_ADDRESS);

  const rawTx = {
    from: MY_ADDRESS,
    to: '0x5E4315DeD82f95c0CAda521C4B12767dF1375E2c',
    gasLimit: 5000000,
    gasPrice: 100 * 1000000000, //100 Gwei
    nonce: nextNonce,
    value: web3.utils.toHex(web3.utils.toWei('0.0001', 'ether'))
  };

  const signedTx = signTx(rawTx, PRIVATE_KEY);

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

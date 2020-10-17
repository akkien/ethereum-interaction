const EthereumTX = require('ethereumjs-tx');
const fs = require('fs');

const signTx = (rawTx, privateKey) => {
  const privKeyToSign = Buffer.from(privateKey, 'hex');

  var tx = new EthereumTX(rawTx, { chain: 'ropsten' });
  tx.sign(privKeyToSign);
  var serializedTx = tx.serialize();

  return '0x' + serializedTx.toString('hex');
};

const getCompiledContract = (contractPath) => {
  const compiledJson = fs.readFileSync(contractPath, 'utf-8');
  const compiledObj = JSON.parse(compiledJson);
  return compiledObj;
};

module.exports = {
  signTx,
  getCompiledContract
};

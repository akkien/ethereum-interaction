const axios = require('axios');
const Web3 = require('web3');
const fullNodeHttp =
  'https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1';
const web3 = new Web3(new Web3.providers.HttpProvider(fullNodeHttp));

const { signTx, getCompiledContract } = require('./helpers');

var privateKey =
  '8db71038d7607675d5871abaf043a69cd74fb256600f2dd00b0ad7169d405c25';
const compiledObj = getCompiledContract(__dirname + '/contracts/Storage.json');

const startApp = async () => {
  /** Get Tx Data to deploy contract **/
  const contract = new web3.eth.Contract(compiledObj.abi);
  const deployData = contract
    .deploy({
      data: compiledObj.bytecode,
      arguments: []
    })
    .encodeABI();

  /** Get nonce **/
  const nextNonce = await web3.eth.getTransactionCount(
    '0x87C0E2fdb6AEC537b74c676909A5D9C70F69094A'
  );

  // Tx to deploy do not has field 'to'
  // If contract can hold ether on deployment, tx must could has field 'value'
  const rawTx = {
    from: '0x87C0E2fdb6AEC537b74c676909A5D9C70F69094A',
    gasLimit: 5000000,
    gasPrice: 100 * 1000000000, //100 Gwei
    nonce: nextNonce,
    data: deployData
  };

  const signedTx = signTx(rawTx, privateKey);

  web3.eth.sendSignedTransaction(signedTx).on('transactionHash', (hash) => {
    //   console.log('Hash:', hash);
    // })
    // .on('receipt', (receipt) => {
    //console.log('DEPLOY SUCCESS:', receipt);

    /** Get contrac instance **/
    const contractAddress = '0x7a9f35fa006619bc4bc23969fdbc7f005d18929c'; // receipt.contractAddress;
    const contractInstance = new web3.eth.Contract(
      compiledObj.abi,
      contractAddress
    );

    /** Call function 'set' => send tx **/
    const data_functionStore = contractInstance.methods.store(30).encodeABI();
    const rawTxStore = {
      from: '0x87C0E2fdb6AEC537b74c676909A5D9C70F69094A',
      to: contractAddress,
      gasLimit: 5000000,
      gasPrice: 100 * 1000000000, //100 Gwei
      nonce: nextNonce + 1,
      data: data_functionStore
    };
    const signedTxStore = signTx(rawTxStore, privateKey);

    web3.eth
      .sendSignedTransaction(signedTxStore)
      .on('transactionHash', (hash) => {
        console.log('TX STORE:', hash);
      })
      .on('receipt', async (receipt) => {
        console.log('STORE DATA SUCCESS:', receipt);

        /** Now get the new value that we just store **/
        const data_functionGet = contractInstance.methods.get().encodeABI();
        const response = await axios.post(fullNodeHttp, {
          jsonrpc: '2.0',
          // Check RPC eth_call for its parameters
          method: 'eth_call',
          params: [
            {
              to: contractAddress,
              data: data_functionGet
            },
            'latest'
          ],
          id: 1
        });
        console.log('STORED NUMBER:', response.data.result);
      });
  });
};

startApp();

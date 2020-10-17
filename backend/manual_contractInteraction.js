const axios = require('axios');

let [mode, address, number] = process.argv.slice(2);
if (!mode) {
  console.log(
    'Missing argument. Please input all required arguments (mode, address, number)'
  );
  process.exit(1);
}

const {
  web3,
  FULL_NODE,
  PRIVATE_KEY,
  MY_ADDRESS,
  signTx,
  getCompiledContract
} = require('./helpers');
const compiledObj = getCompiledContract(__dirname + '/contracts/Storage.json');

const contract = new web3.eth.Contract(compiledObj.abi);

const getNonce = async (address) => {
  const nextNonce = await web3.eth.getTransactionCount(address);
  return nextNonce;
};

const deployContract = async () => {
  const nonce = await getNonce(MY_ADDRESS);

  /** Get Tx Data to deploy contract **/
  const deployData = contract
    .deploy({
      data: compiledObj.bytecode,
      arguments: []
    })
    .encodeABI();

  // Tx to deploy do not has field 'to'
  // If contract can hold ether on deployment, tx must could has field 'value'
  const rawTx = {
    from: '0x87C0E2fdb6AEC537b74c676909A5D9C70F69094A',
    gasLimit: 5000000,
    gasPrice: 100 * 1000000000, //100 Gwei
    nonce: nonce,
    data: deployData
  };

  const signedTx = signTx(rawTx, PRIVATE_KEY);

  web3.eth
    .sendSignedTransaction(signedTx)
    .on('transactionHash', (hash) => {
      console.log('DEPLOY TX:', hash);
    })
    .on('receipt', (receipt) => {
      console.log('DEPLOY SUCCESS:', receipt);
    });
};

const callContractFunction = async (contractAddress, numberToStore) => {
  const nonce = await getNonce(MY_ADDRESS);

  /** Call function 'set' => send tx **/
  const data_functionStore = contract.methods.store(numberToStore).encodeABI();
  const rawTxStore = {
    from: '0x87C0E2fdb6AEC537b74c676909A5D9C70F69094A',
    to: contractAddress,
    gasLimit: 5000000,
    gasPrice: 100 * 1000000000, //100 Gwei
    nonce: nonce,
    data: data_functionStore
  };
  const signedTxStore = signTx(rawTxStore, PRIVATE_KEY);

  web3.eth
    .sendSignedTransaction(signedTxStore)
    .on('transactionHash', (hash) => {
      console.log('TX STORE:', hash);
    })
    .on('receipt', async (receipt) => {
      console.log('STORE DATA SUCCESS:', receipt);

      /** Now get the new value that we just store **/
      const data_functionGet = contract.methods.get().encodeABI();

      const response = await axios.post(FULL_NODE, {
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
};

const startApp = async () => {
  if (mode === 'deploy') {
    deployContract();
  } else {
    if (!address || !number) {
      console.log(
        'Missing argument. Please input all required arguments (mode, address, number)'
      );
      process.exit(1);
    }
    number = Number(number);

    callContractFunction(address, number);
  }
};

startApp();

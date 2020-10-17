let compiledObj;
let contractInstance = null;
let userAccount = '';
let address;

window.addEventListener('load', async function () {
  if (typeof web3 !== 'undefined') {
    // If browser recognize web3, use current provider (e.g. metamask)
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        'https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1'
      )
    );
  }

  // Check and update userAccount if user change metamask account
  this.setInterval(async function () {
    if (web3.eth.accounts[0] !== userAccount) {
      //call ethereum.enable to ask Metamask unclock account
      const accounts = await ethereum.enable();
      userAccount = accounts[0];
    }
  }, 100);

  startApp();
});

async function startApp() {
  $.getJSON('./contracts/Storage.json', function (data) {
    compiledObj = data;
  });

  // DEPLOY NEW CONTRACT
  $('#btn-deploy').on('click', async function (event) {
    event.preventDefault();

    $this = $(this);
    var loadingText =
      '<i class="fa fa-circle-o-notch fa-spin"></i> Deploying contract ...';
    if ($(this).html() !== loadingText) {
      $this.data('original-text', $(this).html());
      $this.html(loadingText);
    }

    const contract = new web3.eth.Contract(compiledObj.abi);
    contract
      .deploy({
        data: compiledObj.bytecode,
        arguments: []
      })
      .send(
        { from: userAccount, gas: 5000000, gasPrice: 100 * 1000000000 },
        function (error, transactionHash) {}
      )
      .on('error', function (err) {
        $this.html($this.data('original-text'));
      })
      .on('transactionHash', function (hash) {
        console.log('DEPLOY TX:', hash);
      })
      .on('receipt', async function (receipt) {
        console.log('DEPLOY SUCCESS:', receipt);

        $this.html($this.data('original-text'));
        $('#contract-address').text(
          `Storage Address: ${receipt.contractAddress}`
        );

        contractInstance = new web3.eth.Contract(
          compiledObj.abi,
          receipt.contractAddress
        );
        const storedNumber = await contractInstance.methods.get().call();
        $('#op-number').text(storedNumber);
      });
  });

  // USING EXISTING CONTRACT
  $('#btn-get-contract').on('click', async function (event) {
    event.preventDefault();

    let contractAddress = $('#ip-address').val();
    if (!contractAddress) {
      alert('Please enter your contract address');
      return;
    }

    contractInstance = new web3.eth.Contract(compiledObj.abi, contractAddress);

    $('#contract-address').text(`Storage Address: ${contractAddress}`);

    const storedNumber = await contractInstance.methods.get().call();
    $('#op-number').text(storedNumber);
  });

  // STORE NEW NUMBER
  $('#btn-store').on('click', async function (event) {
    event.preventDefault();

    let inputNumber = $('#ip-number').val();
    if (!contractInstance) {
      alert('Contract is not deploy yet. Please deploy contract first');
      return;
    }

    try {
      inputNumber = Number(inputNumber);
    } catch (error) {
      alert('Wrong type input, please enter number');
      return;
    }

    $this = $(this);
    var loadingText =
      '<i class="fa fa-circle-o-notch fa-spin"></i> Storing number ...';
    if ($(this).html() !== loadingText) {
      $this.data('original-text', $(this).html());
      $this.html(loadingText);
    }

    contractInstance.methods
      .store(inputNumber)
      .send(
        { from: userAccount, gas: 5000000, gasPrice: 100 * 1000000000 },
        function (error, transactionHash) {}
      )
      .on('error', function (err) {
        $this.html($this.data('original-text'));
      })
      .on('transactionHash', function (hash) {
        console.log('STORE TX:', hash);
      })
      .on('receipt', async function (receipt) {
        console.log('STORE SUCCESS:', receipt);

        $this.html($this.data('original-text'));
        $('#contract-address').text(
          `Storage Address: ${receipt.contractAddress}`
        );

        const storedNumber = await contractInstance.methods.get().call();
        $('#op-number').text(storedNumber);
      });
  });
}

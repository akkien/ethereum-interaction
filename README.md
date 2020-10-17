# ĐApp development

This project demonstrates how to develop smart contract and then integrate smart contract into web application (both frontend & backend).

It includes 3 main directories:

- contractDevelopment: develop, test and deploy smart contract, using truffle framework.
- backend: how backend interact with your smart contract
- frontend: how backend interact with your smart contract

## contractDevelopment

### Set up

Step1: Install truffle framework and Ganache

Step2: Run Ganache

### Use

Test:

```shell
$ truffle test
```

Deploy:

```shell
$ truffle migrate
```

## Backend interact smart contract

**Setup**

Install package:

```shell
$ yarn install # or npm install
```

### manual_sendEther.js

Demonstrate how to send ether over ethereum: manually create raw transaction, sign, and send signed transaction.

```shell
$ node manual_sendEther.js
```

### manual_contractInteraction.js

Demonstrate how to deploy contract, set contract state and get contract state: **manually** create raw transaction, sign, and send signed transaction.

There are 2 modes:

1. Deploy contract and get init state of a variable

```shell
$ node manual_contractInteraction.js deploy
```

After waiting a while, we get receipt of deploy transaction, notice field **contractAddress**. We use it for following mode.

2. Send a transaction that change value of a variable

```shell
$ # node manual_contractInteraction.js call <contract address> <new value>
$ node manual_contractInteraction.js call 0x92F28C30a494c7313c83226e065Cd812e2d773C5 15
```

### web3_contractInteraction.js

Demonstrate how to deploy contract, set contract state and get contract state: **use web3** create raw transaction, sign, and send signed transaction.

There are 2 modes:

1. Deploy contract and get init state of a variable

```shell
$ node web3_contractInteraction.js deploy
```

After waiting a while, we get receipt of deploy transaction, notice field **contractAddress**. We use it for following mode.

2. Send a transaction that change value of a variable

```shell
$ # node web3_contractInteraction.js call <contract address> <new value>
$ node web3_contractInteraction.js call 0x92F28C30a494c7313c83226e065Cd812e2d773C5 15
```

## Frontend interact smart contract

### Setup

Install Metamask extension and use it to create new wallet

### Use

Open index.html in browser => Follow your instinct

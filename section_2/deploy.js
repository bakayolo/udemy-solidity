const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
  'gate system slogan fine electric what awake fun gasp twice forward language',
  'https://rinkeby.infura.io/v3/24e4fe47670e4ec9ab13bb7b49834f78'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const senderAccount = accounts[0];

  console.log('Attempting to deploy from account', senderAccount);

  const inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [ 'Hi there!' ]
    })
    .send({
      from: senderAccount,
      gas: '1000000',
      gasPrice: '1000000000'
    });
  
  console.log('Contract deployed to', inbox.options.address);
  provider.engine.stop();
};
deploy();
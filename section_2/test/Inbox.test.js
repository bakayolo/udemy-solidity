const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts;
let senderAccount;
let inbox;
const INITIAL_MESSAGE = 'Hi there!';

describe('Inbox', () => {
  beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    senderAccount = accounts[0];

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object,
        arguments: [INITIAL_MESSAGE]
      })
      .send({
        from: senderAccount,
        gas: '1000000'
      });
  });

  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });

  it('can change the message', async () => {
    const newMessage = 'YOLO';
    await inbox.methods.setMessage(newMessage).send({ from: senderAccount });
    const message = await inbox.methods.message().call();
    assert.equal(message, newMessage);
  });
})
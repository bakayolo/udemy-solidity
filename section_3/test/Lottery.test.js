const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let lottery;
let accounts;

describe('Lottery', () => {
  beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    senderAccount = accounts[0];

    // Use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object
      })
      .send({
        from: senderAccount,
        gas: '1000000'
      });
  });

  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send(
      {
        from: senderAccount,
        value: web3.utils.toWei('0.02', 'ether')
      });
    
    const players = await lottery.methods.getPlayers().call(
      {
        from: senderAccount
      });

    assert.equal(senderAccount, players[0]);
    assert.equal(1, players.length);
  });

  if('required of minimum amount of ether', async () => {
    try {
      await lottery.methods.enter().send(
        {
          from: senderAccount,
          value: web3.utils.toWei('0.00001', 'ether')
        });
        assert(false);
      } catch(err) {
        assert.ok(err);
      }
  });

  if('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinter().send(
        {
          from: accounts[1]
        });
        assert(false);
      } catch(err) {
        assert.ok(err);
      }
  });

  it("sends money to the winner and resets the players array", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
})
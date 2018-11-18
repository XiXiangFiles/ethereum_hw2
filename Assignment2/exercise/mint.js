const fs = require('fs');
const Web3 = require('web3');
const ethers = require('ethers');

let web3 = new Web3('http://localhost:8545');

const abi = JSON.parse(fs.readFileSync('../contract/Bank_sol_Bank.abi').toString());
const address = fs.readFileSync('../address.txt').toString();

let bank = new web3.eth.Contract(abi, address);
let mint_value = 3*(10**10);
//let val = ethers.utils.bigNumberify(mint_value);
let result ={};
web3.eth.getAccounts().then(function (accounts) {

    // accounts[0] mint 3 * 10**18 coins
    // your code
    bank.methods
        .mint(mint_value)
        .send({
            from: accounts[0],
            gas: 3400000
        })
        .on("receipt", function(receipt) {
            result.receipt = receipt;
            result.value= receipt.events.MintEvent.returnValues.value;
            //console.log(receipt);
            console.log(result);
            return;
        })
        .on("error", function(error) {
            result.status = `智能合約mint執行失敗`;
            result.error= error.toString();
            console.log(result);
            return;
        });


});

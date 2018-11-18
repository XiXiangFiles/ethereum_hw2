const fs = require('fs')
const Web3 = require('web3')

let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(fs.readFileSync('../contract/Bank_sol_Bank.abi').toString())
const address = fs.readFileSync('../address.txt').toString()

let bank = new web3.eth.Contract(abi, address);
let val = 1;
let result={};

web3.eth.getAccounts().then(function (accounts) {

    // accounts[1] buy 1 * 10**18 coins
    // your code
    bank.methods
        .mint(val)
        .send({
            from: accounts[1],
            gas: 3400000
        })
        .on("receipt", function(receipt) {
            result.receipt = receipt;
            result.value= receipt.events.BuyCoinEvent.returnValues.value;
            //console.log(receipt);
            console.log(result);
            return;
        })
        .on("error", function(error) {
            result.status = `智能合約buy執行失敗`;
            result.error= error.toString();
            console.log(result);
            return;
        });

})


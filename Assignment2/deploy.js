const fs = require('fs');
const Web3 = require('web3');

let web3 = new Web3('http://localhost:8545');

const abi = JSON.parse(fs.readFileSync('./contract/Bank_sol_Bank.abi').toString());
const bytecode = '0x' + fs.readFileSync('./contract/Bank_sol_Bank.bin').toString();

let bank = new web3.eth.Contract(abi);

web3.eth.getAccounts().then(function (accounts) {

    // deploy contract
    // your code
    bank
        .deploy({
            data: bytecode
        })
        .send({
            from: accounts[0],
            gas: 3400000
        })
        .on('error', function(error){
            console.log(`部署失敗${error}`);
            return;
        })
        .on("receipt", function(receipt) {
            console.log(receipt);
            // 更新合約介面
            let deploy_Address = receipt.contractAddress;
            fs.writeFileSync('./address.txt', deploy_Address)
            console.log(`合約地址:${deploy_Address}`);
            return;
        })

});

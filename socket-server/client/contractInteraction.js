const serverUrl = "https://6hs6vzjfxpwd.usemoralis.com:2053/server";
const appId = "8B9E4nYSiOlMo116PtN1JKmjA6QjuteqFTqWtxoC";
Moralis.start({ serverUrl, appId });

async function withdrawWinnings() {

    let user = Moralis.User.current();
    if (!user) {
        user = await Moralis.authenticate({
        signingMessage: "Log in using Moralis",
        })
    } else {
        window.web3 = new Web3(web3.currentProvider);
    }

    let ethAddress = user.get("ethAddress")

    //ABI
    let tournamentABI = [
      {
        "constant": true,
        "inputs": [],
        "name": "getBalance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      }
    ]

    // Smart contracts
    const tournamentContract = new web3.eth.Contract(tournamentABI, '0x50dfA07CF6e1AcC040fde44130F8d8Ed9121578D')
    let response = await tournamentContract.methods.withdraw().send({from: `${ethAddress}`, gas: 3000000}).then(function (response) {
      alert('SUCCESS')
    })
  }
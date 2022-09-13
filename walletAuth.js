const serverUrl = "https://6hs6vzjfxpwd.usemoralis.com:2053/server";
const appId = "8B9E4nYSiOlMo116PtN1JKmjA6QjuteqFTqWtxoC";
Moralis.start({ serverUrl, appId });

async function login() {
    let user = Moralis.User.current();
    // document.cookie = `userAddress=${user.get("ethAddress")}`
    if (!user) {
      user = await Moralis.authenticate({
        signingMessage: "Log in using Moralis",
      })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
          // Save data
          let ethAddress = user.get("ethAddress")
          let username = " "
          // Create new user in DB
          var xhr = new XMLHttpRequest();
          xhr.open("POST", 'https://secure-forest-38431.herokuapp.com/register', true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({
            wallet_address: `${ethAddress}`,
            username: username,
            stat_upgrade: "0"
          }))

          document.cookie = `userAddress=${user.get("ethAddress")}`
        })
        .catch(function (error) {
          console.log(error);
        });

    } else {
      if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
      } 
      document.cookie = `userAddress=${user.get("ethAddress")}`
      window.location.pathname = '/index.html';
    }
}
 

async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
}

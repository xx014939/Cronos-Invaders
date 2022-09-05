const serverUrl = "https://6hs6vzjfxpwd.usemoralis.com:2053/server";
const appId = "8B9E4nYSiOlMo116PtN1JKmjA6QjuteqFTqWtxoC";
Moralis.start({ serverUrl, appId });

async function login() {
    let user = Moralis.User.current();
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
          xhr.open("POST", 'http://localhost:3002/register', true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({
            wallet_address: `${ethAddress}`,
            username: username
          }));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
}

async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
}
  
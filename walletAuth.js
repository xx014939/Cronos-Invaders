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
  
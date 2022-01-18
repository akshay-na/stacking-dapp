const Dummy_Token = artifacts.require("Dummy_Token");
const Tether_Token = artifacts.require("Tether_Token");
const Stacking_DApp = artifacts.require("Stacking_DApp");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Tether_Token);
  const tether_token = await Tether_Token.deployed();

  await deployer.deploy(Dummy_Token);
  const dummy_token = await Dummy_Token.deployed();

  await deployer.deploy(
    Stacking_DApp,
    dummy_token.address,
    tether_token.address
  );
  const stacking_dapp = await Stacking_DApp.deployed();

  await dummy_token.transfer(stacking_dapp.address, 100000 * 10 ** 18);

  await tether_token.transfer(accounts[1], 100 * 10 ** 18);
};

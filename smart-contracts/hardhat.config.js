require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    anvil:{
      url:"http://localhost:8545",
      accounts:["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      chainId:31337,
      blockConfirmations:1,
    },
    hardhat: {
			chainId: 1337,
			blockConfirmations:1,
		},
    localhost: {
			chainId: 1337,
			blockConfirmations:1,
		},
  },
  namedAccounts: {
		deployer: {
			default: 0,
		},
  },
  // paths: {
	// 	artifacts: "../client/artifacts",
	// },
};

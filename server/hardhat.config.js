require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  // networks: {
  //   goerli: {
  //     url: process.env.GOERLI_PROVIDER,
  //     accounts: [`0x${process.env.PRIVATE_KEY}`],
  //     chainId: 5,
  //   },
  //   sepolia: {
  //     url: process.env.SEPOLIA_PROVIDER,
  //     accounts: [`0x${process.env.PRIVATE_KEY}`],
  //     chainId: 11155111,
  //   },
  // },
};

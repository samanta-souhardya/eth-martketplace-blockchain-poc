// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");
async function main() {
  const _assetToken = await hre.ethers.getContractFactory("AssetToken");
  const _nftMarketPlace = await hre.ethers.getContractFactory("NFTMarket");
  const AssetToken = await _assetToken.deploy();
  const NFTMarketPlace = await _nftMarketPlace.deploy();

  await AssetToken.deployed();
  await NFTMarketPlace.deployed();

  const contractAddress = {
    assetToken: AssetToken.address,
    nftMarketPlace: NFTMarketPlace.address,
  };

  fs.writeFileSync("contract-address.json", JSON.stringify(contractAddress));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

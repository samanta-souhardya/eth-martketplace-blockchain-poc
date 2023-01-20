const { Contract, ethers } = require("ethers");
const { assetToken } = require("../contract-address.json");
const abis = require("../utilities/abi");
const provider = require("../utilities/provider");

/**
 * controller for asset token ERC20
 * @returns smart contract methods
 */
const useAssetToken = () => {
  const assetContract = (account) => {
    return new Contract(
      assetToken, //assetToken address
      abis.assetTokenAbi, //assetToken abi
      provider.getSigner(account) //assetToken account-signer
    );
  };

  const getName = async (req, res, next) => {
    try {
      const { account } = req.body;
      const AssetToken = assetContract(account);
      const name = await AssetToken.name();
      res.status(200).json({ name });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getSymbol = async (req, res, next) => {
    try {
      const { account } = req.body;
      const AssetToken = assetContract(account);
      const symbol = await AssetToken.symbol();
      res.status(200).json({ symbol });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const mint = async (req, res, next) => {
    try {
      const { amount, account } = req.body;
      const AssetToken = assetContract(account);
      const mintingAmount = ethers.utils.parseEther(amount + "");
      const data = await AssetToken.mint(mintingAmount);
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getTokenBalance = async (req, res, next) => {
    try {
      const { account } = req.params;
      const AssetToken = assetContract(account);
      const balance = await AssetToken.balanceOf(account);
      res.status(200).json({ balance });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const transferAssetTokenPromisified = (req, res, next) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const { to, amount, account } = req.body;
        const AssetToken = assetContract(account);
        const amountToSend = ethers.utils.parseEther(amount + "");
        const txn = await AssetToken.populateTransaction.transfer(
          to,
          amountToSend
        );
        const txnReceipt = await provider.getTransactionReceipt(txn.hash);
        resolve(txnReceipt);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
    return promise;
  };

  const transferAssetToken = async (req, res, next) => {
    try {
      const { to, amount, from } = req.body;
      const AssetToken = assetContract(from);
      const amountToSend = ethers.utils.parseEther(amount + "");
      const txn = await AssetToken.transfer(to, amountToSend);
      const txnReceipt = await provider.getTransactionReceipt(txn.hash);
      res.status(200).send(txnReceipt);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  return {
    getName,
    getSymbol,
    mint,
    getTokenBalance,
    transferAssetToken,
    transferAssetTokenPromisified,
    assetTokenContract: assetContract,
  };
};

module.exports = useAssetToken;

const { Contract, BigNumber, ethers } = require("ethers");
const { assetToken } = require("../contract-address.json");
const abis = require("../utilities/abi");
const provider = require("../utilities/provider");

const useAssetTokenMiddleWare = () => {
  const assetContract = (account) => {
    return new Contract(
      assetToken, //assetToken address
      abis.assetTokenAbi, //assetToken abi
      provider.getSigner(account) //assetToken account-signer
    );
  };
  const enoughBalance = async (req, res, next) => {
    try {
      const { from, amount, account } = req.body;
      const AssetToken = assetContract(from || account);
      const balance = await AssetToken.balanceOf(from || account);
      const transferAmount = ethers.utils.parseEther(amount + "");
      if (BigNumber.from(balance).gte(BigNumber.from(transferAmount))) {
        next();
      } else {
        res.status(400).send("Not enough Balance");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const transferAssetToken = async (req, res, next) => {
    try {
      const { to, from, amount } = req.body;
      const AssetToken = assetContract(from);
      const amountToSend = ethers.utils.parseEther(amount + "");
      const txn = await AssetToken.transfer(to, amountToSend);
      // const pvtKey =
      //   "47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a";
      // const walletProvider = new ethers.Wallet(pvtKey, provider);
      // const feeData = await provider.getFeeData();
      // now broadcast this object to your offline wallet, there it can sign it
      // delete txn["gasPrice"];
      // txn.gasLimit = 210000;
      // txn.nonce = await provider.getTransactionCount(walletProvider.address);
      // txn.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
      // txn.maxFeePerGas = feeData.maxFeePerGas;
      // const serializedSignedTx = await walletProvider.signTransaction(txn);
      // now broadcast this to the network
      // const lol = await provider.sendTransaction(serializedSignedTx);
      // console.log(lol);
      if (txn) {
        res.tokenTxn = txn;
        next();
      } else {
        throw new Error("Not enough balance");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  return { enoughBalance, transferAssetToken };
};

module.exports = useAssetTokenMiddleWare;

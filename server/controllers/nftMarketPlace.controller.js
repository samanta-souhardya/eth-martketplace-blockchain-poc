require("dotenv").config();
const User = require("../model/user");
const { Contract } = require("ethers");
const { nftMarketPlace } = require("../contract-address.json");
const abis = require("../utilities/abi");
const useHelper = require("../utilities/helper");
const provider = require("../utilities/provider");
const useAssetToken = require("./assetToken.controller");
const ipfsClient = require("../utilities/ipfs-client");
const axios = require("axios");
const _ = require("lodash");
const helpers = useHelper();

const useNftMarketPlace = () => {
  const marketPlaceContract = (account) => {
    return new Contract(
      nftMarketPlace,
      abis.nftMarketPlaceAbi,
      provider.getSigner(account)
    );
  };

  const createNFT = async (req, res, next) => {
    try {
      const { name, description, account, imgUrl } = req.body;
      const NFTMarketPlace = marketPlaceContract(account);
      const _res = await ipfsClient.add(
        JSON.stringify({
          name,
          description,
          imgUrl,
        })
      );
      console.log(_res);
      const nft = await NFTMarketPlace.createNFT(_res.path);
      res.status(200).send(nft);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getNFTById = async (req, res, next) => {
    try {
      const { tokenId } = req.params;
      const { account } = req.body;
      const NFTMarketPlace = marketPlaceContract(account);
      const _res = await NFTMarketPlace.tokenURI(tokenId);
      console.log(_res);
      const nft = _res;
      if (nft.tokenId) {
        res.status(200).json({ nft });
      } else {
        res.status(404).send("Resource not found");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const listNFT = async (req, res, next) => {
    try {
      const { tokenId } = req.params;
      const {
        body: { amount, account },
      } = req;
      const NFTMarketPlace = marketPlaceContract(account);
      const _res = await NFTMarketPlace.listNFT(tokenId, amount);
      res.status(200).json({ _res });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const cancelList = async (req, res, next) => {
    try {
      const { tokenId } = req.params;
      const { account } = req.body;
      const NFTMarketPlace = marketPlaceContract(account);
      const _res = await NFTMarketPlace.cancelListing(tokenId);
      res.status(200).send(_res);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getOwners = async (req, res, next) => {
    try {
      const {
        params: { tokenId },
      } = req;
      const { account } = req.body;
      const NFTMarketPlace = marketPlaceContract(account);
      const owners = await NFTMarketPlace.getOwners(tokenId);
      res.status(200).json({ owners });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const buyNFT = async (req, res, next) => {
    const { tokenTxn } = res;
    if (tokenTxn) {
      try {
        const { tokenId } = req.params;
        const { account } = req.body;
        const NFTMarketPlace = marketPlaceContract(account);
        const nft = await NFTMarketPlace.getNFT(tokenId);
        if (nft) {
          const nftTxn = await NFTMarketPlace.buyNFT(tokenId);
          res.status(200).json({ nftTxn, tokenTxn });
        } else {
          res.status(400).send(error);
        }
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    }
  };

  const listAllNfts = (account) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const NFTMarketPlace = marketPlaceContract(account);
        const totalNfts = await NFTMarketPlace.getLatestTokenId();
        let nftList = [];
        for (let i = 1; i <= Number(totalNfts.toString()); i++) {
          const listItem = helpers.parseNFT(await NFTMarketPlace.getNFT(i));
          const ipfsURI = await NFTMarketPlace.tokenURI(i);
          const ipfsRes = await axios.get(
            `${process.env.IPFS_GATEWAY}/${ipfsURI}`
          );
          const ipfsItem = ipfsRes.data;
          const _nft = {
            ...listItem,
            ...ipfsItem,
          };
          nftList.push(_nft);
        }
        resolve(nftList);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  };

  //get ETH balance
  //get token name
  //get token symbol
  //get token balance
  //get owned NFT
  //get listed NFT
  const getMasterData = async (req, res, next) => {
    try {
      const { account } = req.body;
      const { assetTokenContract } = useAssetToken();
      // let user = await User.findById(id);
      // const account = user.address;
      const AssetToken = assetTokenContract(account);
      const ethBalance = await provider.getBalance(account);
      const tokenName = await AssetToken.name();
      const tokenSymbol = await AssetToken.symbol();
      const tokenBalance = await AssetToken.balanceOf(account);
      let nftList = await listAllNfts(account);
      const ownedItems = nftList.filter((el) => el.currentOwner === account);
      const nftForSale = nftList.filter((el) => el.price !== 0);
      // user = user.toObject();
      // delete user["privateKey"];
      // delete user["publicKey"];
      // delete user["password"];
      // delete user["__v"];
      const masterData = {
        ethBalance,
        tokenBalance,
        tokenName,
        tokenSymbol,
        nftList,
        ownedItems,
        nftForSale,
        // user,
      };
      res.status(200).send(masterData);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getOwnedItems = async (req, res, next) => {
    try {
      const { account } = req.body;
      const nftList = await listAllNfts(account);
      const ownedItems =
        nftList.filter((el) => el.currentOwner === account) || [];
      res.status(200).send(ownedItems);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getListedNFTs = async (req, res, next) => {
    try {
      const { account } = req.body;
      const nftList = await listAllNfts(account);
      const nftForSale = nftList.filter((el) => el.price !== 0);
      res.status(200).send(nftForSale);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getOwnedAndListedNfts = async (req, res, next) => {
    try {
      const { account } = req.body;
      const nftList = await listAllNfts(account);
      const nftForSale = nftList.filter((el) => el.price !== 0);
      const ownedItems =
        nftList.filter((el) => el.currentOwner === account) || [];
      res.status(200).json({ nftForSale, ownedItems });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const getTokenAndEth = async (req, res, next) => {
    try {
      const { account } = req.body;
      const { assetTokenContract } = useAssetToken();
      const AssetToken = assetTokenContract(account);
      const ethBalance = await provider.getBalance(account);
      const tokenBalance = await AssetToken.balanceOf(account);
      res.status(200).json({ ethBalance, tokenBalance });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  return {
    createNFT,
    getNFTById,
    listNFT,
    cancelList,
    getOwners,
    buyNFT,
    getMasterData,
    getOwnedItems,
    getListedNFTs,
    getOwnedAndListedNfts,
    getTokenAndEth,
  };
};

module.exports = useNftMarketPlace;

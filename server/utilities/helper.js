const { ethers } = require("ethers");

const useHelper = () => {
  const parseNFT = (nft) => {
    const [tokenId, seller, currentOwner, price] = nft;
    return {
      tokenId: tokenId.toNumber(),
      seller,
      currentOwner,
      price: price.toNumber(),
    };
  };
  return {
    parseNFT,
  };
};

module.exports = useHelper;

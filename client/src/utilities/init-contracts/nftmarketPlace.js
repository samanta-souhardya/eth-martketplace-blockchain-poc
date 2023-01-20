import { ethers } from "ethers";
import NFT_MARKETPLACE from "../build-contracts/NFTMarket.json";
import contractAddress from "../contract-address.json";

const useMarketPlace = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.REACT_APP_LOCAL_PROVIDER
  );
  const createContract = (account) => {
    const contract = new ethers.Contract(
      contractAddress.nftMarketPlace,
      NFT_MARKETPLACE.abi,
      provider.getSigner(account)
    );
    return contract;
  };
  return {
    createContract,
  };
};

export default useMarketPlace;

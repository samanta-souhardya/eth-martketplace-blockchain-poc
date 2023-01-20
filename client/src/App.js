import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  getMasterData,
  getOwnedAndListedNfts,
  getTokenBalance,
  getTokenAndEth,
} from "./services/rest";
import RouteHandler from "./router";
export const MarketplaceContext = createContext();

function App() {
  const [account, setAccount] = useState("");
  const [masterData, setMasterData] = useState("");
  useEffect(() => {
    init();
  }, [account]);

  const masterDataGetter = async () => {
    try {
      const res = await getMasterData(account);
      setMasterData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (account) {
      masterDataGetter();
    } else return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let selectedAccount;
    if (typeof provider !== "undefined") {
      const signer = provider.getSigner();
      await provider.send("eth_requestAccounts", []);
      selectedAccount = await signer.getAddress();
      // console.log(`Selected account is ${selectedAccount}`);
      setAccount(selectedAccount);
      window.ethereum.on("accountsChanged", async function (accounts) {
        const signer = provider.getSigner();
        await provider.send("eth_requestAccounts", []);
        selectedAccount = await signer.getAddress();
        setAccount(selectedAccount);
        // console.log(`Selected account changed to ${selectedAccount}`);
      });
    }
  };

  const updateASTBalance = async () => {
    try {
      const data = {
        account,
      };
      const res = await getTokenBalance(data);
      if (res) {
        const { balance } = res;
        setMasterData({
          ...masterData,
          tokenBalance: balance,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTokenAndEth = async () => {
    try {
      const data = {
        account,
      };
      const res = await getTokenAndEth(data);
      if (res) {
        const { ethBalance, tokenBalance } = res;
        setMasterData({
          ...masterData,
          tokenBalance,
          ethBalance,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const providerData = () => {
    return {
      account,
      masterData,
      updateASTBalance,
      ownedListedNFTCallback,
      updateTokenAndEth,
    };
  };

  const ownedListedNFTCallback = async () => {
    try {
      const data = { account };
      const res = await getOwnedAndListedNfts(data);
      if (res) {
        setMasterData({
          ...masterData,
          nftForSale: res.nftForSale,
          ownedItems: res.ownedItems,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <MarketplaceContext.Provider value={providerData()}>
        <RouteHandler />
      </MarketplaceContext.Provider>
    </div>
  );
}

export default App;

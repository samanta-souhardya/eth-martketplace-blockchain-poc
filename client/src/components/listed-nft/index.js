import { useContext, useState } from "react";
import { MarketplaceContext } from "../../App";
import EmptyState from "../empty-state";
import Blockies from "react-blockies";
import { buyNFT } from "../../services/rest";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import nftMarketPlace from "../../utilities/init-contracts/nftmarketPlace";
import "./styles/style.css";

const ListedNFTS = () => {
  const { masterData, account, ownedListedNFTCallback, updateTokenAndEth } =
    useContext(MarketplaceContext);
  const { nftForSale } = masterData;
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const navigate = useNavigate();

  const getString = (str) => {
    if (str.length > 35) {
      return str.substr(0, 4) + "..." + str.substr(str.length - 4, str.length);
    }
    return str;
  };

  const purchaseNFT = async (to, amount, tokenId) => {
    try {
      const data = {
        to,
        from: account,
        amount,
        account,
        tokenId,
      };
      setLoading(true);
      await buyNFT(data);
      eventListener();
      ownedListedNFTCallback();
      updateTokenAndEth();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setSelectedIndex("");
      toast.error(
        "Unable to purchase, make sure you have enough token balance or try again later!"
      );
    }
  };

  const eventListener = () => {
    const marketplace = nftMarketPlace();
    const contract = marketplace.createContract(account);
    contract.once("NFTTransfer", (tokenId, from, to, price, event) => {
      console.log({
        tokenId,
        from,
        to,
        price,
        event,
      });
      toast.success("Yipee!!! You own this NFT now!");
      setLoading(false);
      setSelectedIndex("");
    });
  };

  return (
    <div className="container">
      {nftForSale?.length ? (
        <div className="item-container">
          {nftForSale?.map((nft, index) => {
            return (
              <div className="card nft-item" key={nft.tokenId}>
                <div
                  className="card-image image"
                  style={{
                    background: `url(${nft.imgUrl}) no-repeat center`,
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="card-header">
                  <div className="card-title h5">{nft.name}</div>
                  <div className="card-subtitle text-gray">
                    {nft.description}
                  </div>
                  <div className="blockies">
                    <Blockies
                      seed={nft.currentOwner + nft.currentOwner}
                      size={6}
                    />
                    <b>{getString(account)}</b>
                  </div>
                  <div>
                    {nft.price} {masterData.tokenSymbol}
                  </div>
                </div>
                <div className="card-footer">
                  {nft.currentOwner === account ? (
                    <button className="btn btn-dark" href="#cards">
                      OWNED
                    </button>
                  ) : (
                    <button
                      className={`btn btn-dark ${
                        loading && selectedIndex === index ? "loading" : ""
                      }`}
                      href="#cards"
                      onClick={() => {
                        setSelectedIndex(index);
                        purchaseNFT(nft.currentOwner, nft.price, nft.tokenId);
                      }}
                    >
                      BUY at {nft.price} {masterData.tokenSymbol}
                    </button>
                  )}
                  <button
                    className="btn btn-primary float-right"
                    onClick={() => {
                      navigate(`/nft/${nft.tokenId}`);
                    }}
                  >
                    <i className="icon icon-arrow-right"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Empty"
          description="No NFTs available for sale yet"
          icon="icon-time"
        />
      )}
    </div>
  );
};

export default ListedNFTS;

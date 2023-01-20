import { useContext, useState } from "react";
import { MarketplaceContext } from "../../App";
import EmptyState from "../empty-state";
import { Link, useNavigate } from "react-router-dom";
import Blockies from "react-blockies";
import { toast } from "react-toastify";
import ListNFTModal from "../list-nft-modal";
import Header from "../header";
import "./styles/style.css";
import { cancelListing } from "../../services/rest";
import nftMarketPlace from "../../utilities/init-contracts/nftmarketPlace";

const OwnedNFTS = () => {
  const { masterData, account, ownedListedNFTCallback } =
    useContext(MarketplaceContext);
  const [active, setActive] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const { ownedItems } = masterData;
  const navigate = useNavigate();

  const getString = (str) => {
    if (str.length > 35) {
      return str.substr(0, 4) + "..." + str.substr(str.length - 4, str.length);
    }
    return str;
  };

  const toastHandler = (type, msg) => {
    switch (type) {
      case "success":
        if (msg) {
          return toast[type](msg);
        } else {
          return toast[type]("NFT Listed successfully!");
        }
      case "error":
        toast[type]("Failed to list NFT!");
        break;
      default:
        break;
    }
  };

  const getPriceInfo = (price) => {
    let str = "";
    if (price === 0) {
      str = "NFT not listed";
    } else {
      str = `${price} ${masterData.tokenSymbol}`;
    }
    return str;
  };

  const removeListing = async (tokenId) => {
    try {
      const data = {
        tokenId,
        account,
      };
      setTokenId(tokenId);
      setLoading(true);
      await cancelListing(data);
      eventListener();
      ownedListedNFTCallback();
    } catch (error) {
      console.log(error);
      toastHandler("error");
      setTokenId("");
      setLoading(false);
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
      setLoading(false);
      setTokenId("");
      toastHandler("success", "NFT removed from listing");
    });
  };

  return (
    <div>
      <Header />
      <div className="container">
        {ownedItems?.length ? (
          <div className="item-container">
            {ownedItems?.map((owned) => {
              return (
                <div className="card nft-item" key={owned.tokenId}>
                  <div
                    className="card-image image"
                    style={{
                      background: `url(${owned.imgUrl}) no-repeat center`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <div className="card-header">
                    <div className="card-title h5">{owned.name}</div>
                    <div className="card-subtitle text-gray">
                      {owned.description}
                    </div>
                    <div className="blockies">
                      <Blockies
                        seed={owned.currentOwner + owned.currentOwner}
                        size={6}
                      />
                      <b>{getString(account)}</b>
                    </div>
                    <div>{getPriceInfo(owned.price)}</div>
                  </div>
                  <div className="card-footer">
                    {owned.price === 0 ? (
                      <button
                        className="btn btn-dark"
                        href="#cards"
                        onClick={() => {
                          setActive("active");
                          setTokenId(owned.tokenId);
                        }}
                      >
                        LIST
                      </button>
                    ) : (
                      <button
                        className={`btn btn-dark ${
                          tokenId === owned.tokenId && loading ? "loading" : ""
                        }`}
                        href="#cards"
                        onClick={() => removeListing(owned.tokenId)}
                      >
                        Cancel Listing
                      </button>
                    )}
                    <button
                      className="btn btn-primary float-right"
                      onClick={() => {
                        navigate(`/nft/${owned.tokenId}`);
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
            title="Empty!"
            description="You do not own any NFT, create NFT or buy from marketplace"
            icon="icon-flag"
          >
            <Link to="/create">
              <button className="btn btn-primary">Create</button>
            </Link>
          </EmptyState>
        )}
      </div>
      {active && (
        <ListNFTModal
          close={() => {
            setActive("");
            setTokenId("");
          }}
          active={active}
          tokenId={tokenId}
          toastHandler={toastHandler}
        />
      )}
    </div>
  );
};

export default OwnedNFTS;

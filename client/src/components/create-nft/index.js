import { useContext, useState } from "react";
import Header from "../header";
import { MarketplaceContext } from "../../App";
import { createNFT } from "../../services/rest";
import { toast } from "react-toastify";
import produce from "immer";
import isURL from "validator/lib/isURL";
import ipfsClient from "../../utilities/ipfs-client";
import nftMarketPlace from "../../utilities/init-contracts/nftmarketPlace";
import "./styles/styles.css";

const CreateNFT = () => {
  const value = useContext(MarketplaceContext);
  const [loading, setLoading] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [nftDetails, setNftDetails] = useState({
    name: "",
    description: "",
    imgUrl: "",
  });

  const eventListener = () => {
    const marketplace = nftMarketPlace();
    const contract = marketplace.createContract(value.account);
    contract.once("NFTTransfer", (tokenId, from, to, price, event) => {
      console.log({
        tokenId,
        from,
        to,
        price,
        event,
      });
      setLoading(false);
      toast.success("NFT created successfully!");
    });
  };

  const nftDetailsHandler = (key, value) => {
    const nft = {
      ...nftDetails,
      [key]: value,
    };
    setNftDetails(nft);
  };

  const onCreateClick = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const data = {
        account: value.account,
        ...nftDetails,
      };
      await createNFT(data);
      eventListener();
      value.ownedListedNFTCallback();
      setNftDetails({
        name: "",
        description: "",
        imgUrl: "",
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to create NFT!");
    }
  };

  const imageSelectHandler = async (e) => {
    setImageLoader(true);
    const file = e.target.files[0];
    if (file) {
      try {
        const res = await ipfsClient.add(file);
        setNftDetails(
          produce((draft) => {
            draft.imgUrl = `${process.env.REACT_APP_IPFS_GATEWAY}/${res.path}`;
          })
        );
        setImageLoader(false);
        toast.success("Image added successfully");
      } catch (error) {
        console.log(error);
        setImageLoader(false);
        toast.error("Unable to add image");
      }
    }
  };

  const checkValidation = () => {
    const { name, description, imgUrl } = nftDetails;
    let disabled;
    if (name && description && isURL(imgUrl)) {
      disabled = false;
    } else {
      disabled = true;
    }
    return disabled;
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <div className="docs-demo columns">
          <div className="column">
            <form>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  className="form-input"
                  id="name"
                  type="text"
                  placeholder="Name"
                  onChange={(e) => {
                    nftDetailsHandler("name", e.target.value);
                  }}
                  value={nftDetails.name}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="form-input"
                  id="description"
                  type="text"
                  placeholder="Description"
                  value={nftDetails.description}
                  onChange={(e) => {
                    nftDetailsHandler("description", e.target.value);
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="imgUrl">
                  Select Image
                </label>
                <input
                  className="form-input"
                  id="imgUrl"
                  type="file"
                  placeholder="URL"
                  accept="image/*"
                  onChange={(e) => {
                    imageSelectHandler(e);
                  }}
                />
              </div>
            </form>
          </div>
          <div className="divider-vert"></div>
          <Imgcomponent img={nftDetails.imgUrl} loading={imageLoader} />
          <button
            className={`btn btn-primary btn-block mt-2 ${loading && "loading"}`}
            onClick={onCreateClick}
            disabled={checkValidation()}
          >
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
};

const Imgcomponent = (props) => {
  return (
    <div
      className="image-component"
      style={{
        backgroundImage: `url(${props.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {props.loading && <div className="loading loading-lg"></div>}
      {!props.img && !props.loading && (
        <i className="icon icon-photo image-icon"></i>
      )}
    </div>
  );
};

export default CreateNFT;

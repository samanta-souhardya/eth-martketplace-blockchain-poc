import { useContext, useState } from "react";
import { MarketplaceContext } from "../../App";
import { listNFT } from "../../services/rest";
import nftMarketPlace from "../../utilities/init-contracts/nftmarketPlace";

const ListNFTModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const { account, ownedListedNFTCallback } = useContext(MarketplaceContext);

  const listNft = async () => {
    try {
      setLoading(true);
      const data = {
        account,
        amount: price,
        tokenId: props.tokenId,
      };
      await listNFT(data);
      eventListener();
      ownedListedNFTCallback();
    } catch (error) {
      setLoading(false);
      props.toastHandler("error");
      props.close();
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
      props.toastHandler("success");
      props.close();
    });
  };

  return (
    <div className={`modal modal-sm ${props.active}`} id="modal-id">
      <a
        href="#close"
        className="modal-overlay"
        aria-label="Close"
        onClick={() => props.close()}
      >
        {""}
      </a>
      <div className="modal-container">
        <div className="modal-header">
          <a
            href="#close"
            className="btn btn-clear float-right"
            aria-label="Close"
            onClick={() => props.close()}
          >
            {""}
          </a>
          <div className="modal-title h5">List NFT</div>
        </div>
        <div className="modal-body">
          <div className="content">
            <div className="form-group">
              <label className="form-label" htmlFor="price">
                Price
              </label>
              <input
                className="form-input"
                id="price"
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            onClick={() => listNft()}
          >
            LIST
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListNFTModal;

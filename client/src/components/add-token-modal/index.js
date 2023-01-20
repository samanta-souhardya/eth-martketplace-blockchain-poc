import { useContext, useState } from "react";
import { MarketplaceContext } from "../../App";
import { mintAST } from "../../services/rest";

const AddTokenModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const { account, updateTokenAndEth } = useContext(MarketplaceContext);
  const mintToken = async () => {
    try {
      setLoading(true);
      const data = {
        account,
        amount,
      };
      const res = await mintAST(data);
      if (res) {
        updateTokenAndEth();
        setLoading(false);
        props.toastHandler("success");
        props.close();
      } else {
        setLoading(false);
        props.toastHandler("error");
        props.close();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      props.close();
    }
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
          <div className="modal-title h5">Mint Token</div>
        </div>
        <div className="modal-body">
          <div className="content">
            <div className="form-group">
              <label className="form-label" htmlFor="amount">
                Amount
              </label>
              <input
                className="form-input"
                id="amount"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className={`btn btn-primary ${loading && "loading"}`}
            onClick={() => mintToken()}
          >
            Mint
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTokenModal;

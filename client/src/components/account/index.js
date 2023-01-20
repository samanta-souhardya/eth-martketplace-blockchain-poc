import { useContext, useState } from "react";
import { MarketplaceContext } from "../../App";
import { ethers, BigNumber } from "ethers";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Blockies from "react-blockies";
import AddTokenModal from "../add-token-modal";
import { toast } from "react-toastify";
import Header from "../header";
import "./styles/styles.css";

const Account = () => {
  const [active, setActive] = useState("");
  const { account, masterData } = useContext(MarketplaceContext);

  const ethBalance = ethers.utils.formatEther(
    BigNumber.from(masterData.ethBalance || 0)
  );
  const tokenBalance = ethers.utils.formatEther(
    BigNumber.from(masterData.tokenBalance || 0)
  );
  const getString = (str) => {
    if (str.length > 35) {
      return (
        str.substr(0, 13) + "...." + str.substr(str.length - 13, str.length)
      );
    }
    return str;
  };

  const toastHandler = (type) => {
    switch (type) {
      case "success":
        toast[type]("Token minted successfully!");
        break;
      case "error":
        toast[type]("Failed to mint token!");
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Header />
      <div className="account-container">
        <div className="panel panel-container">
          <div className="panel-header text-center">
            <Blockies seed={account + account} />
            <div className="panel-title h5 mt-10">{getString(account)}</div>
            <div className="panel-subtitle">
              <CopyToClipboard
                text={account}
                onCopy={() => toast.success("Copied successfully")}
              >
                <i className="icon icon-copy copy"></i>
              </CopyToClipboard>
            </div>
          </div>
          <div className="panel-body">
            <div className="tile tile-centered">
              <div className="tile-content">
                <div className="tile-title text-bold">Ethereum</div>
                <div className="tile-subtitle">ETH Balance</div>
              </div>
              <div className="tile-action">{ethBalance}</div>
            </div>
            <div className="tile tile-centered">
              <div className="tile-content">
                <div className="tile-title text-bold">Token</div>
                <div className="tile-subtitle">{masterData.tokenSymbol} Balance</div>
              </div>
              <div className="tile-action">{tokenBalance}</div>
            </div>
          </div>
          <div className="panel-footer">
            <button
              className="btn btn-primary btn-block"
              onClick={() => setActive("active")}
            >
              MINT
            </button>
          </div>
        </div>
      </div>
      {active && (
        <AddTokenModal
          close={() => setActive("")}
          active={active}
          toastHandler={toastHandler}
        />
      )}
    </div>
  );
};

export default Account;

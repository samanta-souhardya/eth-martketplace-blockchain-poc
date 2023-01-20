import { useContext } from "react";
import { MarketplaceContext } from "../../App";
import { Link } from "react-router-dom";
import Blockies from "react-blockies";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/styles.css";

const Header = () => {
  const { account } = useContext(MarketplaceContext);
  const pathname = window.location.pathname.replace("/", "");
  const all = pathname === "" ? "active" : "";
  const owned = pathname === "owned" ? "active" : "";
  const create = pathname === "create" ? "active" : "";
  const _account = pathname === "account" ? "active" : "";

  const getString = (str) => {
    if (str.length > 35) {
      return str.substr(0, 4) + "..." + str.substr(str.length - 4, str.length);
    }
    return str;
  };
  
  return (
    <header className="navbar">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <section className="navbar-section">
        {" "}
        <h5>MarketPlace</h5>
      </section>
      {account && (
        <>
          <section className="navbar-center">
            <ul className="tab tab-block">
              <li className={`tab-item ${all}`}>
                <Link to="/">All</Link>
              </li>
              <li className={`tab-item ${owned}`}>
                <Link to="/owned">Owned</Link>
              </li>
              <li className={`tab-item ${create}`}>
                <Link to="/create">Create</Link>
              </li>
              <li className={`tab-item ${_account}`}>
                <Link to="/account">Account</Link>
              </li>
            </ul>
          </section>
          <section className="navbar-section">
            <div className="blockies">
              <Blockies seed={account + account} size={8} />
            </div>
            {getString(account)}
          </section>
        </>
      )}
    </header>
  );
};

export default Header;

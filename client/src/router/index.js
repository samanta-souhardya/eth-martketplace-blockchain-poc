import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateNFT from "../components/create-nft";
import OwnedNFTS from "../components/owned-nfts";
import HomePage from "../components/homepage";
import Account from "../components/account";
import NFTPage from "../components/nft-page";
import PrivateRoutes from "./PrivateRoutes";

const RouteHandler = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateNFT />} />
          <Route path="/owned" element={<OwnedNFTS />} />
          <Route path="/account" element={<Account />} />
          <Route path="/nft/:tokenId" element={<NFTPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default RouteHandler;

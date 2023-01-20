import { useContext } from "react";
import { MarketplaceContext } from "../../App";
import Header from "../header";
import ListedNFTS from "../listed-nft";

const HomePage = () => {
  const { account } = useContext(MarketplaceContext);
  return (
    <div>
      <Header />
      {account ? (
        <>
          <ListedNFTS />
        </>
      ) : (
        "Connect your wallet to access the marketplace"
      )}
    </div>
  );
};

export default HomePage;

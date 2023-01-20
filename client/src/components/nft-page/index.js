import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MarketplaceContext } from "../../App";
import Loader from "../../loader";
import { getOwnersList } from "../../services/rest";
import Header from "../header";
import Blockies from "react-blockies";
import "./styles/styles.css";

const NFTPage = () => {
  const { account } = useContext(MarketplaceContext);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tokenId } = useParams();

  const init = async () => {
    setLoading(true);
    try {
      const data = {
        account,
        tokenId,
      };
      const res = await getOwnersList(data);
      if (res) {
        const _owners = res.owners;
        setOwners(_owners);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header />
      {loading && <Loader />}
      <h5 className="text-center">Ownership timeline</h5>
      <div className="owned-page">
        <div className="timeline">
          {owners.map((owner, index) => {
            return (
              <div
                className="timeline-item"
                id="timeline-example-1"
                key={owner + index}
              >
                <div className="timeline-left">
                  <a
                    className="timeline-icon icon-lg"
                    href="#timeline-example-2"
                  >
                    <i className="icon icon-check"></i>
                  </a>
                </div>
                <div className="timeline-content">
                  <div className="blockies">
                    <Blockies seed={owner + owner} size={6} />
                    <b>{owner}</b>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NFTPage;

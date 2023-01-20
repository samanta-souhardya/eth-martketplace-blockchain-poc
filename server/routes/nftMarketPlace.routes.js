const express = require("express");
const router = express.Router();
const useNftMarketPlace = require("../controllers/nftMarketPlace.controller");
const useAssetTokenMiddleWare = require("../middlewares/assetToken.middleware");

const NFTMarketPlaceController = useNftMarketPlace();
const AssetTokenMiddleWare = useAssetTokenMiddleWare();
router.post("/nft/create", NFTMarketPlaceController.createNFT);
router.get("/nft/:tokenId", NFTMarketPlaceController.getNFTById);
router.post(
  "/nft/list/:tokenId",
  AssetTokenMiddleWare.enoughBalance,
  NFTMarketPlaceController.listNFT
);
router.post("/nft/cancel-list/:tokenId", NFTMarketPlaceController.cancelList);
router.post("/nft/owners/:tokenId", NFTMarketPlaceController.getOwners);
router.post(
  "/nft/buy/:tokenId",
  AssetTokenMiddleWare.enoughBalance,
  AssetTokenMiddleWare.transferAssetToken,
  NFTMarketPlaceController.buyNFT
);
router.post("/marketplace/entities", NFTMarketPlaceController.getMasterData);
router.post("/nft/owned", NFTMarketPlaceController.getOwnedItems);
router.post("/nft/listed", NFTMarketPlaceController.getListedNFTs);
router.post(
  "/nft/owned-listed",
  NFTMarketPlaceController.getOwnedAndListedNfts
);

router.post(
  "/marketplace/entities/balance",
  NFTMarketPlaceController.getTokenAndEth
);

module.exports = router;

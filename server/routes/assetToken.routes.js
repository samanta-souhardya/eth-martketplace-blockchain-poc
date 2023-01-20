const express = require("express");
const router = express.Router();
const useAssetToken = require("../controllers/assetToken.controller");
const useAssetTokenMiddleWare = require("../middlewares/assetToken.middleware");
//initialising the controller
const AssetTokenController = useAssetToken();
//initialising middleware
const AssetTokenMiddleWare = useAssetTokenMiddleWare();

router.get("/token/name", AssetTokenController.getName);
router.get("/token/symbol", AssetTokenController.getSymbol);
router.get("/token/balance/:account", AssetTokenController.getTokenBalance);
router.post("/token/mint", AssetTokenController.mint);
router.post(
  "/token/transfer",
  AssetTokenMiddleWare.enoughBalance,
  AssetTokenController.transferAssetToken
);
module.exports = router;

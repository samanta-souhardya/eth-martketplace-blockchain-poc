require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
const AssetTokenRoutes = require("./routes/assetToken.routes");
const NFTMarketPlaceRoutes = require("./routes/nftMarketPlace.routes");
const UserRoutes = require("./routes/user.routes");
const cors = require("cors");

//middleware parser
app.use(express.json());
app.use(cors());

//routes
app.use(AssetTokenRoutes);
app.use(NFTMarketPlaceRoutes);
app.use(UserRoutes);

//server listener
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

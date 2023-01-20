const { create } = require("ipfs-http-client");
require("dotenv").config();

const ipfsClient = create(process.env.IPFS_API);

module.exports = ipfsClient;

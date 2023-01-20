import { create } from "ipfs-http-client";
const ipfsClient = create(process.env.REACT_APP_IPFS_API);

export default ipfsClient;

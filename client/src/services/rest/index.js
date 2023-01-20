import axios from "axios";

export const getMasterData = async (account) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/marketplace/entities`,
        data: {
          account,
        },
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const createNFT = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/nft/create`,
        data,
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const mintAST = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/token/mint`,
        data,
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const getTokenBalance = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const { account } = data;
      const res = await axios({
        method: "get",
        url: `http://localhost:4000/token/balance/${account}`,
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const getOwnedNfts = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/nft/owned`,
        data,
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const listNFT = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const { tokenId, account, amount } = data;
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/nft/list/${tokenId}`,
        data: {
          account,
          amount,
        },
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const getListedNFTs = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/nft/listed`,
        data,
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const buyNFT = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const { tokenId, amount, account, to } = data;
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/nft/buy/${tokenId}`,
        data: {
          account,
          amount,
          to,
          from: account,
        },
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const getOwnersList = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const { tokenId, account } = data;
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/nft/owners/${tokenId}`,
        data: {
          account,
        },
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const getOwnedAndListedNfts = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/nft/owned-listed`,
        data,
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const getTokenAndEth = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/marketplace/entities/balance`,
        data,
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

export const cancelListing = async (data) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const { account, tokenId } = data;
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/nft/cancel-list/${tokenId}`,
        data: {
          account,
        },
      });
      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

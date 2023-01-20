const User = require("../model/user");
const ethers = require("ethers");
const crypto = require("crypto-js");
require("dotenv").config();
const provider = require("../utilities/provider");

const useAuth = () => {
  const signUp = async (req, res, next) => {
    const user = new User(req.body);
    try {
      await user.save();
      res.status(201).send("Account created login to continue");
    } catch (error) {
      res.status(400).send(error);
      console.log(error);
    }
  };

  const login = async (req, res, next) => {
    const {
      body: { email, password },
    } = req;
    try {
      const user = await User.findByCredentials(email, password);
      user.isLoggedIn = true;
      let result = await user.save();
      result = result.toObject();
      delete result["password"];
      delete result["privateKey"];
      delete result["publicKey"];
      delete result["__v"];
      res.status(200).send(result);
    } catch (error) {
      res.status(404).send(error);
      console.log(error);
    }
    next();
  };

  const logout = async (req, res, next) => {
    try {
      const {
        body: { id },
      } = req;
      const user = await User.findById(id);
      if (user) {
        user.isLoggedIn = false;
        await user.save();
        res.status(200).send("Logged Out");
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  const createWallet = async (req, res, next) => {
    try {
      const {
        body: { id },
      } = req;
      const user = await User.findById(id);
      const wallet = new ethers.Wallet.createRandom();
      const encrypted = crypto.AES.encrypt(
        wallet.privateKey,
        process.env.CIPHER_KEY
      );
      user.privateKey = encrypted;
      user.publicKey = wallet.publicKey;
      user.address = await wallet.getAddress();
      await user.save();
      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };
  return {
    login,
    signUp,
    createWallet,
    logout,
  };
};

module.exports = useAuth;

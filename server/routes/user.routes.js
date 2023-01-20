const express = require("express");
const router = express.Router();
const useUserController = require("../controllers/user.controller");
const useUserMiddleWare = require("../middlewares/user.middleware");
const UserController = useUserController();
const UserMiddelWare = useUserMiddleWare();

router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.post(
  "/create/wallet",
  UserMiddelWare.loggedIn,
  UserController.createWallet
);

module.exports = router;

const User = require("../model/user");

const useUserMiddleWare = () => {
  const loggedIn = async (req, res, next) => {
    try {
      const {
        body: { id },
      } = req;
      const user = await User.findById(id);
      if (user) {
        if (user.isLoggedIn) {
          req.user = user;
          next();
        } else {
          throw new Error("Please login to continue");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      res.status(401).send(error);
    }
  };
  return {
    loggedIn,
  };
};

module.exports = useUserMiddleWare;

import userModel from "../models/userModel.js";
const checkAdmin = async (req, user, next) => {
  try {
    const user = await userModel.findOne({ _id: req.user.userId });

    if (!user.isAdmin) {
      return next("Only admin can post jobs");
    }
    next();
  } catch (e) {
    console.log(e);
    return next("auth failed");
  }
};
export default checkAdmin;

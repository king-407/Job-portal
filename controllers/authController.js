import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      next("credentials required");
    }
    const usere = await userModel.findOne({ email });
    if (usere) {
      return next("User exist");
    }
    const entry = {
      name,
      email,
      password,
    };
    if (req.body.isAdmin) {
      entry.isAdmin = true;
    }
    const user = await userModel.create(entry);
    const token = user.createJWT();
    console.log(token);
    res.status(200).send({
      succes: true,
      message: "User created sucessfully",
      user,
      token,
    });
  } catch (e) {
    next(e);
  }
};
export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next("Please provide field");
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      next("user not found");
    }
    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      return next("Invalid credentials");
    }
    const token = user.createJWT();
    return res.status(200).json({ success: "true", user, token });
  } catch (e) {
    next(e);
  }
};

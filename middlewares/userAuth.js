import jwt from "jsonwebtoken";
const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(202).send("Login to continue");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.jwt_secret);
    req.user = { userId: payload.userId };
    next();
  } catch (e) {
    console.log("error occured");
    return next("auth failed");
  }
};
export default userAuth;

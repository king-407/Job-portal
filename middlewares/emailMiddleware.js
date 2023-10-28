import applicationModel from "../models/applicationModel.js";
export const emailMiddleware = async (req, res, next) => {
  const { jobId } = req.body;
  let users;
  try {
    users = await applicationModel
      .find({ job: jobId })
      .populate("job")
      .populate("user");

    req.persons = users;

    next();
  } catch (e) {
    console.log(e);
  }
};

import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";
export const createJob = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    return next("Please provide all fields");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  return res.status(201).json(job);
};
export const getAllJobs = async (req, res, next) => {
  const { status, search } = req.query;
  let objectquery = {
    createdBy: req.user.userId,
  };
  if (status) {
    objectquery.status = status;
  }
  if (search) {
    objectquery.position = { $regex: search, $options: "i" };
  }
  const jobs = await jobsModel.find(objectquery);

  res.status(200).json({
    totaljobs: jobs.length,
    jobs,
  });
};
export const updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  //validation
  if (!company || !position) {
    next("Please Provide All Fields");
  }
  //find job
  const job = await jobsModel.findOne({ _id: id });
  //validation
  if (!job) {
    next(`no jobs found with this id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("Your Not Authorized to update this job");
    return;
  }
  const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  //res
  res.status(200).json({ updateJob });
};
export const jobStats = async (req, res, next) => {
  let stats = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  stats = stats.map((item) => {
    const {
      _id: { year, month },
      count,
    } = item;
    const date = moment()
      .month(month - 1)
      .year(year)
      .format("MMM Y");
    return { date, count };
  });

  res.status(200).json({ stats });
};

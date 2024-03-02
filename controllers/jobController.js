import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";
import { jobsApplied } from "./userController.js";
export const createJob = async (req, res, next) => {
  const { company, position, workLocation, jobId } = req.body;

  if (!company || !position || !workLocation || !jobId) {
    return next("Please provide all fields");
  }
  req.body.createdBy = req.user.userId;

  const compan = await jobsModel.find({ company });

  const pos = await jobsModel.find({ position });
  const location = await jobsModel.find({ workLocation });
  const jobid = await jobsModel.find({ jobId });
  if (jobId) {
    return res.status(202).send({ msg: "This job id exist" });
  }
  if (pos.length && location.length && compan.length)
    return res.status(202).json({ err: "Duplicate job found" });
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
  const jobs = await jobsModel.find();
  console.log(jobsModel);
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
export const confirmDuplicate = async (req, res, next) => {
  const { decision, company, position, workLocation, jobId } = req.body;
  if (decision) {
    const job = new jobsModel({
      company,
      position,
      workLocation,
      jobId,
    });
    await job.save();
    return res.status(200).send(job);
  } else return res.status(200).json({ msg: "successfully cancelled message" });
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

import applicationModel from "../models/applicationModel.js";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
const sendMail = async (email, jobId) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "shivamtiwaritiwari0704@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });
    const mailOptions = {
      from: "shivamtiwaritiwari0704@gmail.com",
      to: email,
      subject: "For verification",
      html: "<p> Hii " + jobId + " ,Welcone ",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("mail sent successfully" + info);
      }
    });
  } catch (e) {}
};

export const updateUser = async (req, res, next) => {
  const { name, email, location } = req.body;
  if (!name || !email || !location) {
    return next("provide fields");
  }
  const user = await userModel.findOne({ _id: req.user.userId });
  user.name = name;
  user.email = email;
  user.location = location;
  await user.save();
  res.status(200).json({ user });
};
export const applyJobs = async (req, res, next) => {
  const { jobId } = req.body;
  const enterObject = {
    user: req.user.userId,
    job: jobId,
  };
  try {
    const job = await applicationModel.create(enterObject);
    return res.status(200).send(job);
  } catch (e) {
    console.log(e);
    return next("Some error occured in applying");
  }
};

export const jobsApplied = async (req, res, next) => {
  try {
    const user = await applicationModel
      .find({ user: req.user.userId })
      .populate("job", "company position status");

    return res.json(user);
  } catch (e) {
    console.log(e);
  }
};

export const recievedApplication = async (req, res, next) => {
  const { jobId } = req.body;
  let users;
  try {
    users = await applicationModel.find({ job: jobId }).populate("user");

    req.persons = users;
    res.status(200).send(users);

    next();
  } catch (e) {
    console.log(e);
  }
};
export const sendEMail = async (req, res, next) => {
  const { email, position } = req.body;
  console.log(req.persons);
  sendMail(email, position);
};
export const getUser = async (req, res, next) => {
  try {
    const user = await userModel.find();
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return next("Internal server error");
  }
};

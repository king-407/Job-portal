import express from "express";
import userAuth from "../middlewares/userAuth.js";
import {
  recievedApplication,
  sendEMail,
  updateUser,
} from "../controllers/userController.js";
import { applyJobs } from "../controllers/userController.js";
import { jobsApplied } from "../controllers/userController.js";
import checkAdmin from "../middlewares/adminMiddleware.js";
import { emailMiddleware } from "../middlewares/emailMiddleware.js";

const router = express.Router();

router.put("/update-user", userAuth, updateUser);
router.post("/job-apply", userAuth, applyJobs);
router.get("/jobs-applied", userAuth, jobsApplied);
router.get("/recieved", userAuth, checkAdmin, recievedApplication);
router.post("/sendMail", userAuth, checkAdmin, emailMiddleware, sendEMail);
export default router;

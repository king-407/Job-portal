import express from "express";
import userAuth from "../middlewares/userAuth.js";
import checkAdmin from "../middlewares/adminMiddleware.js";
import {
  createJob,
  getAllJobs,
  updateJobController,
} from "../controllers/jobController.js";
import { confirmDuplicate } from "../controllers/jobController.js";
import { jobStats } from "../controllers/jobController.js";
const router = express.Router();
router.post("/create-job", userAuth, checkAdmin, createJob);
router.get("/get-jobs", userAuth, getAllJobs);
router.patch("/update-job/:id", userAuth, updateJobController);
router.get("/job-stats", userAuth, jobStats);
router.post("/confirm", userAuth, checkAdmin, confirmDuplicate);
export default router;

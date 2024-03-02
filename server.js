import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import errorM from "./middlewares/errorMiddleware.js";
import userRoute from "./routes/userRoute.js";
import jobsRoute from "./routes/jobsRoute.js";

dotenv.config();

connectDB();

// dotenv.config({path})
const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (req, res, next) => {
  return res.status(200).send("welcome");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/jobs", jobsRoute);

app.use(errorM);

app.listen(port, () => {
  console.log(`Node server running in ${process.env.DEV_MODE} on ${port} `);
});

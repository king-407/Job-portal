import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    job: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);

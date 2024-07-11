const { required } = require("joi");
const mongoose = require("mongoose");

//we'll set status as pending by default=>while creating job
//then when modifying jobs=>we'll change status

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "please provide company name"],
      maxlength: 40,
    },
    position: {
      type: String,
      required: [true, "please provide position for which you are applying"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    //created by=>connect the job with the user
    //https://chatgpt.com/c/a6ecd182-91d6-4052-85d8-5dbe68e9ea33
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
    //extra props as these were present on frontend so to be able to handle them on backend also as it is a fullstack application
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      default: "my city", //on frintend it defaults top thsi,so on backend also it musts default to this
      required: true,
    },
  },
  { timestamps: true } //automatically creates 2 props handled by mongoose in db createdAt,updatedAt
);

module.exports = mongoose.model("Job", jobSchema);

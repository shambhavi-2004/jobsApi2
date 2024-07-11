const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

//for crud jobs

//only looking for jobs associated with some user
const getAllJobs = async (req, res) => {
  const allJobs = await Job.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ allJobs, count: allJobs.length });
};

//in the req.body we wont send cretedBy as that will be passed by the auth mw as req.user
//here in req header authorization must be present as jobs route is only available after authentication

const createJob = async (req, res) => {
  //adding the createdBy prop to req.body=>giving it value of userId
  req.body.createdBy = req.user.userId;
  //createdBy alwayts points to the user =>so user associasted with job cannot be modified
  //adding to db
  const jobCreated = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ jobCreated });
};

const getJob = async (req, res) => {
  //access jobs in param obj
  //access user=>from mw

  //getting userId from user obj of req obj
  //renamimg params id as jobId
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  //error =>wrong syntax object id(less letters) or wrong object id(same no of letters)
  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`no job with id:${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  //trying to update compnay as well as position
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!company || !position) {
    throw new BadRequestError(
      "enter some value fro comany and position fields"
    );
  }

  //new:true=>will return updated job document,runValidators=>perform validator check while creating the updated doc also

  const jobUpdated = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!jobUpdated) {
    throw new NotFoundError(`no job with id:${jobId}`);
  }
  res.status(StatusCodes.OK).json({ jobUpdated });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId }, //from auth mw
    params: { id: jobId }, //from req params
  } = req;

  const jobDelete = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!jobDelete) {
    throw new NotFoundError(`no job with id:${jobId}`);
  }
  res.status(StatusCodes.OK).send(); //just sending back 200
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };

const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

//we dont want to manually place the authMw on all these routes(get,post)=>intsead we'll just plac ethem in front of the app.use() route in app.js=>so all routes will be accessed via authentication
router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJob).delete(deleteJob).patch(updateJob);

module.exports = router;

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { UnauthenticatedError } = require("../errors");

//getting userId and pasting that along the jons route

const auth = async (req, res, next) => {
  //check header(this req is for requesting resource)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("unauthenticated error");
  }
  const token = authHeader.split(" ")[1];

  try {
    const extractPayload = jwt.verify(token, process.env.JWT_SECRET);

    //alternate =>putting the whole user in req.user=>not used as we dont have any functionality to remove that user(only remove job) so no need
    // const altUser = await User.findById(extractPayload.userId).select("-password");
    //select=> https://chatgpt.com/c/6ff865b9-123b-4f9d-8f78-da75f21daf2a
    // req.user = altUser;

    const { userId, name } = extractPayload;
    //pass payload to the job route i.e then first attach user to job routes
    req.user = { userId, name };
    next(); //so we'll go to the jobs route
  } catch (e) {
    throw new UnauthenticatedError("unauthenticated error");
  }
};

module.exports = auth;

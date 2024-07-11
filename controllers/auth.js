const User = require("../models/User");
//using status code dependency
const { StatusCodes } = require("http-status-codes");
//for hashing passwords
// const bcrpt = require("bcryptjs");
//for generating unique tokens
const jwt = require("jsonwebtoken");
//we can directly import index.js from an folder(default behaviour)
const { BadRequestError, UnauthenticatedError } = require("../errors");

//for login and register

const register = async (req, res) => {
  //this code block is too cluttered(used pre mw as an alternative)=>removing hashing functionality from here and creating a new mw for it (built in mongoose mw)
  // const { name, email, password } = req.body;
  // //why spread operator used
  // //https://chatgpt.com/share/f1ae3946-417f-4b2d-855c-8740d26fb071
  // //still th epassword is saved as a string in db(not safe)
  // //so if soemone access db =>he can access password of all users
  // //so bcryptjs used
  // //https://www.digitalocean.com/community/tutorials/how-to-handle-passwords-safely-with-bcryptsjs-in-javascript
  // //https://medium.com/@arunchaitanya/salting-and-hashing-passwords-with-bcrypt-js-a-comprehensive-guide-f5e31de3c40c
  // //creating a temp user(which will be passed on to create method)
  // //then giving it an hashed password=>run 2 methods gensalt,has of bcryptjs
  // //as hashed password length is more than maxLength remove it from schema validator
  // const salt = await bcrpt.genSalt(10);
  // const hashedPassword = await bcrpt.hash(password, salt);
  // const tempUser = { name, email, password: hashedPassword };
  // const userCreated = await user.create({ ...tempUser });
  const userCreated = await User.create({ ...req.body });
  //creating token(done via schema method)
  // const token = jwt.sign(
  //   { userId: userCreated._id, name: userCreated.name },
  //   "jwtSecret",
  //   { expiresIn: "30d" }
  // );
  const token = userCreated.createJwt();
  // console.log(tempUser);
  console.log("registered");
  console.log(token);

  //what we send as response(to frontend) is in our hands
  //we may send just the token also as there are ways to decode the user details on the frontend via just the token
  res.status(StatusCodes.CREATED).json({
    user: {
      name: userCreated.name,
      email: userCreated.email,
      lastName: userCreated.lastName,
      location: userCreated.location,
      token,
    },
  });
};

//first checking if getting email and password(if they dont send badreq)
//then checking if password entered is valid wity orig password that was paassed
//if such email presnt=>we'll send bcak user as response
const login = async (req, res) => {
  //doing the initial checking in controller itself
  const { email, password } = req.body;
  console.log(email, password);

  //extra verifiaction=>say if paswword not provided and comparepassword will result in an cutsomApierr
  //https://chatgpt.com/c/e3e2dc55-7252-4885-8f36-9a0d84dfd383
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }

  //finding user on basis of email=>this user has a hashed password
  const foundUser = await User.findOne({ email });
  //if unvalid user=>then the req is unauthenticated as user cant provide enough credentials to access resources
  if (!foundUser) {
    throw new UnauthenticatedError("invalid credentials");
  }

  //checking password
  //now as user found=>check if password provided by user correct
  //this arg is the orig password
  const isPasswordCorrect = await foundUser.comparePassword(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("invalid credentials");
  }

  //creating token=>as now after login user want to access resources =>so send the token back to it
  const token = foundUser.createJwt();
  //send the same token (200)

  res.status(StatusCodes.OK).json({
    user: {
      name: foundUser.name,
      email: foundUser.email,
      lastName: foundUser.lastName,
      location: foundUser.location,
      token,
    },
  }); //token is necessary,others is optional to snet back
};

//in case user want to update credentials of user
const updateUser = async (req, res) => {
  //as updateUser is executed after auth mw=>so user prop present on req obj
  // console.log(req.user);
  // console.log(req.body);

  const { email, name, lastName, location } = req.body;
  //in full stack applictaion we generally check on both frontend and backend that all the fields have some value in them
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("pls provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;
  //https://chatgpt.com/c/8070cde6-04ba-44ff-a226-400fb4eb0acd
  // In Mongoose, the save() method is used to save a document to the database
  await user.save(); //because of first register hased password now is the hasheed one and now after pre saved hook we were trying to hash the hashed password this is wrong so isModified added in pre save hook

  //if name changed then only token changes
  //if name is not chnaged then also tjis is done so a s to increase the duration of token as with createToken new and identical jwt token is created again thereby increasing the lifespan
  const token = user.createJwt();
  //as now name has changed=>so jwt generated diff

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
};

module.exports = { register, login, updateUser };
//how bcryptjs compare works
//https://chatgpt.com/c/e3e2dc55-7252-4885-8f36-9a0d84dfd383

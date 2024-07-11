const mongoose = require("mongoose");

//for hashing passwords
const bcrypt = require("bcryptjs");

//generating token
const jwt = require("jsonwebtoken");

//name,email,password
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minLength: 2,
    maxLength: 30,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    //checking for valid email via regular expression
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minLength: 6,
    // maxLength: 12,
  },
  //adding fror job2=>profile page
  /*So when I set up the front end,

I decided that there's also going to be a profile page where */
  //initially only defuaklt values set for user for lastname,location=>as our frontend is set up like that
  //there is also going to be a update route via which only=>where we can update the user and change the defualt values for lastname,location
  lastName: {
    type: String,
    trim: true,
    maxLength: 30,
    default: "last name",
  },
  location: {
    type: String,
    trim: true,
    maxLength: 30,
    default: "my city",
  },
});

//https://chatgpt.com/c/35badfa3-cfa4-4160-a859-9aaffa9c77c6
//next is accessible as pre is a built in MW
//alsways just before a document is going to be saved this is called
//and in this context "this" referes to the doc which is going to be saved
//This is because Mongoose binds the context of the document to this when calling the middleware function.
/*In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise. In particular, you can use async/await. */
userSchema.pre("save", async function () {
  /*
The expression !this.isModified("password") is typically used within Mongoose schema middleware, such as pre("save"), to determine if the document's password field has been modified before proceeding with certain operations. */
  if (!this.isModified("password")) {
    //we dont have a route or customMethod to modify password(basically orig password and the hashed one both always must remain same)
    return;
  }
  const salt = await bcrypt.genSalt(10);
  //this refers to current document
  this.password = await bcrypt.hash(this.password, salt);
  // next(); //will pass it on to the register func so we dont need any tempUser ,just spread the req body inside create
});

//we'll try to keep all our logic in one place
//like extracting resources out of that user=>we can do here also instead of controller
//so generation of jwt token doen here
//function instead of arrow as now this will point to the created document

//https://acte.ltd/utils/randomkeygen => Encryption key 256 put in env file
userSchema.methods.createJwt = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

//schema method used to keep controller clean
//arg=>password coming with  req
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("yes");
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  return isMatch;
};

module.exports = mongoose.model("User", userSchema);

//. In Mongoose, when you define a model and import it into your code, conventionally, the variable name representing the model should start with a capital letter. This is typically the case when you define your model like this:

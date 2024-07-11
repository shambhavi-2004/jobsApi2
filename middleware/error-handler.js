const { object } = require("joi");
const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong,try again later",
  };

  //nop need
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  //so the err object has a key of name code that has value 11000=>if this is the case3 send back=>keyvalue=>email as a response
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }); //instead we will send a customErr obj

  //dupliacte error
  if (err.code && err.code === 11000) {
    //modifying customError=>for better error responses=>as we know that 11000 means duplicate key scenario

    customError.msg = `duplicate value entered for ${Object.keys(
      err.keyValue
    )} field,pls choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  //validation error
  if (err.name === "ValidationError") {
    console.log("hello");
    console.log(Object.values(err.errors));

    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    console.log(customError.msg);
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customError.msg = `item not found with id:${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg }); //instead we will send a customErr obj
};

module.exports = errorHandlerMiddleware;

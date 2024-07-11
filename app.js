require("dotenv").config();
require("express-async-errors");
//extra security packages
const helmet = require("helmet");
// const cors = require("cors");
const xss = require("xss-clean");
// const rateLimiter = require("express-rate-limit");

// // swagger ui
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger.yaml");

const express = require("express");
const app = express();
//connect db
const connectDB = require("./db/connect");
//adding authMw
const auth = require("./middleware/authentication");
//importing routes
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//adding frontend=>react
const path = require("path");

//adding frontend files=>first task=>so first mw
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(express.json());
//invoking extra sceurity packages
// extra packages

app.use(helmet());
// app.use(cors());
app.use(xss());
// app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // (or limit)Limit each IP to 100 requests per windowMs
//   })
// );
//The parsed JavaScript object(swaggerDocument) is then served to the Swagger UI middleware, which takes care of rendering the API documentation.
//https://chatgpt.com/c/7043f5f6-8cdf-4682-b783-dd98655d6819
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
// app.get("/", (req, res) => {
//   res.send(`<h1>jobs api</h1><a href="/api-docs">Documentation</a>`);
// });

//tehy both are routes to the api the rest are routes that are handled by client/build
app.use("/api/v1/auth", authRouter);
//https://chatgpt.com/c/6ff865b9-123b-4f9d-8f78-da75f21daf2a

app.use("/api/v1/jobs", auth, jobsRouter);

//react router routes request
//index.html=>home page
//here in this req react apllication takes over
//while exceuting make sure you clear out the storage,because the front-end application relies on the storage.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3435;

const start = async () => {
  try {
    //connect db(this needs some time=>so await)

    await connectDB(process.env.MONGO_URI);
    //and then only listening to req on that port
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

//render=>evry time changes made to project,project will be redeployed on render

//limiting requests on a specific route=>to only login and register

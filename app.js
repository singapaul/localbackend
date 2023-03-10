const express = require("express");
const app = express();
const dotenv = require("dotenv");
const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require("./Utils/ErrorHandler");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

dotenv.config();

const connectDatabase = require("./config/database");
// Setting up the config.env file vars
dotenv.config({ path: "./config/config.env" });

// Handling uncaught excepton
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down due to uncaught exception`);
  process.exit(1);
});

// Connecting to the database
connectDatabase();

// prevent XSS attacks (through people trying to send scripts) in the req body
app.use(xssClean());

// prevent parameter polution
app.use(hpp());

// setup security headers
app.use(helmet());

// Setup rate limit
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, // 10 minutres
  max: 100,
});

// Setup CORS - accessible by other domains

app.use(cors());

app.use(limiter);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(express.json());

// Importing the routes

const places = require("./routes/places");

app.use("/api/v1", places);

// Handle unhandled routes
// This function has to come after the routes are imported in the line above
// all means all request types (GET, POST, DELETE e.t.c.). The * means all routes (every URL)
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

// The middleware has to be called last after the routes
app.use(errorMiddleware);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(
    `Server started on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// Handling unhandled promise rejection
// Automatically closes the connection
// This has to be done at the top of the app to catch any errors going down
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});

// console.log(adewfew);
// Will result in an ReferenceError not defined

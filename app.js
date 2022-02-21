const express = require("express");
const path = require('path')
const config = require("config");
const startDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 3000;

const coursesRouter = require('./routes/courses')

const logger = require("./middelware/logger");
const authentication = require("./middelware/authenticate");

// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view with pug
app.set('views', path.join(__dirname, "views")); //default
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// third-party middleware
app.use(helmet());

// to enable morgan just in development environment (// NODE_ENV=production)
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startDebugger("morgan is enabled!...");
}

// config part NODE_ENV=development app_password=anything
console.log(config.get("mail.password"));
console.log(config.get("name"));

// debug  DEBUG=app:startup  or DEBUG=app:db,app:startup or DEBUG=*
dbDebugger("db is enabled");

// custom middleware
app.use(logger);
app.use(authentication);



app.use("/api/courses", coursesRouter);

app.get("/", (req, res) => {
  // res.send("<h1>Hello Mahmoud</h1>");
  res.render('index', { title: 'my node app' })
});
app.get("/course", (req, res) => {
  // res.send("<h1>Hello Mahmoud</h1>");
  res.render('course', { title: 'my node app', course: courses[0] })
});

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
});

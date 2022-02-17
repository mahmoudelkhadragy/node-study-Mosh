const express = require("express");
const config = require("config");
const startDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 3000;
const validateCourse = require("./validations/validate-course");

const logger = require("./middelware/logger");
const authentication = require("./middelware/authenticate");

// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
];
let length = courses.length;

app.get("/", (req, res) => {
  res.send("<h1>Hello Mahmoud</h1>");
});

// get all courses
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// add course
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  length = length + 1;
  const course = {
    id: length,
    name: req.body.name,
  };
  courses.push(course);
  return res.send(course);
});

// get course by id
app.get("/api/courses/:id", (req, res) => {
  const id = req.params.id;
  const sortBy = req.query.sortBy;

  const course = courses.find((c) => c.id === +id);
  if (!course) {
    return res.status(404).send("The course with id given is invalid");
  }
  if (sortBy) res.send(`${id} + ${sortBy}`);
  res.send(course);
});

// update course
app.put("/api/courses/:id", (req, res) => {
  const id = req.params.id;
  const course = courses.find((c) => c.id === +id);
  if (!course) {
    return res.status(404).send("The course with id given is invalid");
  }
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // const index = courses.findIndex((c) => c.id === +id);
  // courses[index].name = result.value.name;
  course.name = req.body.name;
  res.send(course);
});

// delete course
app.delete("/api/courses/:id", (req, res) => {
  const id = req.params.id;
  const course = courses.find((c) => c.id === +id);
  if (!course) {
    return res.status(404).send("The course with id given is invalid");
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
});

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const validateCourse = require("./validations/validate-course");
app.use(express.json());

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

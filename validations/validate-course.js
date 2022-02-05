const Joi = require("joi");

const validateCourse = function (course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
};

module.exports = validateCourse;

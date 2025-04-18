const { check } = require("express-validator");

exports.signUpValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("institute", "Institute is required").not().isEmpty(),
  check("education_level", "Education Level is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty(),
];

exports.loginValidation = [
  check("email", "Please enter a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required").not().isEmpty(),
];

exports.counselingRequestValidation = [
  check("email", "Please enter a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("topic", "Topic is required").not().isEmpty(),
  check("counseling_date", "Please enter a valid date (YYYY-MM-DD)").isDate(),
  check("counseling_time", "Please enter a valid time (HH:MM:SS)").isString(),
];


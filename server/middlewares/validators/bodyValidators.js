const { body, check, validationResult } = require("express-validator");
const customError = (errors) => errors.map((e) => ({ msg: e.msg }));

module.exports.registerRules = [
  body("first_name")
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name must be more than 3 characters"),
  body("last_name")
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Last name must be more than 3 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .custom((value) => {
      if (!value.endsWith("@horizon-tech.tn")) {
        throw new Error("Email must end with @horizon-tech.tn");
      }
      return true;
    })
    .trim()
    .withMessage("Enter a valid email ending with @horizon-tech.tn"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password cannot be less than 8 characters"),
];

module.exports.loginRules = [
  body("email")
    .isEmail()
    .custom((value) => {
      if (!value.endsWith("@horizon-tech.tn")) {
        throw new Error("Email must end with @horizon-tech.tn");
      }
      return true;
    })
    .withMessage("Enter a valid email ending with @horizon-tech.tn"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password cannot be less than 8 characters"),
];

module.exports.createReportRules = [
  body().custom((value, { req }) => {
    if (!req.body) {
      throw new Error("Request body cannot be empty");
    }
    return true;
  }),
];

module.exports.createCompany = [
  body("companyName")
    .notEmpty()
    .trim()
    .withMessage("Please enter a company name"),
];

module.exports.createApplication = [ 
  body().custom((value, { req }) => {
    if (!req.body) {
      throw new Error("Request body cannot be empty");
    }
    return true;
  }),
];

module.exports.validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: customError(errors.array()) });
  }
  return next();
};

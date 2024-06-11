const { body, validationResult } = require("express-validator");
const validator = require("validator");
const customError = (errors) => errors.map((e) => ({ msg: e.msg }));

module.exports.registerRules = [
  body("first_name")
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Le prénom doit contenir plus de 3 caractères."),
  body("last_name")
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Le nom doit contenir plus de 3 caractères."),
  body("email")
    .isEmail()
    .normalizeEmail()
    .custom((value) => {
      if (!value.endsWith("@horizon-tech.tn")) {
        throw new Error(
          "L'adresse e-mail doit se terminer par @horizon-tech.tn"
        );
      }
      return true;
    })
    .trim()
    .withMessage(
      "Saisissez une adresse e-mail valide se terminant par @horizon-tech.tn"
    ),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères."),
];

module.exports.loginRules = [
  body("email")
    .isEmail()
    .custom((value) => {
      if (!value.endsWith("@horizon-tech.tn")) {
        throw new Error(
          "L'adresse e-mail doit se terminer par @horizon-tech.tn"
        );
      }
      return true;
    })
    .withMessage(
      "Saisissez une adresse e-mail valide se terminant par @horizon-tech.tn"
    ),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères."),
];

module.exports.createReportRules = [
  body().custom((value, { req }) => {
    if (!req.body) {
      throw new Error("Le corps de la requête ne peut pas être vide.");
    }
    return true;
  }),
];

module.exports.createCompany = [
  body("companyName")
    .notEmpty()
    .trim()
    .withMessage("Veuillez saisir un nom d'entreprise."),
];

module.exports.createApplication = [
  body().custom((value, { req }) => {
    if (!req.body) {
      throw new Error("Le corps de la requête ne peut pas être vide.");
    }
    return true;
  }),
];

module.exports.updateProfileRules = [
  body("first_name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Le prénom doit contenir plus de 3 caractères."),
  body("last_name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Le nom doit contenir plus de 3 caractères."),
  body("email")
    .custom((value, { req }) => {
      if (value.trim() !== "") {
        if (!value.endsWith("@horizon-tech.tn")) {
          throw new Error(
            "L'adresse e-mail doit se terminer par @horizon-tech.tn"
          );
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error("Entrer une adress email valide");
        }
      }
      return true;
    })
    .optional({ nullable: true, checkFalsy: true })
    .normalizeEmail()
    .trim()
    .withMessage(
      "Saisissez une adresse e-mail valide se terminant par @horizon-tech.tn"
    ),
  body("password").custom((value, { req }) => {
    if (value.trim() !== "") {
      if (!validator.isLength(value, { min: 8 })) {
        throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
      }
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

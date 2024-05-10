const express = require("express");

const IsAuth = require("../middlewares/authorization/IsAuth");

const {
  getAllAccounts,
  updateUser,
  uploadProfileImage,
  getOneAccount,
} = require("../controllers/accountControllers");
const {
  validator,
  updateProfileRules,
} = require("../middlewares/validators/bodyValidators");

const router = express.Router();

/**
 *@method GET /account/
 *@description  get all users
 *@access authenticated user
 */
router.get("/", IsAuth(), getAllAccounts);

/**
 *@method PUT /account/edit/:id
 *@description  update user
 *@access authenticated user
 */
router.put("/edit/:id", updateProfileRules, validator, updateUser);

/**
 *@method PUT /account/edit/pfp/:id
 *@description  update user pfp
 *@access authenticated user
 */
router.put("/edit/pfp/:id", uploadProfileImage);

/**
 *@method GET /account/
 *@description  get one user
 *@access authenticated user
 */
router.get("/:id", getOneAccount);

module.exports = router;

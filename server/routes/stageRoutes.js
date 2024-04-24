const express = require("express");

const {
  validator,
  registerRules,
  loginRules,
  editUserRules,
} = require("../middlewares/validators/bodyValidators");
const {
  addCompany,
  getallCompanies,
  deleteCompany,
  addApplication,
  getallApplications,
  updateApplication,
} = require("../controllers/stageControllers");
const router = express.Router();

/**
 *@method POST /company/add
 *@description add a new company
 *@access protected(authentifié+role:student)
 */

router.post("/company/add", addCompany);

/**
 * @route get /company/
 * @description get all companies
 * @access protected(authentifié+role:student)
 */
router.get("/company/", getallCompanies);

/**
 *@method DELETE /company/delete/${companyID}`
 *@description delete a company
 *@access protected(authentifié+role:student)
 */

router.delete("/company/delete/:companyID", deleteCompany);

/**
 *@method POST /application/add
 *@description add a new application
 *@access protected(authentifié+role:student)
 */

router.post("/application/add", addApplication);

/**
 * @route get /application/
 * @description get all applications
 * @access protected(authentifié+role:admin)
 */
router.get("/application/", getallApplications);

/**
 * @route patch /application/edit
 * @description update  application
 * @access protected(authentifié+role:admin)
 */
router.patch("/application/edit", updateApplication);

module.exports = router;
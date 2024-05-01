const express = require("express");

const {
  validator,
  createReportRules,
} = require("../middlewares/validators/bodyValidators");
const {
  createReport,
  downloadReport,
  getAllReports,
  updateReport,
} = require("../controllers/rapportController");

const router = express.Router();

/**
 *@method POST /rapport/add
 *@description post a report
 *@access protected(authentifié+role:student)
 */

router.post("/add", createReportRules, validator, createReport);

/**
 * @method GET /rapport
 * @description Get all reports
 * @access Protected (only accessible to authenticated users)
 */
router.get("/", getAllReports);

/**
 * @method GET /rapport
 * @description download report
 * @access Protected (only accessible to authenticated users)
 */
router.get("/:id/download/uploads/:filename", downloadReport);

/**
 * @method PUT /rapport/:id
 * @description update report
 * @access Protected (only accessible to authenticated users)
 */
router.put("/:id", createReportRules, validator, updateReport);

module.exports = router;

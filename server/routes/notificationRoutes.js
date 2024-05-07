const express = require("express");

const {
  validator,
  createCompany,
  createApplication,
} = require("../middlewares/validators/bodyValidators");

const {
  getAllNotifications,
  postNotification,
  markNotificationAsRead,
} = require("../controllers/notificationControllers");
const router = express.Router();

/**
 *@method POST /notification/add
 *@description create notification
 *@access protected(authentifié+role:student)
 */

router.post("/add", postNotification);

/**
 * @route get /notification/
 * @description get all notifications
 * @access protected(authentifié+role:student)
 */
router.get("/", getAllNotifications);

/**
 * @method PUT /notification/:id
 * @description update notification
 * @access Protected (only accessible to authenticated users)
 */
router.put("/:id", markNotificationAsRead);

module.exports = router;

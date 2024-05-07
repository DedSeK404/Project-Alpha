const NotificationModel = require("../models/notificationModel");

// Function to post a notification
module.exports.postNotification = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const {
      sender,
      teacher_id,
      student,
      message,
      toAdmin,
      adminStatus,
      teacherStatus,
      studentStatus,
      isEdited
    } = req.body;

    // Create a new notification
    const notification = new NotificationModel({
      sender,
      teacher_id,
      student,
      message,
      toAdmin,
      adminStatus,
      teacherStatus,
      studentStatus,
      isEdited
    });

    // Save the notification to the database
    await notification.save();

    res.status(201).send({ msg: "Notification posted successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.getAllNotifications = async (req, res) => {
  try {
    // Retrieve all notifications from the database
    const notifications = await NotificationModel.find();

    res.send({ notifications });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.markNotificationAsRead = async (req, res) => {
  try {
    // Extract the notification ID and user role from the request body
    const { notificationId, role } = req.body;

    // Determine the status field to update based on the user role
    let statusField;
    switch (role) {
      case "admin":
        statusField = "adminStatus";
        break;
      case "teacher":
        statusField = "teacherStatus";
        break;
      case "student":
        statusField = "studentStatus";
        break;
      default:
        throw new Error("Invalid user role");
    }

    // Update the appropriate status field
    const update = {};
    update[statusField] = "read";
    await NotificationModel.findByIdAndUpdate(notificationId, update);

    res.status(200).send({ msg: "Notification marked as read" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

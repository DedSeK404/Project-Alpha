const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  toAdmin: { type: Boolean },
  isEdited: { type: Boolean, default: false },
  student: { type: String, required: true },
  teacher_id: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  adminStatus: { type: String, enum: ["read", "unread"], default: "unread" },
  teacherStatus: { type: String, enum: ["read", "unread"], default: "unread" },
  studentStatus: { type: String, enum: ["read", "unread"], default: "unread" },
});

const NotificationModel = mongoose.model("Notification", notificationSchema);

module.exports = NotificationModel;

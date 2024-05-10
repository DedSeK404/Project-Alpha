const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  password: { type: String },
  created_on: { type: Date, default: Date.now() },
  img: {
    type: String,
    default:
      "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg",
  },
  adress: { type: String },
  birthDate: { type: Date },
  phone: { type: String },
  role: {
    type: String,
    enum: ["teacher", "student"],
    default: "student",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

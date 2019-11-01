const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  applicationRole: { type: String, required: true },
  company: { type: Schema.ObjectId, ref: "Company", default: null },
  application: { type: Schema.ObjectId, ref: "Application", default: null },
  userName: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  role: { type: Schema.ObjectId, ref: "Role", default: null },
  userInformation: { type: Schema.ObjectId, ref: "Information", default: null },
  userConfigurations: {
    type: Schema.ObjectId,
    ref: "UserConfigurations",
    default: null
  },
  profileImage: { type: Schema.ObjectId, ref: "Image", default: null },
  followings: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  createdAt: { type: String, default: null },
  updatedAt: { type: String, default: null },
  deletedAt: { type: String, default: null }
});

module.exports = mongoose.model("User", UserSchema);

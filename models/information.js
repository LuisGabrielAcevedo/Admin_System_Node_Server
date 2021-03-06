const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InformationSchema = Schema({
  documentType: { type: String, default: null },
  documentNumber: { type: String, default: null },
  birthdate: { type: String, default: null },
  gender: { type: String, default: null },
  phone: { type: String, default: null },
  address: { type: Object, default: null },
  createdAt: { type: String, default: null },
  updatedAt: { type: String, default: null },
  deletedAt: { type: String, default: null }
});

module.exports = mongoose.model("Information", InformationSchema);

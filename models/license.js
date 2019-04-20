const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LicenseSchema = Schema({
    code: { type: String, required: true },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    admin: { type: Schema.ObjectId, ref: 'User', default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null },
    expirateAt: { type: String, required: true }
});

module.exports = mongoose.model('License', LicenseSchema);
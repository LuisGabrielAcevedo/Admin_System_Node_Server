const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = Schema({
    vendorName: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone1: { type: String, default: null },
    phone2: { type: String, default: null },
    createdBy: { type: Schema.ObjectId, ref: 'Company', required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Vendor', VendorSchema);
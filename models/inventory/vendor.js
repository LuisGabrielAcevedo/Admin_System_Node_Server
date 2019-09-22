const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = Schema({
    name: { type: String, required: true },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: Schema.ObjectId, ref: 'Country', required: true },
    state: { type: Schema.ObjectId, ref: 'State', required: true },
    city: { type: String, required: true },
    zip: { type: String, default: null },
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    companyPhone: { type: String, required: true },
    companyWebsite: { type: String, required: true },
    companyAddress: {
        street: { type: String, default: null },
        number: { type: String, default: null },
        floor: { type: String, default: null },
        office: { type: String, default: null }
    },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Vendor', VendorSchema);
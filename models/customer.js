const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: Schema.ObjectId, ref: 'Company', default: null },
    application: { type: Schema.ObjectId, ref: 'Application', default: null },
    phone: { type: String, default: null },
    cellPhone: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    profileImage: { type: Schema.ObjectId, ref: 'Image', default: null },
    customerInformation: { type: Schema.ObjectId, ref: 'Information', default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Customer', CustomerSchema);
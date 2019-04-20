const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null },
    phone: { type: String, default: null },
    status: { type: String, default: null },
    statusAt: { type: String, default: null },
    documentType: { type: String, default: null },
    documentNumber: { type: String, default: null },
    company: { type: Schema.ObjectId, ref: 'Company', default: null },
    profileImage: {
        fileName: { type: String, default: null },
        url: { type: String, default: null },
        directory: { type: String, default: null }
    }
});

module.exports = mongoose.model('Customer', CustomerSchema);
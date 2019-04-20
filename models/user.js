const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    userName: { type: String, default: null },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null },
    documentType: { type: String, default: null },
    documentNumber: { type: String, default: null },
    rol: { type: Schema.ObjectId, ref: 'Rol', default: null },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    application: { type: Schema.ObjectId, ref: 'Application', required: true },
    language: { type: String, default: null },
    profileImage: {
        fileName: { type: String, default: null },
        url: { type: String, default: null },
        directory: { type: String, default: null }
    },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);
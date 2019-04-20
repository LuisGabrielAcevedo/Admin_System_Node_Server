const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null },
    profileImage: {
        fileName: { type: String, default: null },
        url: { type: String, default: null },
        directory: { type: String, default: null }
    }
});

module.exports = mongoose.model('Admin', AdminSchema);
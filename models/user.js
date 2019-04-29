const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    userName: { type: String, default: null },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    status: { type: String, default: null },
    secret: { type: String, default: null },
    token: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    role: { type: Schema.ObjectId, ref: 'Role', default: null },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    application: { type: Schema.ObjectId, ref: 'Application', required: true },
    userConfigurations: { type: Schema.ObjectId, ref: 'UserConfigurations', default: null },
    profileImage: { type: Schema.ObjectId, ref: 'Image', required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    application: { type: Schema.ObjectId, ref: 'Application', required: true },
    permissions: [{ type: Schema.ObjectId, ref: 'Permission', default: [] }],
    stores: [{ type: Schema.ObjectId, ref: 'Store', default: [] }],
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Role', RoleSchema);
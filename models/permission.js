const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = Schema({
    name: { type: String, required: true },
    actionType: { type: String, required: true },
    description: { type: String, default: null },
    module: { type: String, default: null },
    pinCodeRequired: { type: Boolean, default: false },
    applications: [{ type: Schema.ObjectId, ref: 'Application', default: [] }],
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Permission', PermissionSchema);
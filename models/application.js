const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationSchema = Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    code: { type: String, default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Application', ApplicationSchema);
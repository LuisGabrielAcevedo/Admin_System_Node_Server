const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StateSchema = Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    country: {type: Schema.ObjectId, ref: 'Country', required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('State', StateSchema);
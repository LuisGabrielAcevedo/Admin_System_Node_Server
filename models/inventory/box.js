const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoxSchema = Schema({
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    product: { type: Schema.ObjectId, ref: 'Product', required: true },
    local: { type: Schema.ObjectId, ref: 'Local', required: true },
    quantityAvailable: { type: Number, default: 0 },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Box', BoxSchema);
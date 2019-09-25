const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoxSchema = Schema({
    name: { type: String, required: true },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    product: { type: Schema.ObjectId, ref: 'Product', required: true },
    rooms: [{ type: Schema.ObjectId, ref: 'Room', required: true }],
    quantity: { type: Number, default: 0 },
    description: { type: String, default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Box', BoxSchema)
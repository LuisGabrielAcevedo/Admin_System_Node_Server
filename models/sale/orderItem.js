const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = Schema({
    product: { type: Schema.ObjectId, ref: 'Product', required: true },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
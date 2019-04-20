const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    customer: { type: Schema.ObjectId, ref: 'Customer', default: null },
    orderItems: [{ type: Schema.ObjectId, ref: 'OrderItem', default: [] }],
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    total: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    paymentMethods: [{ type: Object, default: [] }],
    discount: { type: Number, default: 0 },
    status: { type: String, default: 'PENDING' },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Order', OrderSchema);
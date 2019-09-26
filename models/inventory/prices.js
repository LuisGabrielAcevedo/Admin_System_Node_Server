const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PriceSchema = Schema({
    store: { type: Schema.ObjectId, ref: 'Store', require: true },
    product: { type: Schema.ObjectId, ref: 'Product', required: true },
    price: { type: Number, default: 0 },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Price', BoxSchema)
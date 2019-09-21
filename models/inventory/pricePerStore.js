const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PricePerStoreSchema = Schema({
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    product: { type: Schema.ObjectId, ref: 'Product', required: true },
    store: { type: Schema.ObjectId, ref: 'Store', required: true },
    price: { type: Number, default: 0 },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('PricePerStore', PricePerStoreSchema);
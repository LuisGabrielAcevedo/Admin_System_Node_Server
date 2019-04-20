const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscountPerProductSchema = Schema({
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    applyType: { type: String, required: true },
    value: { type: String, required: true },
    products: [{ type: Schema.ObjectId, ref: 'Product', default: null }],
    productCategories: [{ type: Schema.ObjectId, ref: 'Product', default: null }],
    productTypes: [{ type: Schema.ObjectId, ref: 'Product', default: null }],
    brands: [{ type: Schema.ObjectId, ref: 'Product', default: null }],
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Discount', DiscountSchema);
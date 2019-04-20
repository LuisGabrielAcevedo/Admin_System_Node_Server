const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductCategorySchema = Schema({
    name: { type: String, required: true },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    description: { type: String, default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);

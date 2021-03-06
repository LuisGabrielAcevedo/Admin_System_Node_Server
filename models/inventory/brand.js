const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = Schema({
    name: { type: String, required: true },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    vendors: [{ type: Schema.ObjectId, ref: 'Vendor', default: null }],
    image: { type: Schema.ObjectId, ref: 'Image', default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Brand', BrandSchema);
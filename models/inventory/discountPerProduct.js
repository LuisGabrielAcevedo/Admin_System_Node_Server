const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscountPerProductSchema = Schema({
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    product: { type: Schema.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    applyType: { type: String, required: true },
    value: { type: String, required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null },
});

module.exports = mongoose.model('DiscountPerProduct', DiscountPerProductSchema);

// Ejemplo

// {
//     company: '122121212212',
//     product: '34343dsdsd3wew32',
//     name: 'descuento del dia',
//     applyType: 'PERCENTAGE',
//     value: '10',
//     createdAt: 10/01/2019,
//     updatedAt: 15/01/2019
// }
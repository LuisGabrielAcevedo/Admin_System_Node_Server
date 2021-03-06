const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    capital: { type: String, required: true },
    languages: [{ type: String, required: true }],
    currencies: [{ type: String, required: true }],
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Country', CountrySchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = Schema({
    name: { type: String, required: true },
    nameInitials: { type: String, required: true },
    capital: { type: String, required: true },
    language: { type: String, required: true },
    currency: { type: String, required: true },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Country', CountrySchema);
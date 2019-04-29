const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserConfigurationsSchema = Schema({
    language: { type: String, default: 'es' },
    currentStore: { type: String, default: null },
    paletteSelected: { type: Number, default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('UserConfigurations', UserConfigurationsSchema);
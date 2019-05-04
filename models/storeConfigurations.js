const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreConfigurationsSchema = Schema({
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('StoreConfigurations', StoreConfigurationsSchema);
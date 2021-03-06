const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    address: { type: String, default: null },
    phone: { type: String, default: null },
    company: { type: Schema.ObjectId, ref: 'Company', required: true },
    application: { type: Schema.ObjectId, ref: 'Application', required: true },
    storeConfigurations: { type: Schema.ObjectId, ref: 'StoreConfigurations', default: null  },
    country: {type: Schema.ObjectId, ref: 'Country', required: true },
    city: { type: String, default: null },
    fax: { type: String, default: null },
    license: {type: Schema.ObjectId, ref: 'License', default: null },
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Store', StoreSchema);
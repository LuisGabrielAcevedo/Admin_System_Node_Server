const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = Schema({
    name: { type: String, required: true },
    application: { type: Schema.ObjectId, ref: 'Application', required: true },
    country: {type: Schema.ObjectId, ref: 'Country', required: true },
    logo: { type: Schema.ObjectId, ref: 'Image', default: null},
    profileImage: { type: Schema.ObjectId, ref: 'Image', default: null},
    currencies: [{ type: String, default: null }],
    admin: { type: Schema.ObjectId, ref: 'User', default: null },
    stores: [{ type: Schema.ObjectId, ref: 'Store', default: [] }],
    createdAt: { type: String, default: null },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
});

module.exports = mongoose.model('Company', CompanySchema);

